# Time Tracker

时间统计管理分析工具 — 记录你的每一分钟，让时间这个生产资料可视化。

## 这是什么

一个跨平台的时间记录 Skill，你可以用自然语言（如"看书半小时"）记录时间花销，查看日历热力图、趋势分析和统计报告。

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/<your-username>/time-tracker.git
```

### 2. 安装 Skill

**Claude Code:**
把 `SKILL.md` 复制到你的项目的 `.claude/skills/time-tracker/` 目录。

**Coze:**
把 `SKILL.md` 内容作为智能体的 system prompt。

**飞书 cc-connect:**
把 `SKILL.md` 内容注入 Claude 的 system prompt。

### 3. 开始记录

对你的 Agent 说：
- "看书半小时"
- "写代码2h"
- "9点到11点学习"

### 4. 查看统计

对你的 Agent 说：
- "看统计"
- "时间报告"
- "本周时间"

或者直接打开 GitHub Pages：`https://<your-username>.github.io/time-tracker/`

### 5. 开启 GitHub Pages

在仓库 Settings → Pages → Source 选 `main` 分支，保存即可。

## 数据格式

所有数据存在 `records.json` 中：

```json
{
  "version": "1.0",
  "aliases": { "打球": "打篮球" },
  "records": [
    {
      "id": "20260610-143000-a3f2",
      "date": "2026-06-10",
      "start": "14:00",
      "end": "14:30",
      "duration_min": 30,
      "activity": "看书",
      "raw_input": "看书半小时",
      "created_at": "2026-06-10T06:30:00.000Z"
    }
  ]
}
```

## 数据迁移

换平台时，把 `records.json` 复制到新平台，或直接 `git clone` 仓库即可。

## 可视化功能

- **日历热力图**：365 天一目了然，颜色越深时间越多
- **趋势折线图**：按活动对比时间投入变化
- **分析报告**：自动统计排名、环比变化、日均投入

## License

MIT
