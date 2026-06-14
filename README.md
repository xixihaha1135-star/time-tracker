# Time Tracker ⏱

> 时间是最核心的生产资料——你花在哪，决定了你成为谁。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-brightgreen)](https://xixihaha1135-star.github.io/time-tracker/)

一个跨平台的时间记录 Skill。你用自然语言告诉 Agent 你做了什么、花了多少时间，它自动记录、归并分类、生成可视化报告。

**Live Demo**: https://xixihaha1135-star.github.io/time-tracker/

---

## 功能特性

- **自然语言记录，零门槛** — 说一句「看书半小时」就完成记录，无需打开任何 App，无需手动填表单
- **智能别名归并 + 维度自动归类** — 「打球」自动归并到「打篮球」，活动自动分入学习/运动/生活/娱乐/工作五大类别
- **三级日历下钻 + 可视化仪表盘** — 年视图热力图、月视图周统计、日视图明细，逐层下钻，时间花在哪一目了然
- **双主题一键切换** — 暗色 GitHub 风格（护眼） / 亮色 Apple Health 风格（清爽），适应不同使用场景
- **数据全归你** — 所有记录存在单个 `records.json` 文件里，换电脑、换平台、换 Agent，复制粘贴即可带走
- **多平台通用** — 同一份 SKILL.md 同时支持 Claude Code / Cursor / 扣子（Coze）/ 飞书 / 通用 AI Agent

---

## 快速开始

### 方式一：Claude Code（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/xixihaha1135-star/time-tracker.git

# 2. 把 SKILL.md 复制到你的项目中
mkdir -p 你的项目/.claude/skills/time-tracker
cp time-tracker/SKILL.md 你的项目/.claude/skills/time-tracker/

# 3. 把可视化页面和数据文件也复制过去
cp time-tracker/index.html 你的项目/.claude/skills/time-tracker/
cp time-tracker/records.json 你的项目/.claude/skills/time-tracker/
```

安装后，对 Claude Code 直接说：

- 「看书半小时」→ 自动记录
- 「看统计」→ 生成文字报告
- 「打开时间统计」→ 打开可视化页面

### 方式二：Cursor / Copilot / 通用 AI IDE

1. 打开 `SKILL.md`，复制全部内容
2. 粘贴到你的 `.cursorrules`、`copilot-instructions.md` 或项目的 agent 指令文件中
3. 将 `records.json` 放在项目根目录，`index.html` 放在可访问的位置

### 方式三：扣子（Coze）/ 飞书 / 通用 Agent

1. 打开 `SKILL.md`，复制全部内容
2. 粘贴到你的智能体的 **System Prompt（系统提示词）** 中
3. 将 `records.json` 上传为知识库文件，或将内容粘贴进去
4. 开始对话记录

---

## 使用示例

### 记录时间

```
你：看书半小时
Agent：已记录：看书 30分钟（学习）✅  今天已记录 1 条，共 30 分钟。
```

### 批量记录

```
你：看书半小时、打游戏20分钟、吃饭30分钟
Agent：已记录 3 条，共 80 分钟 ✅
      - 看书 30分钟（学习）
      - 打游戏 20分钟（娱乐）
      - 吃饭 30分钟（生活）
      今天已记录 3 条，共 80 分钟。
```

### 查看统计

```
你：今天
Agent：📊 今日时间报告（6.14）
      总记录：4 条 | 总投入：3 小时 30 分钟
      📂 类别分布：
      1. 学习 — 2h（57%）
      2. 生活 — 1h（29%）
      3. 运动 — 30min（14%）

你：本周
Agent：📊 本周时间报告（6.9 - 6.14）
      总记录：31 条 | 总投入：18 小时 45 分钟
      📂 类别分布：
      1. 学习 — 8h30m（45%）
      2. 工作 — 5h（27%）
      3. 生活 — 3h（16%）
      4. 运动 — 1h45m（9%）
      5. 娱乐 — 30m（3%）
      📋 活动排名：
      1. 备考六级 — 6h
      2. AI技术研究 — 2h30m
      3. 公众号 — 2h
      ...
```

### 别名归并

```
你：归并 打球 到 打篮球
Agent：已将「打球」归并到「打篮球」。更新了 3 条历史记录。
```

### 修改记录

```
你：刚才那个记错了，其实是1小时
Agent：已修改：AI技术研究 60分钟 ✅（原 30 分钟）
```

### 删除记录

```
你：删掉刚才那条
Agent：确定删除「备考六级 60分钟」（学习）吗？
你：确定
Agent：已删除 ✅
```

---

## 可视化

在线 Demo 展示三种视图，数据来自 `records.json`，页面在同目录下直接加载：

| 视图 | 说明 |
|------|------|
| **年历热力图** | 365 天日历网格，颜色越深时间投入越多，点击单日查看当天所有记录 |
| **趋势折线图** | 按活动/类别对比时间投入变化趋势，支持 30 天 / 90 天 / 365 天切换，支持缩放拖拽 |
| **分析报告** | 活动排名、类别分布、环比变化、日均投入、最大消耗项，一键生成文字摘要 |

支持 **双主题**：右上角一键切换暗色（GitHub 风格，默认）和亮色（Apple Health 风格）。

> 完整可视化页面：https://xixihaha1135-star.github.io/time-tracker/

---

## 数据格式

所有记录存储在 `records.json` 中，v2 结构如下：

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

**字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `version` | string | 数据格式版本，当前为 `"2.0"` |
| `aliases` | object | 别名映射表，key 是用户输入的活动名，value 是标准活动名 |
| `records[].id` | string | 唯一标识，格式 `YYYYMMDD-HHmmss-xxxx` |
| `records[].date` | string | 记录日期，格式 `YYYY-MM-DD` |
| `records[].start` | string | 开始时间（可选），格式 `HH:mm` |
| `records[].end` | string | 结束时间（可选），格式 `HH:mm` |
| `records[].duration_min` | number | 时长，单位分钟 |
| `records[].activity` | string | 标准活动名（经过别名归并后） |
| `records[].raw_input` | string | 用户原始输入，保留溯源 |
| `records[].created_at` | string | 记录创建时间，ISO 8601 格式 |
| `records[].category` | string | 所属类别（学习/生活/运动/娱乐/工作/其他） |
| `categories` | object | 类别字典，key 是类别名，value 是该类别下的活动名数组 |

**类别自动分配**：记录新活动时，Agent 遍历 `categories` 字典查找匹配的类别；未匹配的放入「其他」，并询问用户归类意向。

**v1 到 v2 迁移**：v2 相比 v1，每条 record 多了 `category` 字段，顶层多了 `categories` 字典。从 v1 升级只需手动添加这两个字段即可，无需脚本。

---

## 数据迁移

**设计原则**：数据跟着你走，不绑定任何平台。

### 导出

复制 `records.json` 即可。一个文件包含你的全部时间记录、别名映射和类别配置。

```bash
# 备份到任意位置
cp records.json ~/backup/records-$(date +%Y%m%d).json
```

### 导入

把 `records.json` 放到新环境的项目根目录（或 SKILL.md 能检测到的路径），Agent 自动识别并继续记录。

### 跨平台

同一份 `records.json` 在 Claude Code、Cursor、扣子、飞书等所有平台上格式完全一致，无需转换。

---

## 参与贡献

欢迎提交 PR。遇到问题请到 [GitHub Issues](https://github.com/xixihaha1135-star/time-tracker/issues) 反馈。

---

## License

MIT — 自由使用、修改、分发。
