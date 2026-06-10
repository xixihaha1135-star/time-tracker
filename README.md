# Time Tracker

时间统计管理分析工具 — 记录你的每一分钟，让时间这个生产资料可视化。

> 灵感来源：李笑来《财富的真相》—— 时间是最核心的生产资料，所有的一切都是从自己的时间里挖出来的。

## 这是什么

一个**跨平台的时间记录 Skill**。你用自然语言告诉 Agent 你做了什么、花了多少时间，它自动记录、归并分类、生成可视化报告。

- 手机上随时发一句"看书半小时"就能记录
- 日历热力图、趋势折线图、文字分析报告
- 数据存 JSON，换平台带走不丢
- 别名自动归并（"打球"→"打篮球"）

## 可视化 Demo

在线查看：https://xixihaha1135-star.github.io/time-tracker/

## 快速开始

### 方式一：Claude Code 安装（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/xixihaha1135-star/time-tracker.git

# 2. 把 Skill 复制到你的项目
mkdir -p 你的项目/.claude/skills/time-tracker
cp time-tracker/SKILL.md 你的项目/.claude/skills/time-tracker/

# 3. 把 index.html 和 records.json 也复制过去（用于可视化）
cp time-tracker/index.html 你的项目/.claude/skills/time-tracker/
cp time-tracker/records.json 你的项目/.claude/skills/time-tracker/
```

安装后，对 Claude Code 说：
- "看书半小时" → 自动记录
- "看统计" → 生成报告
- "打开时间统计" → 打开可视化页面

### 方式二：Coze / 飞书 Agent

1. 打开 SKILL.md，复制全部内容
2. 粘贴到你的智能体的 **System Prompt** 里
3. 开始对话记录

### 方式三：通用 Agent

把 SKILL.md 的内容复制到任何 Agent 的指令/提示词中即可。

## 使用示例

**记录时间：**
```
你：看书半小时
Agent：已记录：看书 30分钟 ✅

你：写代码2h
Agent：已记录：写代码 120分钟 ✅ 今天已记录 2 条，共 150 分钟。

你：9点到11点学习
Agent：已记录：学习 120分钟 ✅
```

**查看统计：**
```
你：看统计
Agent：
📊 本周时间报告（6.4 - 6.10）

总投入：28 小时 30 分钟

活动排名：
1. 学习 — 12h（42%）
2. 写代码 — 8h（28%）
3. 看书 — 5h（18%）
```

**补录和修改：**
```
你：昨天学习了2小时
Agent：已记录：学习 120分钟 ✅（日期：2026-06-09）

你：刚才那个记错了，其实是1小时
Agent：已修改：学习 60分钟 ✅
```

## 自己部署可视化

如果你想有自己的可视化页面：

```bash
# 1. Fork 这个仓库，或者克隆后推到你自己的仓库
gh repo clone xixihaha1135-star/time-tracker
cd time-tracker

# 2. 推到你自己的 GitHub
gh repo create my-time-tracker --public --source=. --push

# 3. 开启 GitHub Pages
# 仓库 Settings → Pages → Source 选 main 分支 → Save
```

访问 `https://<你的用户名>.github.io/my-time-tracker/` 即可。

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

换平台时：
- `git clone` 仓库，数据自动带走
- 或者只复制 `records.json` 到新平台

## 可视化功能

| 功能 | 说明 |
|------|------|
| 日历热力图 | 365 天一目了然，颜色越深时间越多，点击看详情 |
| 趋势折线图 | 按活动对比时间投入变化，支持 30/90/365 天切换 |
| 分析报告 | 活动排行、环比变化、日均投入、最大消耗项 |

## License

MIT
