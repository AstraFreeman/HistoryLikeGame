# Design: NMT Chapter Builder

**Date:** 2026-04-20  
**Status:** Approved by user

## Context

`data/raw/` містить 19 неструктурованих .txt файлів з питаннями НМТ для 4 históричних periodів. `data/nmt/` — цільовий реєстр, зараз заповнений лише CH01 (Козацька доба). Потрібно:
1. Переупорядкувати реєстр хронологічно (CH01–CH09)
2. Побудувати NMT-розділи для всіх periodів де є raw дані
3. Автоматизувати pipeline: raw .txt → CH0X-name.txt → nmt-CH0X.js

## Нова хронологічна таблиця chapters.md

| Код | Назва | Розділ | Raw файли | Статус |
|-----|-------|--------|-----------|--------|
| CH00 | Вступ | period-0-vstup | — | — |
| CH01 | Стародавня Україна (до IX ст.) | period-1-starodavnia | 250415-ancient.txt | заплановано |
| CH02 | Київська Русь (IX–XIII ст.) | period-2-kyiv-rus | 250415-rus-ukraine × 3 | заплановано |
| CH03 | ВКЛ та Річ Посполита (XIV–XVII ст.) | period-3-vkl | — | заплановано |
| CH04 | Козацька доба (XVII–XVIII ст.) | period-4-kozaky | ← перейменовано з CH01 | готово |
| CH05 | Імперський період (кін. XVIII – поч. XX ст.) | period-5-imperium | 250416-imperial × 4 | заплановано |
| CH06 | Українська революція 1917–1921 | period-6-revolution | 250418-UKR-Rev × 5 | заплановано |
| CH07 | Радянська Україна (1920–1991) | period-7-radianskyi | — | заплановано |
| CH08 | Незалежна Україна (1991–сьогодні) | period-8-nezalezhnist | — | заплановано |
| CH09 | Українська культура крізь віків | period-9-kultura | — | заплановано |

## Новий інструмент: `tools/build-nmt-chapter.py`

### CLI

```bash
python tools/build-nmt-chapter.py \
  --code CH05 \
  --title "НМТ: Україна у складі імперій" \
  --password "Автономія" \
  --accent "#6b4c8b" \
  data/raw/250416-imperial.txt \
  data/raw/250416-imperial2.txt \
  data/raw/250416-imperial3.txt \
  data/raw/250416-imperial4.txt
```

**Виводить:**
- `data/nmt/CH05-imperial.txt` — структурований NMT формат
- `data/nmt/nmt-CH05.js` — скомпільований JS (через subprocess → nmt-import.py)

### Внутрішня структура

```
parse_raw_file(path)         → list[RawQuestion]
deduplicate(questions)       → list[RawQuestion]
map_to_nmt_format(questions) → list[NmtQuestion]
write_nmt_txt(meta, questions, path)
compile_to_js(txt_path, code)  # subprocess nmt-import.py
```

Парсинг адаптує логіку блоків питань з `process-raw.py` (за потреби виноситься в спільні функції).

### Маппінг типів питань

Маппінг реалізується як **реєстр детекторів** — упорядкований список пар `(detector_fn, nmt_type, formatter_fn)`. Новий тип питання додається одним записом до реєстру без зміни core-логіки.

```python
TYPE_REGISTRY = [
    (is_matching,    "sequence", format_matching),   # встановіть відповідність
    (is_ordering,    "sequence", format_ordering),   # розташуйте / хронологічний порядок
    (is_choice,      "choice",   format_choice),     # укажіть/оберіть + А/Б/В/Г
    (is_text,        "text",     format_text),       # fallback — коротка відповідь
]
```

Кожен `detector_fn(raw_question) → bool` перевіряє ключові слова та структуру. Перший детектор що повертає `True` визначає тип. Fallback `is_text` завжди `True`.

| Детектор | Сигнал | NMT тип | Формат |
|----------|--------|---------|--------|
| `is_matching` | "встановіть відповідність" | `sequence` | пари A→1, Б→2 як ITEMS |
| `is_ordering` | "розташуйте", "хронологічний порядок" | `sequence` | CORRECT_ORDER |
| `is_choice` | "укажіть", "оберіть", "визначте" + А/Б/В/Г | `choice` | OPTIONS з лейблами |
| `is_text` | fallback | `text` | CORRECT + PLACEHOLDER |

**Розширення:** додати новий рядок до `TYPE_REGISTRY` перед fallback.

### Дедуплікація

1. Нормалізація: lowercase → видалити пунктуацію → collapse whitespace
2. Точний збіг → відкинути дублікат
3. `difflib.SequenceMatcher` схожість >85% → відкинути, логувати у stderr
4. Застосовується поперек усіх вхідних файлів розділу

### Метадані по розділах

| Код | Password | Accent |
|-----|----------|--------|
| CH01 | Трипілля | `#8b6914` |
| CH02 | Рюрик | `#4a7c59` |
| CH05 | Автономія | `#6b4c8b` |
| CH06 | Директорія | `#8b3a3a` |

## Файли для зміни

| Дія | Шлях |
|-----|------|
| ➕ Новий | `tools/build-nmt-chapter.py` |
| ✏️ Оновити | `data/nmt/chapters.md` |
| 🔄 Перейменувати | `data/nmt/CH01-kozatska-doba.txt` → `CH04-kozatska-doba.txt` |
| 🔄 Перейменувати | `data/nmt/nmt-CH01.js` → `nmt-CH04.js` |
| ✏️ Оновити | `data/questions/questions-db.js` (ключ `'nmt-CH01'` → `'nmt-CH04'`) |
| ➕ Генерувати (скриптом) | `CH01/02/05/06-*.txt` + `nmt-CH01/02/05/06.js` |

## Верифікація

1. `python tools/build-nmt-chapter.py --code CH01 ... data/raw/250415-ancient.txt` → перевірити що створено `CH01-starodavnia.txt` і `nmt-CH01.js`
2. Відкрити `shared/templates/quiz-question.html?id=nmt-CH01` у браузері → гра повинна завантажитись
3. Перевірити що `questions-db.js` має ключ `'nmt-CH04'` (не `'nmt-CH01'`)
4. Перевірити `data/nmt/chapters.md` на хронологічний порядок
