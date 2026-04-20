#!/usr/bin/env python3
"""
nmt-import.py — Конвертер запитань з .txt у JavaScript.

Підтримує три типи даних (--type):
  quiz     (default) — window.QUIZ_DATA   / блок для QUESTIONS_DB.quiz
  falling             — window.FALLING_DATA / блок для QUESTIONS_DB.falling
  timeline            — window.TIMELINE_DATA / блок для QUESTIONS_DB.timeline

Використання:
  python nmt-import.py <файл.txt> [--type quiz|falling|timeline] [--output quiz-data|db-entry]

Приклади:
  # Quiz / NMT (як раніше):
  python tools/nmt-import.py data/nmt/CH01-kozatska-doba.txt --output quiz-data > data/nmt/nmt-CH01.js
  python tools/nmt-import.py data/nmt/CH01-kozatska-doba.txt --output db-entry

  # Falling:
  python tools/nmt-import.py data/falling/CH02.txt --type falling --output quiz-data > data/falling/period-5-imperium.js
  python tools/nmt-import.py data/falling/CH02.txt --type falling --output db-entry

  # Timeline:
  python tools/nmt-import.py data/timeline/CH02.txt --type timeline --output quiz-data > data/timeline/period-5-imperium.js
  python tools/nmt-import.py data/timeline/CH02.txt --type timeline --output db-entry

Формат .txt:
  Quiz/NMT  — дивись data/nmt/CH01-kozatska-doba.txt
  Falling   — заголовок (#Title, #Section, #winScore тощо) + блоки QUESTION:/ANSWER:
  Timeline  — заголовок (#Title, #Section) + блоки ROUND: / EVENT:/YEAR:/DETAIL:
"""

import sys
import re
import argparse


# ── СПІЛЬНІ УТИЛІТИ ───────────────────────────────────────────────────────────

def parse_header(lines):
    """Парсить рядки заголовка виду '# Key: Value'."""
    header = {}
    for line in lines:
        line = line.strip()
        if not line.startswith('#'):
            break
        m = re.match(r'^#\s+(\w+):\s*(.+)$', line)
        if m:
            header[m.group(1)] = m.group(2).strip()
    return header


def js_string(s):
    """Екранує рядок для JS (апостроф → \\')."""
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')


# ── QUIZ / NMT ────────────────────────────────────────────────────────────────

def parse_theme(theme_str):
    """Парсить 'textColor=#333 accentColor=#007bff cardBg=#f9f9f9' у словник."""
    result = {}
    for pair in theme_str.split():
        if '=' in pair:
            k, v = pair.split('=', 1)
            result[k] = v
    if not all(k in result for k in ('textColor', 'accentColor', 'cardBg')):
        raise ValueError(
            f"Theme рядок повинен містити textColor, accentColor, cardBg. Отримано: {theme_str}"
        )
    return result


def parse_options(lines):
    """Парсить блок OPTIONS: — рядки виду '  - value: label text'."""
    options = []
    for line in lines:
        line = line.rstrip()
        m = re.match(r'^\s+-\s+([^:]+):\s*(.+)$', line)
        if m:
            options.append({'label': m.group(2).strip(), 'value': m.group(1).strip()})
    if not options:
        raise ValueError("OPTIONS блок порожній або невірного формату")
    return options


def parse_items(lines):
    """Парсить блок ITEMS: — рядки виду '  - itemId: label text'."""
    items = []
    for line in lines:
        line = line.rstrip()
        m = re.match(r'^\s+-\s+([^:]+):\s*(.+)$', line)
        if m:
            items.append({'id': m.group(1).strip(), 'label': m.group(2).strip()})
    if not items:
        raise ValueError("ITEMS блок порожній або невірного формату")
    return items


def parse_question_block(block_lines):
    """Парсить один блок запитання (між роздільниками ---)."""
    q = {}
    current_key = None
    sub_lines = []

    def flush_sub():
        nonlocal sub_lines
        if current_key == 'OPTIONS':
            q['options'] = parse_options(sub_lines)
        elif current_key == 'ITEMS':
            q['items'] = parse_items(sub_lines)
        sub_lines = []

    for line in block_lines:
        stripped = line.strip()
        # Пропускаємо коментарі типу "### Q1"
        if stripped.startswith('###'):
            continue
        if not stripped:
            continue

        # Перевіряємо мета-ключі
        m = re.match(r'^(TYPE|TEXT|CORRECT|PLACEHOLDER|GROUP|CORRECT_ORDER):\s*(.*)$', stripped)
        if m:
            flush_sub()
            current_key = m.group(1)
            val = m.group(2).strip()
            if current_key == 'TYPE':
                q['type'] = val.lower()
            elif current_key == 'TEXT':
                q['text'] = val
            elif current_key == 'CORRECT':
                q['correct'] = val
            elif current_key == 'PLACEHOLDER':
                q['placeholder'] = val
            elif current_key == 'GROUP':
                q['group'] = val
            elif current_key == 'CORRECT_ORDER':
                q['correctOrder'] = [s.strip() for s in val.split(',')]
            continue

        # Блоки підрядків (OPTIONS / ITEMS)
        m2 = re.match(r'^(OPTIONS|ITEMS):$', stripped)
        if m2:
            flush_sub()
            current_key = m2.group(1)
            continue

        # Продовження багаторядкового тексту
        if current_key == 'TEXT':
            q['text'] = q.get('text', '') + '\n' + stripped
        elif current_key in ('OPTIONS', 'ITEMS'):
            sub_lines.append(line)

    flush_sub()
    return q


def validate_question(q, idx):
    """Базова валідація запитання."""
    qtype = q.get('type')
    if not qtype:
        raise ValueError(f"Q{idx+1}: відсутній TYPE")
    if not q.get('text'):
        raise ValueError(f"Q{idx+1}: відсутній TEXT")
    if qtype == 'text':
        if not q.get('correct'):
            raise ValueError(f"Q{idx+1} (text): відсутній CORRECT")
    elif qtype == 'choice':
        if not q.get('group'):
            raise ValueError(f"Q{idx+1} (choice): відсутній GROUP")
        if not q.get('correct'):
            raise ValueError(f"Q{idx+1} (choice): відсутній CORRECT")
        if not q.get('options'):
            raise ValueError(f"Q{idx+1} (choice): відсутні OPTIONS")
        values = [o['value'] for o in q['options']]
        if q['correct'] not in values:
            raise ValueError(
                f"Q{idx+1} (choice): CORRECT '{q['correct']}' не збігається з жодним value у OPTIONS {values}"
            )
    elif qtype == 'sequence':
        if not q.get('correctOrder'):
            raise ValueError(f"Q{idx+1} (sequence): відсутній CORRECT_ORDER")
        if not q.get('items'):
            raise ValueError(f"Q{idx+1} (sequence): відсутні ITEMS")
        item_ids = {it['id'] for it in q['items']}
        for oid in q['correctOrder']:
            if oid not in item_ids:
                raise ValueError(
                    f"Q{idx+1} (sequence): CORRECT_ORDER містить id '{oid}', якого немає в ITEMS"
                )
    else:
        raise ValueError(f"Q{idx+1}: невідомий TYPE '{qtype}'. Дозволено: text, choice, sequence")


def check_group_uniqueness(questions):
    """Перевіряє унікальність GROUP у межах файлу."""
    seen = {}
    for i, q in enumerate(questions):
        g = q.get('group')
        if g:
            if g in seen:
                raise ValueError(
                    f"Q{i+1}: GROUP '{g}' вже використано у Q{seen[g]+1}. GROUP повинен бути унікальним"
                )
            seen[g] = i


def parse_file(path):
    """Повний парсинг quiz/NMT .txt файлу. Повертає (header_dict, questions_list)."""
    with open(path, encoding='utf-8') as f:
        content = f.read()

    # Розбиваємо на блоки по '---'
    raw_blocks = re.split(r'^\s*---\s*$', content, flags=re.MULTILINE)

    if len(raw_blocks) < 2:
        raise ValueError("Файл не містить жодного роздільника '---'")

    # Перший блок — заголовок
    header_lines = [l for l in raw_blocks[0].splitlines() if l.strip()]
    header = parse_header(header_lines)

    required_header = ('Chapter', 'Title', 'Password', 'Background', 'Theme')
    for key in required_header:
        if key not in header:
            raise ValueError(f"Заголовок файлу не містить поля '# {key}:'")

    # Решта блоків — запитання
    questions = []
    for i, block in enumerate(raw_blocks[1:]):
        lines = block.splitlines()
        non_empty = [l for l in lines if l.strip()]
        if not non_empty:
            continue
        q = parse_question_block(lines)
        if not q:
            continue
        validate_question(q, len(questions))
        questions.append(q)

    if not questions:
        raise ValueError("Файл не містить жодного запитання")

    check_group_uniqueness(questions)

    return header, questions


def render_question(q, indent='    '):
    """Генерує JS-об'єкт запитання (quiz/NMT)."""
    qtype = q['type']
    parts = [f"type: '{js_string(qtype)}'"]
    parts.append(f"text: '{js_string(q['text'])}'")

    if qtype == 'text':
        parts.append(f"correct: '{js_string(q['correct'])}'")
        if q.get('placeholder'):
            parts.append(f"placeholder: '{js_string(q['placeholder'])}'")

    elif qtype == 'choice':
        parts.append(f"group: '{js_string(q['group'])}'")
        parts.append(f"correct: '{js_string(q['correct'])}'")
        opts = []
        for o in q['options']:
            opts.append(f"{{ label: '{js_string(o['label'])}', value: '{js_string(o['value'])}' }}")
        parts.append('options: [\n' + indent + '  ' + (',\n' + indent + '  ').join(opts) + '\n' + indent + ']')

    elif qtype == 'sequence':
        order_js = ', '.join(f"'{js_string(oid)}'" for oid in q['correctOrder'])
        parts.append(f"correctOrder: [{order_js}]")
        items = []
        for it in q['items']:
            items.append(f"{{ id: '{js_string(it['id'])}', label: '{js_string(it['label'])}' }}")
        parts.append('items: [\n' + indent + '  ' + (',\n' + indent + '  ').join(items) + '\n' + indent + ']')

    inner = (',\n' + indent + '  ').join(parts)
    return f"{indent}{{ {inner} }}"


def build_entry_body(header, questions, indent='    '):
    """Генерує тіло quiz/NMT запису (без ключа)."""
    chapter = header['Chapter']
    title = header['Title']
    password = header['Password']
    bg = header['Background']
    theme = parse_theme(header['Theme'])

    bg_js = 'null' if bg.lower() == 'null' else f"'{js_string(bg)}'"

    q_strs = [render_question(q, indent + '  ') for q in questions]
    questions_js = ('[\n' + ',\n'.join(q_strs) + '\n' + indent + '  ]')

    return (
        f"{indent}{{\n"
        f"{indent}  title: '{js_string(title)}',\n"
        f"{indent}  background: {bg_js},\n"
        f"{indent}  theme: {{ textColor: '{theme['textColor']}', accentColor: '{theme['accentColor']}', cardBg: '{theme['cardBg']}' }},\n"
        f"{indent}  chapter: '{js_string(chapter)}',\n"
        f"{indent}  password: '{js_string(password)}',\n"
        f"{indent}  questions: {questions_js}\n"
        f"{indent}}}"
    )


def output_quiz_data(header, questions):
    """Виводить window.QUIZ_DATA = {...};"""
    body0 = build_entry_body(header, questions, indent='')
    chapter = header['Chapter']
    title = header['Title']
    print(f"/* nmt-{chapter}.js — {title}")
    print(f" * Джерело: .txt файл у data/nmt/")
    print(f" * Для оновлення: відредагуйте .txt і запустіть nmt-import.py знову.")
    print(f" */")
    print(f"window.QUIZ_DATA =")
    print(f"{body0};")


def output_db_entry(header, questions):
    """Виводить блок 'nmt-CH**': {...} для questions-db.js."""
    chapter = header['Chapter']
    inner = build_entry_body(header, questions, indent='    ')
    print(f"    'nmt-{chapter}': {inner.strip()},")


# ── FALLING ───────────────────────────────────────────────────────────────────

def parse_file_falling(path):
    """Парсить falling .txt файл. Повертає (header_dict, questions_list).

    Формат заголовка:
        # Title: Назва гри
        # Section: Розділ
        # winScore: 50          (optional, default 50)
        # lives: 3              (optional, default 3)
        # dropSpeed: 1          (optional, default 1)
        # addInterval: 5000     (optional, default 5000)
        # maxActive: 5          (optional, default 5)
        # winImage: path/img.jpg (optional, default null)

    Блоки запитань (розділені ---):
        QUESTION: текст питання
        ANSWER: правильна відповідь
    """
    with open(path, encoding='utf-8') as f:
        content = f.read()

    raw_blocks = re.split(r'^\s*---\s*$', content, flags=re.MULTILINE)

    if len(raw_blocks) < 2:
        raise ValueError("Файл не містить жодного роздільника '---'")

    header_lines = [l for l in raw_blocks[0].splitlines() if l.strip()]
    header = parse_header(header_lines)

    for key in ('Title', 'Section'):
        if key not in header:
            raise ValueError(f"Заголовок файлу не містить поля '# {key}:'")

    questions = []
    for i, block in enumerate(raw_blocks[1:]):
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines:
            continue
        q = {}
        for line in lines:
            m = re.match(r'^(QUESTION|ANSWER):\s*(.+)$', line)
            if m:
                key = m.group(1)
                val = m.group(2).strip()
                if key == 'QUESTION':
                    q['question'] = val
                elif key == 'ANSWER':
                    q['answer'] = val
        if 'question' not in q or 'answer' not in q:
            raise ValueError(
                f"Блок #{i+1} не містить обох полів QUESTION і ANSWER. Знайдено: {list(q.keys())}"
            )
        questions.append(q)

    if not questions:
        raise ValueError("Файл не містить жодного запитання")

    return header, questions


def _falling_js_fields(header):
    """Повертає словник полів для falling JS-виводу."""
    win_image = header.get('winImage', 'null')
    win_image_js = 'null' if win_image.lower() == 'null' else f"'{js_string(win_image)}'"
    return {
        'title': js_string(header['Title']),
        'section': js_string(header['Section']),
        'winScore': header.get('winScore', '50'),
        'lives': header.get('lives', '3'),
        'dropSpeed': header.get('dropSpeed', '1'),
        'addInterval': header.get('addInterval', '5000'),
        'maxActive': header.get('maxActive', '5'),
        'winImage': win_image_js,
    }


def output_falling_data(header, questions):
    """Виводить window.FALLING_DATA = {...};"""
    f = _falling_js_fields(header)
    q_parts = []
    for q in questions:
        qt = js_string(q['question'])
        qa = js_string(q['answer'])
        q_parts.append(f"  {{ question: '{qt}', answer: '{qa}' }}")
    questions_js = '[\n' + ',\n'.join(q_parts) + '\n]'
    print("/* Джерело: .txt файл")
    print(" * Для оновлення: відредагуйте .txt і запустіть nmt-import.py --type falling знову.")
    print(" */")
    print(f"window.FALLING_DATA = {{")
    print(f"  title: '{f['title']}',")
    print(f"  section: '{f['section']}',")
    print(f"  winScore: {f['winScore']},")
    print(f"  lives: {f['lives']},")
    print(f"  dropSpeed: {f['dropSpeed']},")
    print(f"  addInterval: {f['addInterval']},")
    print(f"  maxActive: {f['maxActive']},")
    print(f"  winImage: {f['winImage']},")
    print(f"  questions: {questions_js}")
    print("};")


def output_falling_db_entry(header, questions):
    """Виводить блок для questions-db.js (falling namespace)."""
    f = _falling_js_fields(header)
    # Derive key suggestion from section (user should rename to match existing convention)
    key_hint = header['Section'].lower().replace(' ', '-').replace("'", '').replace('(', '').replace(')', '')
    q_parts = []
    for q in questions:
        qt = js_string(q['question'])
        qa = js_string(q['answer'])
        q_parts.append(f"      {{ question: '{qt}', answer: '{qa}' }}")
    questions_js = '[\n' + ',\n'.join(q_parts) + '\n    ]'
    print(f"    /* Ключ: замініть '{key_hint}' на потрібний (наприклад, 'period-5-imperium') */")
    print(f"    '{key_hint}': {{")
    print(f"      title: '{f['title']}',")
    print(f"      section: '{f['section']}',")
    print(f"      winScore: {f['winScore']},")
    print(f"      lives: {f['lives']},")
    print(f"      dropSpeed: {f['dropSpeed']},")
    print(f"      addInterval: {f['addInterval']},")
    print(f"      maxActive: {f['maxActive']},")
    print(f"      winImage: {f['winImage']},")
    print(f"      questions: {questions_js}")
    print(f"    }},")


# ── TIMELINE ──────────────────────────────────────────────────────────────────

def parse_file_timeline(path):
    """Парсить timeline .txt файл. Повертає (header_dict, rounds_list).

    Формат:
        # Title: Хронологія: ...
        # Section: Розділ

        ---

        ROUND: Назва раунду

        ---

        EVENT: Назва події
        YEAR: 1648
        DETAIL: Необов'язковий опис

        ---

        EVENT: Інша подія
        YEAR: 1649
        DETAIL: ...

        ---

        ROUND: Другий раунд

        ---

        EVENT: ...

    Блоки з ROUND: починають новий раунд.
    Блоки з EVENT: додають подію до поточного раунду.
    """
    with open(path, encoding='utf-8') as f:
        content = f.read()

    raw_blocks = re.split(r'^\s*---\s*$', content, flags=re.MULTILINE)

    if len(raw_blocks) < 2:
        raise ValueError("Файл не містить жодного роздільника '---'")

    header_lines = [l for l in raw_blocks[0].splitlines() if l.strip()]
    header = parse_header(header_lines)

    for key in ('Title', 'Section'):
        if key not in header:
            raise ValueError(f"Заголовок файлу не містить поля '# {key}:'")

    rounds = []
    current_round = None

    for i, block in enumerate(raw_blocks[1:]):
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines:
            continue

        parsed = {}
        for line in lines:
            m = re.match(r'^(ROUND|EVENT|YEAR|DETAIL):\s*(.+)$', line)
            if m:
                parsed[m.group(1)] = m.group(2).strip()

        if 'ROUND' in parsed:
            current_round = {'name': parsed['ROUND'], 'events': []}
            rounds.append(current_round)
            # If EVENT is also in the same block — add it too
            if 'EVENT' in parsed:
                current_round['events'].append({
                    'text': parsed['EVENT'],
                    'year': parsed.get('YEAR', ''),
                    'detail': parsed.get('DETAIL', ''),
                })
        elif 'EVENT' in parsed:
            if current_round is None:
                raise ValueError(f"Блок #{i+1} містить EVENT без попереднього ROUND")
            current_round['events'].append({
                'text': parsed['EVENT'],
                'year': parsed.get('YEAR', ''),
                'detail': parsed.get('DETAIL', ''),
            })
        # Blocks with only unknown keys are skipped silently

    if not rounds:
        raise ValueError("Файл не містить жодного раунду (ROUND:)")
    for r in rounds:
        if not r['events']:
            raise ValueError(f"Раунд '{r['name']}' не містить жодної події (EVENT:)")

    return header, rounds


def _render_event(event, indent):
    """Генерує JS-об'єкт події хронології."""
    parts = [f"text: '{js_string(event['text'])}'", f"year: '{js_string(event['year'])}'"]
    if event['detail']:
        parts.append(f"detail: '{js_string(event['detail'])}'")
    return f"{indent}{{ {', '.join(parts)} }}"


def output_timeline_data(header, rounds):
    """Виводить window.TIMELINE_DATA = {...};"""
    title = js_string(header['Title'])
    section = js_string(header['Section'])

    rounds_js_parts = []
    for r in rounds:
        events_js = ',\n'.join(_render_event(e, '        ') for e in r['events'])
        rounds_js_parts.append(
            f"    {{\n"
            f"      name: '{js_string(r['name'])}',\n"
            f"      events: [\n{events_js}\n      ]\n"
            f"    }}"
        )
    rounds_js = ',\n'.join(rounds_js_parts)

    print("/* Джерело: .txt файл")
    print(" * Для оновлення: відредагуйте .txt і запустіть nmt-import.py --type timeline знову.")
    print(" */")
    print(f"window.TIMELINE_DATA = {{")
    print(f"  title: '{title}',")
    print(f"  section: '{section}',")
    print(f"  rounds: [\n{rounds_js}\n  ]")
    print("};")


def output_timeline_db_entry(header, rounds):
    """Виводить блок для questions-db.js (timeline namespace)."""
    title = js_string(header['Title'])
    section = js_string(header['Section'])
    key_hint = header['Section'].lower().replace(' ', '-').replace("'", '').replace('(', '').replace(')', '')

    rounds_js_parts = []
    for r in rounds:
        events_js = ',\n'.join(_render_event(e, '          ') for e in r['events'])
        rounds_js_parts.append(
            f"      {{\n"
            f"        name: '{js_string(r['name'])}',\n"
            f"        events: [\n{events_js}\n        ]\n"
            f"      }}"
        )
    rounds_js = ',\n'.join(rounds_js_parts)

    print(f"    /* Ключ: замініть '{key_hint}' на потрібний (наприклад, 'period-5-imperium') */")
    print(f"    '{key_hint}': {{")
    print(f"      title: '{title}',")
    print(f"      section: '{section}',")
    print(f"      rounds: [\n{rounds_js}\n    ]")
    print(f"    }},")


# ── ТОЧКА ВХОДУ ───────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description='Конвертер .txt запитань → JavaScript (quiz, falling, timeline)'
    )
    parser.add_argument('file', help='Шлях до .txt файлу з запитаннями')
    parser.add_argument(
        '--type',
        choices=['quiz', 'falling', 'timeline'],
        default='quiz',
        help='Тип даних: quiz (default, NMT-формат), falling, timeline'
    )
    parser.add_argument(
        '--output',
        choices=['quiz-data', 'db-entry'],
        default='quiz-data',
        help='quiz-data → window.*_DATA (standalone .js файл); db-entry → блок для questions-db.js'
    )
    args = parser.parse_args()

    try:
        if args.type == 'quiz':
            header, questions = parse_file(args.file)
            print(f"# Прочитано {len(questions)} запитань з {args.file}", file=sys.stderr)
            if args.output == 'quiz-data':
                output_quiz_data(header, questions)
            else:
                output_db_entry(header, questions)

        elif args.type == 'falling':
            header, questions = parse_file_falling(args.file)
            print(f"# Прочитано {len(questions)} запитань з {args.file}", file=sys.stderr)
            if args.output == 'quiz-data':
                output_falling_data(header, questions)
            else:
                output_falling_db_entry(header, questions)

        elif args.type == 'timeline':
            header, rounds = parse_file_timeline(args.file)
            total_events = sum(len(r['events']) for r in rounds)
            print(
                f"# Прочитано {len(rounds)} раундів ({total_events} подій) з {args.file}",
                file=sys.stderr
            )
            if args.output == 'quiz-data':
                output_timeline_data(header, rounds)
            else:
                output_timeline_db_entry(header, rounds)

    except (ValueError, IOError) as e:
        print(f"ПОМИЛКА: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
