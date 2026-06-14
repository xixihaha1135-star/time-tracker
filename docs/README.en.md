[中文](../README.md) | **English** | [Français](README.fr.md) | [Español](README.es.md) | [Русский](README.ru.md) | [العربية](README.ar.md) | [日本語](README.ja.md)

# Time Tracker ⏱

> Time is your most essential resource — where you spend it determines who you become.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-brightgreen)](https://xixihaha1135-star.github.io/time-tracker/)

A cross-platform time tracking Skill. Tell your Agent what you did and for how long in natural language, and it automatically logs activities, merges aliases into standardized activities, assigns categories, and generates visual reports.

**Live Demo**: https://xixihaha1135-star.github.io/time-tracker/

---

## Features

- **Natural language logging, zero friction** — Just say "read for half an hour" and it's recorded. No app to open, no form to fill.
- **Smart alias merging + auto-categorization** — "Play ball" automatically merges into "Play basketball". Activities are auto-sorted into five categories: Study, Daily Life, Exercise, Entertainment, Work.
- **Three-level calendar drill-down + visual dashboard** — Yearly heatmap, monthly weekly-stats, daily detail view. Drill down layer by layer to see exactly where your time went.
- **Dual theme, one-click toggle** — Dark GitHub-style (eye-friendly) / Light Apple Health-style (clean), adapts to different usage contexts.
- **Your data, fully yours** — All records live in a single `records.json` file. Switch computers, switch platforms, switch Agents — just copy and paste to take it with you.
- **Multi-platform** — The same `SKILL.md` works with Claude Code / Cursor / Coze / Lark / any general-purpose AI Agent.

---

## Quick Start

### Option 1: Claude Code (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/xixihaha1135-star/time-tracker.git

# 2. Copy SKILL.md into your project
mkdir -p your-project/.claude/skills/time-tracker
cp time-tracker/SKILL.md your-project/.claude/skills/time-tracker/

# 3. Copy the visualization page and data file too
cp time-tracker/index.html your-project/.claude/skills/time-tracker/
cp time-tracker/records.json your-project/.claude/skills/time-tracker/
```

After installation, just tell Claude Code:

- "read for half an hour" → auto-logged
- "show stats" → generates a text report
- "open time tracker" → opens the visualization page

### Option 2: Cursor / Copilot / Any AI IDE

1. Open `SKILL.md` and copy the entire content
2. Paste it into your `.cursorrules`, `copilot-instructions.md`, or your project's agent instruction file
3. Place `records.json` in the project root and `index.html` somewhere accessible

### Option 3: Coze / Lark / Any General Agent

1. Open `SKILL.md` and copy the entire content
2. Paste it into your Agent's **System Prompt**
3. Upload `records.json` as a knowledge base file, or paste its contents
4. Start chatting to log your time

---

## Usage Examples

### Logging Time

```
You: read for half an hour
Agent: Logged: 看书 — 30 min (Study) ✅  Today: 1 entry, 30 min total.
```

### Batch Logging

```
You: read half an hour, played games 20 min, had lunch 30 min
Agent: Logged 3 entries, 80 min total ✅
      - 看书 — 30 min (Study)
      - 打游戏 — 20 min (Entertainment)
      - 吃饭 — 30 min (Daily Life)
      Today: 3 entries, 80 min total.
```

### Viewing Stats

```
You: today
Agent: 📊 Today's Time Report (6/14)
      Total entries: 4 | Total time: 3h 30m
      📂 Category breakdown:
      1. Study — 2h (57%)
      2. Daily Life — 1h (29%)
      3. Exercise — 30m (14%)

You: this week
Agent: 📊 Weekly Time Report (6/9 - 6/14)
      Total entries: 31 | Total time: 18h 45m
      📂 Category breakdown:
      1. Study — 8h 30m (45%)
      2. Work — 5h (27%)
      3. Daily Life — 3h (16%)
      4. Exercise — 1h 45m (9%)
      5. Entertainment — 30m (3%)
      📋 Activity ranking:
      1. CET-6 prep — 6h
      2. AI tech research — 2h 30m
      3. WeChat blog — 2h
      ...
```

### Alias Merging

```
You: merge 打球 into 打篮球
Agent: Merged "打球" → "打篮球". Updated 3 historical entries.
```

### Editing Records

```
You: that last one was wrong, it was actually 1 hour
Agent: Updated: AI tech research — 60 min ✅ (was 30 min)
```

### Deleting Records

```
You: delete that last entry
Agent: Delete "CET-6 prep — 60 min" (Study)?
You: confirm
Agent: Deleted ✅
```

---

## Visualization

The live demo showcases three views, all fed by `records.json` (loaded from the same directory as the page):

| View | Description |
|------|------|
| **Yearly Heatmap** | 365-day calendar grid. Darker cells = more time invested. Click any day to see all entries for that day. |
| **Trend Chart** | Compare time investment trends by activity/category. Supports 30-day / 90-day / 365-day toggles, plus zoom and drag. |
| **Analysis Report** | Activity rankings, category distribution, period-over-period changes, daily average, top time sinks — generate a text summary in one click. |

**Dual theme** support: toggle between dark (GitHub-style, default) and light (Apple Health-style) via the top-right button.

> Full visualization page: https://xixihaha1135-star.github.io/time-tracker/

---

## Data Format

All records are stored in `records.json` with the v2 structure:

```json
{
  "version": "2.0",
  "aliases": {
    "看英文原著": "看书",
    "AI写代码": "AI技术研究"
  },
  "records": [
    {
      "id": "20260610-182449-fc55",
      "date": "2026-06-10",
      "start": "",
      "end": "",
      "duration_min": 30,
      "activity": "看书",
      "raw_input": "看书半小时",
      "created_at": "2026-06-10T18:24:49.079383Z",
      "category": "学习"
    }
  ],
  "categories": {
    "学习": ["看书", "做作业", "备考六级"],
    "生活": ["吃饭", "洗漱洗衣", "休息"],
    "运动": ["早训", "健身"],
    "娱乐": ["玩手机", "打游戏"],
    "工作": ["AI技术研究", "公众号", "开会", "工作"]
  }
}
```

**Field reference:**

| Field | Type | Description |
|------|------|------|
| `version` | string | Data format version, currently `"2.0"` |
| `aliases` | object | Alias mapping table: key = user input, value = canonical activity name |
| `records[].id` | string | Unique identifier, format `YYYYMMDD-HHmmss-xxxx` |
| `records[].date` | string | Record date, format `YYYY-MM-DD` |
| `records[].start` | string | Start time (optional), format `HH:mm` |
| `records[].end` | string | End time (optional), format `HH:mm` |
| `records[].duration_min` | number | Duration in minutes |
| `records[].activity` | string | Canonical activity name (after alias merging) |
| `records[].raw_input` | string | Original user input, preserved for traceability |
| `records[].created_at` | string | Record creation timestamp, ISO 8601 format |
| `records[].category` | string | Assigned category (学习/生活/运动/娱乐/工作/其他) |
| `categories` | object | Category dictionary: key = category name, value = array of activity names in that category |

**Auto-categorization**: When a new activity is logged, the Agent walks the `categories` dictionary to find a match. Unmatched activities go into "其他" (Other), and the Agent asks you where you'd like to categorize them.

**v1 to v2 migration**: Compared to v1, each record now has a `category` field, and the top level has a `categories` dictionary. Upgrading from v1 requires only manually adding these two fields — no migration script needed.

---

## Data Migration

**Design principle**: your data follows you, never locked into any platform.

### Export

Copy `records.json`. That's it. A single file contains all your time records, alias mappings, and category configuration.

```bash
# Backup to any location
cp records.json ~/backup/records-$(date +%Y%m%d).json
```

### Import

Place `records.json` in the project root (or any path `SKILL.md` can detect) of your new environment. The Agent auto-detects it and resumes logging.

### Cross-platform

The same `records.json` has an identical format across Claude Code, Cursor, Coze, Lark, and all other platforms — no conversion needed.

---

## Contributing

Pull requests are welcome. For issues, please report on [GitHub Issues](https://github.com/xixihaha1135-star/time-tracker/issues).

---

## License

MIT — free to use, modify, and distribute.
