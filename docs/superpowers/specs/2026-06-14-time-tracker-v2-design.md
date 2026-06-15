# Time Tracker v2 设计文档

> 日期：2026-06-14
> 状态：已确认，待实施

## 概述

将 time-tracker 从个人工具升级为开源项目，核心目标：让更多人能用上，GitHub 仓库地址丢给 Agent 即可安装。

传播路径：GitHub 起步 → 公众号扩散 → 微信 AI 接入（提审开放后）。

## 项目结构

```
time-tracker/
├── SKILL.md              # 核心 Agent 指令
├── index.html            # 可视化仪表盘（GitHub Pages）
├── records.json          # 数据文件
├── README.md             # 项目介绍 + 理念 + 安装指南
├── docs/
│   ├── philosophy.md     # 理念深述
│   ├── platforms.md      # 各平台接入指南
│   └── changelog.md      # 更新日志
├── wechat-ai/            # 微信 AI SKILL（暂不可提审）
│   ├── SKILL.md          # 微信版业务说明
│   ├── mcp.json          # 原子接口声明
│   ├── apis/
│   │   ├── recordTime.js
│   │   ├── getStats.js
│   │   └── modifyRecord.js
│   ├── components/
│   │   ├── stat-card/
│   │   └── day-detail/
│   └── index.js          # 接口注册
└── .github/
    └─ workflows/
       └─ pages.yml       # GitHub Pages 自动部署
```

## 数据存储策略

分阶段实现，数据格式统一为 JSON：

| 阶段 | 用户 | 存储 | 优先级 |
|------|------|------|--------|
| v2.0 | GitHub 用户体验 | Git + records.json | 必做 |
| v2.0 | 想在手机看的人 | GitHub Pages + 导出 JSON | 必做 |
| 后续 | 普通用户（扣子/飞书） | 平台自带存储 | 后续 |
| 后续 | 微信用户 | 云开发数据库 | 等提审开放后 |

## records.json v2 Schema

新增 `categories` 字段，支持维度分析：

```json
{
  "version": "2.0",
  "categories": {
    "学习": ["看书", "备考六级", "AI技术研究", "做作业"],
    "生活": ["吃饭", "洗漱洗衣", "休息"],
    "运动": ["健身", "早训"],
    "娱乐": ["打游戏", "玩手机"],
    "工作": ["公众号", "工作", "开会"]
  },
  "aliases": {
    "看英文原著": "看书",
    "AI写代码": "AI技术研究"
  },
  "records": [
    {
      "id": "20260610-143000-a3f2",
      "date": "2026-06-10",
      "start": "14:00",
      "end": "14:30",
      "duration_min": 30,
      "activity": "看书",
      "category": "学习",
      "raw_input": "看书半小时",
      "created_at": "2026-06-10T06:30:00.000Z"
    }
  ]
}
```

每条记录新增 `category` 字段（自动从 categories 映射，无需用户手动填写）。

## SKILL.md v2 改进

### 相对 v1 的变更

1. **路径自适应**：自动检测项目目录下是否有 records.json，没有则初始化
2. **批量解析**：支持「看书半小时 + 打游戏20分钟 + 吃饭30分钟」一次性输入
3. **categories 维度**：自动归类活动到维度，统计报告支持维度分析
4. **别名归并国际化**：支持中文和英文别名
5. **连续性分析**：输出「连续 X 天有记录」
6. **可视化链接**：自动生成 `<username>.github.io/<repo>/` 链接

### 新增功能

- `today` / `本周` / `本月` 快捷查询
- 活动自动归类（基于 aliases + categories）
- 连续记录天数统计

## 可视化仪表盘（index.html 重构）

### 三大视图

#### 1. 日历热力图（增强版）

- **年度概览**：12 个月每月总投入，点击月份进入月视图
- **月度热力图**：每天有记录时长标注，颜色深浅表示时长，点击日期进入日详情
- **日详情**：饼状图占比 + 记录列表，返回按钮回上级
- 空白日期不渲染详情，自动跳过无记录期

#### 2. 趋势图（可交互）

- 堆叠面积图替代折线图，直观看出总投入和各活动占比
- 支持拖拽滚动、缩放（chartjs-plugin-zoom）
- 活动筛选标签（按维度：学习/运动/生活/娱乐/工作）
- 7天 / 30天 / 90天 切换

#### 3. 分析报告（增强版）

- 维度概览卡片（总投入 / 日均 / 连续记录天数）
- 环形图：按维度占比（而非按单个活动）
- 洞察建议：连续性分析、异常检测（如「学习占比持续上升」「娱乐时间下降」）
- 活动排行条形图 + 环比变化
- 周 / 月 / 年切换

### 主题系统

- 双主题：暗色（GitHub 风）+ 亮色（Apple Health 风）
- CSS 变量控制，一键切换
- localStorage 记忆偏好

### 技术选型

- Chart.js 4 + chartjs-plugin-zoom
- 环形图：Chart.js doughnut chart
- 堆叠面积图：Chart.js line chart + fill
- 单文件 index.html，零构建依赖，GitHub Pages 直接部署

### Bug 修复

- 图表无法拖动 → chartjs-plugin-zoom 解决
- 空白数据占用空间 → 无记录日期不渲染详情，趋势图从第一条记录开始
- 前期无记录导致后期查看不便 → 日历自动跳过空白期，热力图从有数据的月份开始

## 微信 AI SKILL（wechat-ai/）

### 状态

代码提审未开放（官方原文：「暂未开放小程序 AI 开发模式的代码提审」）。先写好代码，等开放后快速上线。

### 原子接口

| 接口 | 入参 | 出参 | 说明 |
|------|------|------|------|
| `recordTime` | activity, duration_min, date? | 记录ID + 确认文案 | 记录时间 |
| `getStats` | range(week/month/year) | 统计摘要 + structuredContent | 查看统计 |
| `modifyRecord` | id, action(modify/delete), duration_min? | 操作确认 | 修改/删除 |

### 原子组件

| 组件 | 渲染内容 | 交互 |
|------|----------|------|
| `stat-card` | 环形图 + 维度占比 + 关键指标 | 点击进入小程序详情页 |
| `day-detail` | 当日饼状图 + 活动列表 | 点击查看/编辑记录 |

### 数据存储

微信云开发数据库（`wx.cloud.database()`），不用 records.json。

### SKILL.md

复用核心解析逻辑，适配微信对话场景：更简短的回复、卡片式展示、符合微信设计规范。

## GitHub 仓库运营

### README.md 结构

```
# Time Tracker

> 时间是最核心的生产资料——你花在哪，决定了你成为谁。

一句话介绍 + Demo 链接 + 截图

## 特性
- 自然语言记录，零门槛
- 智能别名归并 + 维度自动归类
- 三级日历下钻 + 可视化仪表盘
- 双主题（暗色/亮色）
- 数据存 JSON，换平台带走不丢
- 支持 Claude Code / 扣子 / 飞书 / 通用 Agent

## 快速开始
三种安装方式（Claude Code / 扣子 / 通用）

## 使用示例
对话示例

## 可视化
截图 + Demo 链接

## 数据格式
JSON schema 说明

## 数据迁移
导出/导入指南

## 贡献
PR / Issue 指引

## License
MIT
```

理念部分不提书名，直接表达观点。

### 传播路径

1. GitHub 发布 v2.0（完整 README + Demo）
2. 公众号写一篇文章
3. 文章里附仓库地址和 Demo 链接
4. 微信 AI 提审开放后上线微信技能

### 版本管理

- 语义化版本（v2.0.0 起步）
- GitHub Releases 发版
- changelog.md 记录变更
