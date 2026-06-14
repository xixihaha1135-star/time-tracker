# Time Tracker v2 实施计划

> 基于设计文档：`docs/superpowers/specs/2026-06-14-time-tracker-v2-design.md`

## 任务分解

### Task 1: 数据迁移 — records.json v1 → v2 schema

**目标**：升级数据格式，新增 `categories` 字段和每条记录的 `category` 自动映射。

**修改文件**：`records.json`

**步骤**：
1. 读取现有 records.json（v1 格式）
2. 添加 `version: "2.0"` 字段
3. 添加 `categories` 字典（预填 5 个维度：学习/生活/运动/娱乐/工作，根据用户现有活动初始化）
4. 遍历所有 records，为每条记录自动添加 `category` 字段（从 categories 反查）
5. 保留所有已有字段不变
6. 用新 schema 替换旧文件，git commit

**验证**：所有旧记录成功映射 category，数据完整性不变

**依赖**：无

---

### Task 2: SKILL.md v2 重写

**目标**：重写 SKILL.md，支持批量解析、categories、连续性分析、路径自适应。

**修改文件**：`SKILL.md`

**步骤**：
1. 重写触发词和意图识别：
   - 记录：`记录时间`、`看书半小时`、`今天做了X`
   - 查看：`看统计`、`today`、`本周`、`本月`
   - 修改：`修改记录`、`删除记录`、`归并类别`
2. 批量解析规则：支持 `+`、`、`、`\n` 分隔的多活动输入
3. categories 自动归类逻辑：新活动先查 aliases→查 categories→未匹配则归入"其他"，用户可指定维度
4. 连续性分析：计算连续记录天数
5. 统计报告增强：维度占比 + 环比 + 连续天数 + 可视化链接
6. 路径自适应：自动检测 records.json 位置

**验证**：用 3-5 个测试 prompt 验证 SKILL 逻辑覆盖（单条记录、批量记录、别名归并、统计查询、修改删除）

**依赖**：Task 1（需要 v2 schema）

---

### Task 3: index.html — 主题系统 + 基础架构重构

**目标**：建立双主题系统（暗色/亮色），重构 CSS 为变量驱动，重构 JS 数据加载逻辑适配 v2 schema。

**修改文件**：`index.html`

**步骤**：
1. CSS 变量体系：定义 `--bg-primary`、`--bg-secondary`、`--text-primary` 等 20+ 变量，暗色/亮色两套
2. 主题切换按钮：固定右上角，点击切换，localStorage 记忆偏好
3. 数据加载适配 v2 schema：解析 `categories`、`version` 字段，每条记录带 `category`
4. 公共工具函数：格式化时间（fmt）、计算连续记录天数、维度映射
5. 页面骨架：顶部 toolbar（主题切换）+ 三个 tab（日历/趋势/报告）

**验证**：暗色/亮色切换正常，数据加载无报错，旧数据兼容

**依赖**：Task 1（需要 v2 schema）

---

### Task 4: index.html — 日历热力图（三级下钻）

**目标**：实现年→月→日的三级下钻日历。

**修改文件**：`index.html`（renderCalendar 函数）

**步骤**：
1. **年度概览**：12 个月卡片，每月显示总投入时长，当前月高亮。点击月份 → 月视图
2. **月度热力图**：7 列网格，每天方格 + 时长标注，颜色深浅表示时长，空白日期灰色。点击日期 → 日详情
3. **日详情**：饼状图（Chart.js doughnut）显示活动占比 + 记录列表 + 合计。返回按钮回月视图
4. 空白处理：无记录月份在年度视图中显示 "0h" 但不展开详情，趋势图从第一条记录开始
5. 面包屑导航：年 > 月 > 日，每级可点击返回

**验证**：
- 年→月→日点击跳转正常
- 无记录日期点击无反应
- 面包屑导航正常
- 移动端响应式布局

**依赖**：Task 3

---

### Task 5: index.html — 堆叠面积图趋势（可拖拽）

**目标**：用堆叠面积图替代折线图，支持拖拽和缩放。

**修改文件**：`index.html`（renderTrend 函数）

**步骤**：
1. 引入 chartjs-plugin-zoom CDN
2. 数据集按维度（categories）分组，每个维度一个 dataset
3. Chart.js line chart + fill: 'origin' + stacked: true → 堆叠面积图
4. 添加 zoom 插件配置：支持拖拽平移 + 滚轮缩放
5. 维度筛选标签：点击切换维度显示/隐藏
6. 7天/30天/90天 切换按钮
7. Tooltip 显示各维度时长和占比

**验证**：
- 堆叠面积图正确渲染
- 鼠标拖拽平移流畅
- 滚轮缩放正常
- 维度筛选实时更新
- 触摸设备（手机）可拖拽

**依赖**：Task 3

---

### Task 6: index.html — 分析报告（环形图 + 洞察）

**目标**：增强分析报告，添加维度环形图、洞察建议、概览卡片。

**修改文件**：`index.html`（renderReport 函数）

**步骤**：
1. **概览卡片**（3 列）：总投入 / 日均 / 连续记录天数
2. **维度环形图**（Chart.js doughnut）：按 categories 聚合，显示维度占比
3. **洞察引擎**：基于数据生成 1-3 条洞察：
   - 连续性分析：「连续 X 天有记录」
   - 趋势分析：「学习占比从 A% 上升到 B%」
   - 异常检测：「娱乐占比上升超过 10%」
   - 对比分析：「与上个周期对比，XX 维度变化最大」
4. **活动排行**：条形图 + 环比变化指标
5. 周/月/年 切换

**验证**：
- 环形图各维度颜色区分明显
- 洞察文案合理（不编造数据）
- 环比计算正确
- 无数据时显示友好提示

**依赖**：Task 3

---

### Task 7: README.md 编写

**目标**：编写完整的开源项目 README。

**修改文件**：`README.md`

**步骤**：
1. 标题 + 一句话定位 + Demo 链接
2. 理念：「时间是最核心的生产资料——你花在哪，决定了你成为谁」
3. 特性列表（6 条核心特性）
4. 快速开始：3 种安装方式（Claude Code Skill / 扣子智能体 / 通用 Agent 指令）
5. 使用示例：5-6 个对话示例（中文 + 英文）
6. 可视化：Demo 链接 + 功能说明
7. 数据格式：v2 schema 说明 + 迁移指南
8. 贡献指南
9. MIT License

**验证**：README 渲染效果美观、信息完整、安装步骤可复现

**依赖**：Task 2, Task 6（需要最终 SKILL 和可视化确认）

---

### Task 8: docs/ 编写（philosophy + platforms + changelog）

**目标**：补充项目文档。

**新增文件**：`docs/philosophy.md`、`docs/platforms.md`、`docs/changelog.md`

**步骤**：
1. `philosophy.md`：理念深述（时间=生产资料，为什么记录时间有价值，不做时间管理的奴隶而是做时间的朋友）
2. `platforms.md`：4 种平台接入指南（Claude Code / 扣子 / 飞书 / 微信 AI），每种含完整步骤
3. `changelog.md`：v1.0 → v2.0 变更记录

**验证**：文档内容准确，平台接入步骤可操作

**依赖**：Task 2, Task 7

---

### Task 9: wechat-ai/ SKILL 代码编写

**目标**：编写微信 AI 开发模式的完整 SKILL 代码（暂不可提审，先写好备用）。

**新增文件**：`wechat-ai/` 目录下全部文件

**步骤**：
1. `SKILL.md`：微信版业务说明（≤16KB），适配微信对话风格
2. `mcp.json`：3 个原子接口声明（recordTime / getStats / modifyRecord），含 inputSchema + outputSchema + componentPath
3. `apis/recordTime.js`：记录时间接口，数据写云开发数据库
4. `apis/getStats.js`：统计查询接口，返回 structuredContent（维度占比 + 洞察）
5. `apis/modifyRecord.js`：修改/删除接口
6. `components/stat-card/`：统计卡片组件（环形图 + 关键指标）
7. `components/day-detail/`：日详情组件（饼状图 + 活动列表）
8. `index.js`：注册所有原子接口，添加登录中间件

**验证**：代码符合微信 AI 开发模式规范，mcp.json 格式正确

**依赖**：无（可与 Task 2-8 并行）

---

### Task 10: GitHub Pages 部署 + 发布准备

**目标**：配置 GitHub Actions 自动部署 Pages，准备 v2.0.0 发布。

**修改/新增文件**：`.github/workflows/pages.yml`，GitHub Release

**步骤**：
1. 创建 `.github/workflows/pages.yml`：push 到 master 时自动部署 index.html 到 GitHub Pages
2. 确保 records.json 在 Pages 中可访问（作为数据源）
3. 推送所有代码到 GitHub
4. 创建 v2.0.0 tag 和 GitHub Release
5. 验证 Demo 页面可访问

**验证**：
- GitHub Actions 构建成功
- Demo 页面（`xixihaha1135-star.github.io/time-tracker/`）可正常访问
- 双主题切换正常
- 数据加载正常

**依赖**：Task 1-6, Task 7-8

---

## 依赖关系

```
Task 1 (数据迁移)
  ├── Task 2 (SKILL v2)
  ├── Task 3 (主题+架构) ──┬── Task 4 (日历下钻)
  │                        ├── Task 5 (趋势图)
  │                        └── Task 6 (报告增强)
  │
  │  Task 7 (README) ←── Task 2 + Task 6
  │  Task 8 (docs) ←── Task 2 + Task 7
  │  Task 9 (wechat-ai) ←── 无依赖，可并行
  │
  └── Task 10 (Pages+发布) ←── Task 1-8
```

## 执行顺序

推荐串行顺序（兼顾质量），Task 9 可并行：

1. Task 1 → Task 2（数据 + SKILL，核心基础）
2. Task 3 → Task 4, 5, 6（可视化，最耗时部分）
3. Task 7, 8（文档）
4. Task 9（微信 AI，独立）
5. Task 10（部署发布）

## 并行策略

如果用并行 agent 执行：
- **Agent A**：Task 1 → 2 → 7 → 8（数据 + SKILL + 文档链）
- **Agent B**：Task 3 → 4 → 5 → 6（可视化链）
- **Agent C**：Task 9（微信 AI，完全独立）
- **主线程**：Task 10（等所有 agent 完成）

## 风险

| 风险 | 影响 | 缓解 |
|------|------|------|
| chartjs-plugin-zoom 触摸兼容问题 | 移动端拖拽不流畅 | 备选：hammerjs 手动处理 touch 事件 |
| v1 数据迁移丢失 | 历史记录不可恢复 | 迁移前备份，写入迁移脚本 |
| 微信 AI 提审长期不开放 | wechat-ai/ 代码闲置 | 代码保留，不影响主线 |
| 单文件 index.html 过大 (>100KB) | 加载慢 | 拆分 CSS/JS 为独立文件，仅必要时做 |
