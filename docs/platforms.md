# 平台接入指南

Time Tracker 的核心是一份 SKILL.md，它可以接入多种 AI 平台。以下是 4 个平台的详细接入步骤。

---

## Claude Code

Claude Code 是推荐的首选平台，支持完整的文件读写和 Git 提交功能。

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/xixihaha1135-star/time-tracker.git
```

推荐克隆到 `~/.claude/skills/time-tracker/`，这样全局所有项目都能使用。

2. **复制 SKILL.md**

```bash
mkdir -p ~/.claude/skills/time-tracker
cp time-tracker/SKILL.md ~/.claude/skills/time-tracker/
```

如果只想在单个项目中使用，将 SKILL.md 复制到项目下的 `.claude/skills/time-tracker/` 目录即可。

3. **复制数据文件和可视化页面**（可选，建议）

```bash
cp time-tracker/records.json ~/.claude/skills/time-tracker/
cp time-tracker/index.html ~/.claude/skills/time-tracker/
```

4. **开始使用**

打开 Claude Code，直接说：

- 「看书半小时」→ 自动记录
- 「今天的时间统计」→ 生成报告
- 「打开时间统计页面」→ 打开可视化

### 注意事项

- 确保 Claude Code 有该路径的读写权限
- `records.json` 的自动检测路径优先级见 SKILL.md 的"路径自动检测"章节
- 推荐配合 Git 使用，实现数据版本管理和自动备份

---

## Cursor

Cursor 支持通过 AI 指令文件配置自定义行为。

### 安装步骤

1. **复制 SKILL.md 内容**

打开 `SKILL.md`，复制全部内容。

2. **添加到 .cursorrules**

在项目根目录找到或创建 `.cursorrules` 文件，将复制的 SKILL.md 内容粘贴进去。

如果希望全局生效，将内容添加到 Cursor 设置中的 User Rules。

3. **放置数据文件**

将 `records.json` 和 `index.html` 放到项目根目录。

4. **开始使用**

在 Cursor 的 AI 对话窗口中，直接说：

- 「看书半小时」
- 「今天学了什么」
- 「帮我统计本周时间」

### 注意事项

- Cursor 的 AI 功能依赖模型能力，对长指令的理解效果取决于模型版本
- `.cursorrules` 的内容不宜过长，可根据需要精简 SKILL.md 的核心规则
- 记录后需要手动 Git 提交（Claude Code 的自动提交通道在 Cursor 中不可用）

---

## 扣子（Coze）

扣子支持自定义 Bot 的系统提示词（System Prompt），适合把 Time Tracker 做成一个独立的 Bot。

### 安装步骤

1. **创建 Bot**

在扣子平台创建一个新的 Bot，进入 Bot 编辑页。

2. **配置系统提示词**

打开 `SKILL.md`，复制全部内容，粘贴到 Bot 的"系统提示词"输入框中。

这是最关键的一步——SKILL.md 中包含了 Bot 理解时间记录规则的全部逻辑。

3. **配置数据存储变量**

扣子 Bot 没有文件系统，需要通过变量来持久化数据。建议创建一个文本变量 `records_json`，用于存储 `records.json` 的完整内容。

Bot 每次启动时读取该变量，修改后写回。

4. **配置数据迁移格式**

如果 Bot 需要长时间使用，可以定期导出 `records_json` 变量的内容，保存为本地 JSON 文件。

5. **开始使用**

在 Bot 对话窗口中，直接说：

- 「看书半个小时」
- 「今天做了什么」
- 「这个月的时间统计」

### 注意事项

- 扣子 Bot 的上下文长度有限，记录数量过多时需考虑定期归档
- 变量存储有容量限制，建议每月导出一次数据
- 系统提示词内容较长时，可能影响 Bot 的响应速度

---

## 微信 AI（小程序）

微信 AI 小程序的支持代码在 `wechat-ai/` 目录中。目前处于提审阶段，暂未对外开放。

### 当前状态

- **代码已完成**：包含三个核心 API（recordTime / getStats / modifyRecord）和两个 UI 组件（stat-card / day-detail）
- **提审中**：已提交审核，等待微信开放平台审核通过
- **未开放**：审核通过前无法在小程序中使用

### 目录结构

```
wechat-ai/
  index.js              # 入口文件，路由注册
  mcp.json              # MCP 协议配置
  SKILL.md              # 微信适配版 SKILL
  apis/
    recordTime.js       # 记录时间 API
    getStats.js         # 获取统计 API
    modifyRecord.js     # 修改/删除记录 API
  components/
    stat-card/          # 统计卡片组件
    day-detail/         # 日详情组件
```

### 安装说明（待开放后）

审核通过后，在微信 AI 小程序中通过 MCP 协议引入此项目，即可在微信中使用自然语言记录时间。

由于微信 AI 是闭源平台，具体接入入口请关注微信官方文档：

- 微信 AI 开放平台：https://developers.weixin.qq.com/
- MCP 协议接入指南：https://modelcontextprotocol.io/

### 自行部署

如果想提前在微信生态中使用，可以将 `wechat-ai/` 部署为独立的 MCP Server，通过 MCP 协议对接其他支持 MCP 的微信工具。具体配置参考 `mcp.json`。

---

## 跨平台数据迁移

当你需要从一个平台切换到另一个平台时（比如从 Coze 换到飞书），可以通过以下步骤迁移数据：

### 导出数据

在当前平台的对话中，对 Agent 说：

```
导出数据
```

Agent 会输出完整的 `records.json` 内容。复制保存。

### 导入数据

在新平台的对话中，对 Agent 说：

```
导入数据
[粘贴刚才复制的 JSON]
```

Agent 会解析并写入，历史记录全部保留。

### 手动迁移（文件方式）

如果你能访问文件系统（如 Claude Code、Cursor）：

1. 找到当前的 `records.json` 文件
2. 复制到新平台的项目目录
3. 确保 SKILL.md 的"路径自动检测"能找到它

### 注意事项

- 导入会覆盖当前数据，请先导出再导入
- v2.0 格式（无 detail 字段）完全兼容 v2.1
- 如果数据量大（>500 条），建议用文件方式迁移