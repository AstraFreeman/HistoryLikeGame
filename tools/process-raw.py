#!/usr/bin/env python3
"""
process-raw.py — Парсер "сирих" файлів запитань НМТ.

Формат вхідного файлу (data/raw/YYMMDD-period.txt):
    - Запитання підряд без роздільників
    - Варіанти відповідей на окремих рядках або через пробіл
    - Зображення позначаються "НА ФОТО", "ЯКОЮ ЦИФРОЮ", "КАРТОСХЕМА"

Використання:
    python tools/process-raw.py data/raw/250415-ancient.txt
    python tools/process-raw.py data/raw/250415-ancient.txt --output quiz-data > data/quiz/period-1-starodavnia-nmt.js
    python tools/process-raw.py data/raw/250415-ancient.txt --output db-entry

Вивід:
    --output quiz-data: window.QUIZ_DATA = {...};
    --output db-entry: блок для questions-db.js
    без прапора: звіт у консоль
"""

import sys
import re
import os
import json
from datetime import datetime

# ════════════════════════════════════════════════════════════════════════════
# КОНСТАНТИ
# ════════════════════════════════════════════════════════════════════════════

SECTION_MAP = {
    'ancient': 'period-1-starodavnia',
    'starodavnia': 'period-1-starodavnia',
    'kyiv-rus': 'period-2-kyiv-rus',
    'vkl': 'period-3-vkl',
    'kozaky': 'period-4-kozaky',
    'imperium': 'period-5-imperium',
    'revolution': 'period-6-revolution',
    'radianskyi': 'period-7-radianskyi',
    'nezalezhnist': 'period-8-nezalezhnist',
    'kultura': 'period-9-kultura',
}

IMAGE_KEYWORDS = ['НА ФОТО', 'ФОТО', 'КАРТОСХЕМ', 'ЯКОЮ ЦИФРОЮ', 'РИСУНКУ', 'ЗОБРАЖЕНО']


# ════════════════════════════════════════════════════════════════════════════
# ПАРСИНГ
# ════════════════════════════════════════════════════════════════════════════

def detect_question_type(lines, start_idx):
    """Визначає тип запитання за ключовими словами."""
    text = ' '.join(lines[start_idx:start_idx+10]).upper()

    if 'УСТАНОВІТЬ ПОСЛІДОВНІСТЬ' in text:
        return 'sequence'
    if 'УСТАНОВІТЬ ВІДПОВІДНІСТЬ' in text or 'УВІДПОВІДНІТЬ' in text:
        return 'matching'
    return 'choice'


def has_image(text):
    """Перевіряє, чи є у запитанні посилання на зображення."""
    return any(kw in text.upper() for kw in IMAGE_KEYWORDS)


def parse_choice_question(lines, start_idx):
    """Парсить питання типу choice. Повертає (question_dict, next_idx)."""
    i = start_idx
    question_lines = []
    options = []

    # Читаємо до кінця файлу або до наступного CAPS рядка (початок нового питання)
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        # Перевірка на початок нового питання (ВЕЛИКІ ЛІТРИ без знаків)
        if i > start_idx and len(line) > 10:
            caps_ratio = sum(1 for c in line if c.isupper()) / max(len(line), 1)
            if caps_ratio > 0.7 and not any(kw in line.upper() for kw in IMAGE_KEYWORDS):
                # Це може бути початок нового питання
                # Але перевіримо, чи це варіант відповіді
                if not re.match(r'^[•\-\d]', line) and not '. ' in line[:20]:
                    break

        # Варіанти відповідей (кілька варіантів через пробіл з крапками)
        if '. ' in line and len(line.split('. ')) >= 2:
            parts = line.split('. ')
            for p in parts:
                p = p.strip()
                if p and not p.isupper():  # Не заголовок
                    options.append(p)

        question_lines.append(line)
        i += 1

        # Якщо вже знайшли варіанти і текст достатньо довгий
        if len(options) >= 2 and len(question_lines) >= 3:
            # Перевіримо наступний рядок
            if i < len(lines):
                next_line = lines[i].strip()
                if next_line and len(next_line) > 10:
                    caps_ratio = sum(1 for c in next_line if c.isupper()) / max(len(next_line), 1)
                    if caps_ratio > 0.7:
                        break

    full_text = ' '.join(question_lines)
    return {
        'type': 'choice',
        'text': full_text,
        'options': options,
        'has_image': has_image(full_text)
    }, i


def parse_matching_question(lines, start_idx):
    """Парсить питання типу matching (відповідність)."""
    i = start_idx
    question_lines = []
    left_items = []
    right_items = []

    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        # Кінець питання - новий заголовок
        if i > start_idx + 3 and len(line) > 10:
            caps_ratio = sum(1 for c in line if c.isupper()) / max(len(line), 1)
            if caps_ratio > 0.8:
                break

        question_lines.append(line)
        i += 1

    full_text = ' '.join(question_lines)
    return {
        'type': 'matching',
        'text': full_text,
        'has_image': has_image(full_text)
    }, i


def parse_sequence_question(lines, start_idx):
    """Парсить питання типу sequence (хронологія)."""
    i = start_idx
    question_lines = []
    items = []

    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        if i > start_idx + 3 and len(line) > 10:
            caps_ratio = sum(1 for c in line if c.isupper()) / max(len(line), 1)
            if caps_ratio > 0.8:
                break

        question_lines.append(line)
        i += 1

    full_text = ' '.join(question_lines)
    return {
        'type': 'sequence',
        'text': full_text,
        'has_image': has_image(full_text)
    }, i


def parse_raw_file(filepath):
    """Парсить весь файл. Повертає (meta, questions_list)."""
    with open(filepath, encoding='utf-8') as f:
        content = f.read()

    lines = content.splitlines()

    # Мета-інформація з імені файлу
    filename = os.path.basename(filepath)
    name_match = re.match(r'(\d{6})-(.+)\.txt', filename)

    if name_match:
        date_str = name_match.group(1)
        period_name = name_match.group(2).lower()
    else:
        date_str = datetime.now().strftime('%y%m%d')
        period_name = 'unknown'

    section = SECTION_MAP.get(period_name, f'period-unknown-{period_name}')

    meta = {
        'filename': filename,
        'date': date_str,
        'period': period_name,
        'section': section,
        'title': f'НМТ: {period_name.replace("-", " ").title()}',
    }

    questions = []
    i = 0

    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        # Визначаємо тип і парсимо
        qtype = detect_question_type(lines, i)

        if qtype == 'sequence':
            q, i = parse_sequence_question(lines, i)
        elif qtype == 'matching':
            q, i = parse_matching_question(lines, i)
        else:
            q, i = parse_choice_question(lines, i)

        q['id'] = f"Q{len(questions)+1:03d}"
        questions.append(q)

    return meta, questions


# ════════════════════════════════════════════════════════════════════════════
# АНАЛІЗ ЗОБРАЖЕНЬ
# ════════════════════════════════════════════════════════════════════════════

def check_images(questions):
    """Перевіряє наявність зображень. Повертає список проблем."""
    problems = []
    for q in questions:
        if q.get('has_image'):
            # Зображення не мають явних імен файлів у цьому форматі
            # Тому просто позначаємо, що потрібен ручний огляд
            problems.append({
                'qid': q['id'],
                'type': 'image_reference',
                'text': q['text'][:80] + '...' if len(q['text']) > 80 else q['text'],
                'status': 'needs_manual_review'
            })
    return problems


def generate_problem_md(meta, problems, existing_content=None):
    """Генерує/оновлює problem.md."""
    lines = [
        "# Відсутні зображення та проблеми",
        "",
        "_Автогенеровано tools/process-raw.py. Не редагувати вручну._",
        "",
        "## Поточні проблеми",
        "",
    ]

    if problems:
        lines.append("| ID | Тип | Фрагмент тексту | Статус |")
        lines.append("|----|-----|-----------------|--------|")
        for p in problems:
            lines.append(f"| {p['qid']} | {p['type']} | {p['text'][:50]}... | {p['status']} |")
    else:
        lines.append("_Проблем не знайдено._")

    lines.append("")
    lines.append(f"_Оновлено: {datetime.now().strftime('%Y-%m-%d %H:%M')}_")

    return '\n'.join(lines)


# ════════════════════════════════════════════════════════════════════════════
# ВИВІД
# ════════════════════════════════════════════════════════════════════════════

def js_string(s):
    """Екранує рядок для JS."""
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ')


def output_quiz_data(meta, questions):
    """Виводить window.QUIZ_DATA = {...};"""
    print(f"/* Автогенеровано з {meta['filename']} */")
    print(f"/* Секція: {meta['section']} */")
    print(f"/* Дата обробки: {datetime.now().strftime('%Y-%m-%d %H:%M')} */")
    print("")
    print("window.QUIZ_DATA = {")
    print(f"  title: '{js_string(meta['title'])}',")
    print(f"  section: '{meta['section']}',")
    print(f"  source: '{meta['filename']}',")
    print("  theme: { textColor: '#1a1a1a', accentColor: '#8b6914', cardBg: '#fdf6e3' },")
    print("  password: 'НМТ',")
    print("  questions: [")

    for q in questions:
        qtype = q['type']
        text = js_string(q['text'][:200])  # Скорочуємо для виводу

        if qtype == 'choice':
            print(f"    {{ type: 'choice', text: '{text}', hasImage: {q.get('has_image', False)} }},")
        elif qtype == 'matching':
            print(f"    {{ type: 'matching', text: '{text}', hasImage: {q.get('has_image', False)} }},")
        elif qtype == 'sequence':
            print(f"    {{ type: 'sequence', text: '{text}', hasImage: {q.get('has_image', False)} }},")

    print("  ]")
    print("};")


def output_db_entry(meta, questions):
    """Виводить блок для questions-db.js."""
    print(f"    '{meta['section']}-nmt': {{")
    print(f"      title: '{js_string(meta['title'])}',")
    print(f"      section: '{meta['section']}',")
    print(f"      source: '{meta['filename']}',")
    print(f"      theme: {{ textColor: '#1a1a1a', accentColor: '#8b6914', cardBg: '#fdf6e3' }},")
    print(f"      password: 'НМТ',")
    print("      questions: [")
    print("        // Потребує ручного доповнення correct/options/items")
    print("      ]")
    print("    },")


def output_report(meta, questions, problems):
    """Виводить звіт у консоль."""
    print("=" * 60)
    print("ЗВІТ ПАРСИНГУ")
    print("=" * 60)
    print(f"Файл: {meta['filename']}")
    print(f"Секція: {meta['section']}")
    print(f"Період: {meta['period']}")
    print("")

    # Статистика по типах
    type_counts = {}
    for q in questions:
        t = q['type']
        type_counts[t] = type_counts.get(t, 0) + 1

    print("СТАТИСТИКА ЗА ТИПАМИ:")
    for t, c in sorted(type_counts.items()):
        print(f"  {t}: {c}")
    print(f"  ВСЬОГО: {len(questions)}")
    print("")

    # Зображення
    image_count = sum(1 for q in questions if q.get('has_image'))
    print(f"З ЗОБРАЖЕННЯМИ: {image_count}")
    print("")

    # Проблеми
    if problems:
        print("ПРОБЛЕМИ (потрібен ручний огляд):")
        for p in problems[:10]:  # Показуємо перші 10
            print(f"  [{p['qid']}] {p['text'][:60]}...")
        if len(problems) > 10:
            print(f"  ... і ще {len(problems) - 10} проблем")
    print("")

    # Приклади питань
    print("ПРИКЛАДИ ПИТАНЬ:")
    for q in questions[:3]:
        print(f"  [{q['id']}] ({q['type']}) {q['text'][:60]}...")
    print("")


# ════════════════════════════════════════════════════════════════════════════
# ГОЛОВНА ФУНКЦІЯ
# ════════════════════════════════════════════════════════════════════════════

def main():
    import argparse

    parser = argparse.ArgumentParser(description='Парсер сирих файлів запитань')
    parser.add_argument('file', help='Шлях до .txt файлу')
    parser.add_argument('--output', choices=['quiz-data', 'db-entry'],
                        help='quiz-data → window.QUIZ_DATA; db-entry → блок для questions-db.js')
    parser.add_argument('--problem-file', default='data/problem.md',
                        help='Шлях до problem.md (за замовчуванням: data/problem.md)')
    args = parser.parse_args()

    try:
        meta, questions = parse_raw_file(args.file)
    except Exception as e:
        print(f"ПОМИЛКА парсингу: {e}", file=sys.stderr)
        sys.exit(1)

    problems = check_images(questions)

    if args.output == 'quiz-data':
        output_quiz_data(meta, questions)
    elif args.output == 'db-entry':
        output_db_entry(meta, questions)
    else:
        output_report(meta, questions, problems)

    # Оновлюємо problem.md
    if problems:
        problem_content = generate_problem_md(meta, problems)
        problem_path = os.path.join(os.path.dirname(args.file), '..', 'problem.md')
        problem_path = os.path.normpath(problem_path)

        try:
            with open(problem_path, 'w', encoding='utf-8') as f:
                f.write(problem_content)
            print(f"\nОновлено: {problem_path}", file=sys.stderr)
        except Exception as e:
            print(f"\nНе вдалося записати problem.md: {e}", file=sys.stderr)


if __name__ == '__main__':
    main()