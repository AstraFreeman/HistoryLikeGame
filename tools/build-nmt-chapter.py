#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-nmt-chapter.py — Збирає NMT-розділ із кількох raw .txt файлів.

Використання:
  python tools/build-nmt-chapter.py \\
    --code CH05 \\
    --title "НМТ: Україна у складі імперій" \\
    --password "Автономія" \\
    --accent "#6b4c8b" \\
    data/raw/250416-imperial.txt \\
    data/raw/250416-imperial2.txt

Результат:
  data/nmt/CH05-imperial.txt   — структурований NMT шаблон (потрібна перевірка відповідей)
  data/nmt/nmt-CH05.js         — скомпільований JS (via nmt-import.py)

Стратегія для відповідей (raw файли не мають ключів):
  sequence → CORRECT_ORDER = порядок із тексту (потрібна перевірка)
  choice   → CORRECT = перший варіант (заглушка, потрібна заміна)
  text     → CORRECT = TODO (потрібне ручне заповнення)
"""

import sys
import re
import os
import argparse
import subprocess
import difflib
import io

# ═══════════════════════════════════════════════════════════════════════════════
# КОНСТАНТИ
# ═══════════════════════════════════════════════════════════════════════════════

IMAGE_KEYWORDS = ['НА ФОТО', 'ФОТО', 'КАРТОСХЕМ', 'ЯКОЮ ЦИФРОЮ', 'РИСУНКУ', 'ЗОБРАЖЕНО', 'ПОРТРЕТ']
OPTION_LABELS = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Є', 'Ж', 'З', 'И', 'І']


# ═══════════════════════════════════════════════════════════════════════════════
# TYPE REGISTRY — розширюваний реєстр детекторів типів питань
#
# Щоб додати новий тип:
#   1. Написати функцію detector(text_upper: str) -> bool
#   2. Додати рядок до TYPE_REGISTRY ПЕРЕД рядком з lambda True (fallback)
# ═══════════════════════════════════════════════════════════════════════════════

def _is_sequence(text_upper):
    return (
        'УСТАНОВІТЬ ПОСЛІДОВНІСТЬ' in text_upper or
        'РОЗТАШУЙТЕ' in text_upper or
        'ХРОНОЛОГІЧН' in text_upper
    )


def _is_matching(text_upper):
    return (
        'УСТАНОВІТЬ ВІДПОВІДНІСТЬ' in text_upper or
        'УВІДПОВІДНІТЬ' in text_upper
    )


TYPE_REGISTRY = [
    (_is_sequence, 'sequence'),
    (_is_matching, 'matching'),   # → конвертується у sequence
    (lambda t: True, 'choice'),   # fallback — завжди True; НЕ ВИДАЛЯТИ
]


# ═══════════════════════════════════════════════════════════════════════════════
# ПАРСИНГ RAW ФАЙЛУ
# ═══════════════════════════════════════════════════════════════════════════════

def _caps_ratio(line):
    alpha = [c for c in line if c.isalpha()]
    if not alpha:
        return 0.0
    return sum(1 for c in alpha if c.isupper()) / len(alpha)


def _is_question_header(line):
    stripped = line.strip()
    if len(stripped) < 6:
        return False
    return _caps_ratio(stripped) > 0.65


def _has_image(text):
    return any(kw in text.upper() for kw in IMAGE_KEYWORDS)


def _extract_sentences(lines):
    """Об'єднує рядки у речення за крапкою наприкінці рядка."""
    sentences = []
    current = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current:
                sentences.append(' '.join(current))
                current = []
            continue
        current.append(stripped)
        if stripped[-1] in '.!?':
            sentences.append(' '.join(current))
            current = []
    if current:
        sentences.append(' '.join(current))
    return [s for s in sentences if s]


def _split_into_raw_blocks(lines):
    """Розбиває рядки на блоки: (header_lines, body_lines) за кожне питання."""
    blocks = []
    current_header = []
    current_body = []

    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            if current_body:
                current_body.append('')
            continue

        if _is_question_header(line):
            if current_body or (current_header and not current_body):
                if current_header:
                    blocks.append((list(current_header), list(current_body)))
                current_header = [line]
                current_body = []
            else:
                current_header.append(line)
        else:
            current_body.append(line)

    if current_header:
        blocks.append((current_header, current_body))

    return blocks


def _detect_type(text_upper):
    for detector, nmt_type in TYPE_REGISTRY:
        if detector(text_upper):
            return nmt_type
    return 'choice'


def parse_raw_file(filepath):
    """Парсить raw файл. Повертає list[dict] — питання."""
    with open(filepath, encoding='utf-8') as f:
        raw = f.read()

    lines = [ln for ln in raw.splitlines()
             if not re.match(r'https?://', ln.strip())]

    blocks = _split_into_raw_blocks(lines)
    questions = []

    for header_lines, body_lines in blocks:
        question_text = ' '.join(header_lines).strip()
        if len(question_text) < 8:
            continue

        qtype = _detect_type(question_text.upper())
        items = _extract_sentences(body_lines)
        has_img = _has_image(question_text)

        if qtype in ('sequence', 'matching'):
            questions.append({
                'type': 'sequence',
                'text': question_text,
                'items': items,
                'has_image': has_img,
            })
        elif len(items) >= 2:
            questions.append({
                'type': 'choice',
                'text': question_text,
                'items': items,
                'has_image': has_img,
            })
        else:
            questions.append({
                'type': 'text',
                'text': question_text,
                'has_image': has_img,
            })

    return questions


# ═══════════════════════════════════════════════════════════════════════════════
# ДЕДУПЛІКАЦІЯ
# ═══════════════════════════════════════════════════════════════════════════════

def _normalize(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return re.sub(r'\s+', ' ', text).strip()


def deduplicate(questions):
    """Видаляє точні та >85%-схожі дублікати за текстом питання."""
    kept = []
    seen = []

    for q in questions:
        norm = _normalize(q['text'])
        is_dup = False

        for prev_norm in seen:
            if norm == prev_norm:
                is_dup = True
                break
            ratio = difflib.SequenceMatcher(None, norm[:200], prev_norm[:200]).ratio()
            if ratio > 0.85:
                is_dup = True
                print(
                    f"  [ДУБЛІКАТ {ratio:.0%}] {q['text'][:55]}...",
                    file=sys.stderr
                )
                break

        if not is_dup:
            kept.append(q)
            seen.append(norm)

    removed = len(questions) - len(kept)
    if removed:
        print(f"  [ІНФО] Видалено дублікатів: {removed}", file=sys.stderr)
    return kept


# ═══════════════════════════════════════════════════════════════════════════════
# ГЕНЕРАЦІЯ NMT .TXT
# ═══════════════════════════════════════════════════════════════════════════════

def build_nmt_txt(meta, questions):
    """Повертає (txt_content: str, todo_count: int)."""
    lines = [
        f"# Chapter: {meta['code']}",
        f"# Title: {meta['title']}",
        f"# Password: {meta['password']}",
        f"# Background: null",
        f"# Theme: textColor=#1a1a1a accentColor={meta['accent']} cardBg=#fdf6e3",
        f"# NOTE: АВТО-ГЕНЕРОВАНО. Перевірте відповіді.",
        "",
    ]

    todo_count = 0
    img_count = 0

    for i, q in enumerate(questions, 1):
        qtype = q['type']
        text = q['text'].strip()
        has_img = q.get('has_image', False)
        if has_img:
            img_count += 1

        lines.append("---")
        lines.append("")
        lines.append(f"### Q{i}")

        if has_img:
            lines.append(f"# IMG_NEEDED: це питання посилається на зображення")

        if qtype == 'sequence':
            items = q.get('items', [])
            if not items:
                lines += [
                    "TYPE: text",
                    f"TEXT: {text}",
                    "CORRECT: TODO",
                    "PLACEHOLDER: Введіть відповідь",
                ]
                todo_count += 1
            else:
                cap = min(len(items), len(OPTION_LABELS) + 15)
                labels = [chr(ord('a') + j) for j in range(cap)]
                correct_order = ', '.join(labels)
                lines += [
                    "TYPE: sequence",
                    f"TEXT: {text}",
                    f"CORRECT_ORDER: {correct_order}",
                    "ITEMS:",
                ]
                for lbl, item_text in zip(labels, items[:cap]):
                    lines.append(f"  - {lbl}: {item_text}")
                todo_count += 1

        elif qtype == 'choice':
            items = q.get('items', [])
            if len(items) < 2:
                lines += [
                    "TYPE: text",
                    f"TEXT: {text}",
                    "CORRECT: TODO",
                    "PLACEHOLDER: Введіть відповідь",
                ]
                todo_count += 1
            else:
                cap = min(len(items), len(OPTION_LABELS))
                group = f"q{i}"
                first_label = OPTION_LABELS[0]
                lines += [
                    "TYPE: choice",
                    f"TEXT: {text}",
                    f"GROUP: {group}",
                    f"CORRECT: {first_label}",
                    "OPTIONS:",
                ]
                for j in range(cap):
                    lines.append(f"  - {OPTION_LABELS[j]}: {items[j]}")
                todo_count += 1

        else:  # text
            lines += [
                "TYPE: text",
                f"TEXT: {text}",
                "CORRECT: TODO",
                "PLACEHOLDER: Введіть відповідь",
            ]
            todo_count += 1

        lines.append("")

    return '\n'.join(lines), todo_count, img_count


# ═══════════════════════════════════════════════════════════════════════════════
# КОМПІЛЯЦІЯ JS
# ═══════════════════════════════════════════════════════════════════════════════

def compile_to_js(txt_path, js_path, tools_dir):
    """Викликає nmt-import.py → записує nmt-CH**.js. Повертає True/False."""
    nmt_import = os.path.join(tools_dir, 'nmt-import.py')
    if not os.path.exists(nmt_import):
        print(f"  [ПОМИЛКА] Не знайдено {nmt_import}", file=sys.stderr)
        return False

    try:
        env = os.environ.copy()
        env['PYTHONIOENCODING'] = 'utf-8'

        result = subprocess.run(
            [sys.executable, nmt_import, txt_path, '--output', 'quiz-data'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
        )
        stdout = result.stdout.decode('utf-8', errors='replace')
        stderr = result.stderr.decode('utf-8', errors='replace')

        if result.returncode != 0:
            print(f"  [ПОМИЛКА nmt-import] {stderr.strip()}", file=sys.stderr)
            return False

        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(stdout)

        if stderr.strip():
            print(f"  [nmt-import] {stderr.strip()}", file=sys.stderr)
        return True

    except Exception as e:
        print(f"  [ПОМИЛКА] {e}", file=sys.stderr)
        return False


# ═══════════════════════════════════════════════════════════════════════════════
# ГОЛОВНА ФУНКЦІЯ
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    if hasattr(sys.stdout, 'buffer'):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    if hasattr(sys.stderr, 'buffer'):
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

    parser = argparse.ArgumentParser(
        description='Збирає NMT-розділ із raw .txt файлів → CH**.txt + nmt-CH**.js'
    )
    parser.add_argument('--code', required=True, help='Код розділу: CH01, CH02, ...')
    parser.add_argument('--title', required=True, help='Назва: "НМТ: Стародавня Україна"')
    parser.add_argument('--password', required=True, help='Пароль для розділу')
    parser.add_argument('--accent', default='#8b6914', help='CSS колір акценту')
    parser.add_argument('--name', default=None,
                        help='Суфікс імені файлу (напр. starodavnia). За замовчуванням: код у нижньому регістрі')
    parser.add_argument('files', nargs='+', help='Шляхи до raw .txt файлів')
    args = parser.parse_args()

    code = args.code.upper()
    name = args.name or code.lower()

    # Визначаємо директорії
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    nmt_dir = os.path.join(project_root, 'data', 'nmt')
    os.makedirs(nmt_dir, exist_ok=True)

    txt_path = os.path.join(nmt_dir, f'{code}-{name}.txt')
    js_path = os.path.join(nmt_dir, f'nmt-{code}.js')

    print(f"[{code}] Збираємо розділ «{args.title}»", file=sys.stderr)

    # Парсинг усіх raw файлів
    all_questions = []
    for filepath in args.files:
        if not os.path.exists(filepath):
            print(f"  [ПОПЕРЕДЖЕННЯ] Файл не знайдено: {filepath}", file=sys.stderr)
            continue
        qs = parse_raw_file(filepath)
        print(f"  [ПАРСИНГ] {os.path.basename(filepath)}: {len(qs)} питань", file=sys.stderr)
        all_questions.extend(qs)

    if not all_questions:
        print(f"  [ПОМИЛКА] Жодного питання не знайдено!", file=sys.stderr)
        sys.exit(1)

    print(f"  [ІНФО] Разом до дедуплікації: {len(all_questions)}", file=sys.stderr)

    # Дедуплікація
    questions = deduplicate(all_questions)

    print(f"  [ІНФО] Після дедуплікації: {len(questions)} питань", file=sys.stderr)

    # Підрахунок типів
    type_counts = {}
    for q in questions:
        type_counts[q['type']] = type_counts.get(q['type'], 0) + 1
    for t, c in sorted(type_counts.items()):
        print(f"  [ТИПИ] {t}: {c}", file=sys.stderr)

    # Генерація NMT .txt
    meta = {
        'code': code,
        'title': args.title,
        'password': args.password,
        'accent': args.accent,
    }
    txt_content, todo_count, img_count = build_nmt_txt(meta, questions)

    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write(txt_content)
    print(f"  [ЗАПИСАНО] {txt_path}", file=sys.stderr)

    if img_count:
        print(
            f"  [⚠ ЗОБРАЖЕННЯ] {img_count} питань потребують зображень — позначені в .txt",
            file=sys.stderr
        )

    # Компіляція у JS
    ok = compile_to_js(txt_path, js_path, script_dir)
    if ok:
        print(f"  [ЗАПИСАНО] {js_path}", file=sys.stderr)
    else:
        print(f"  [ПРОПУЩЕНО] JS не скомпільовано через помилки", file=sys.stderr)

    # Підсумок
    print(f"\n[ГОТОВО] {code}: {len(questions)} питань → {os.path.basename(txt_path)}", file=sys.stderr)
    print(
        f"[TODO] Перевірте відповіді в {os.path.basename(txt_path)}:",
        file=sys.stderr
    )
    print(
        f"  - choice: CORRECT = перший варіант (заглушка)",
        file=sys.stderr
    )
    print(
        f"  - sequence: CORRECT_ORDER = порядок із тексту (потрібна перевірка)",
        file=sys.stderr
    )
    print(
        f"  - text: CORRECT = TODO (потрібне ручне заповнення)",
        file=sys.stderr
    )


if __name__ == '__main__':
    main()
