---
name: time-tracker
description: |
  Use when user mentions time tracking, logging activities, or wants to see time statistics. Triggers: 记录时间, 时间统计, 时间报告, 看统计, 花了X分钟, 花了X小时, 看书半小时, 玩游戏10分钟, 写代码2h, 学习了1小时, 今天学了, 刚才在做, 批量记录, 分类, 类别, 归并, 今天, 本周, 本月. Also triggers when user describes what they did with a duration.
---

# Time Tracker v2

自然语言时间记录工具。用户说什么做了多久，你负责解析、记录、统计。

## 安装（只做一次）

用户给仓库链接说"帮我安装"时：

1. 克隆仓库：`git clone https://github.com/xixihaha1135-star/time-tracker.git`
2. 读这个 SKILL.md（你正在读）
3. 在克隆目录创建 `records.json`（见下方"初始化"）
4. 告诉用户：**安装好了 ✅ 试试说「看书半小时」**

如果用户有 GitHub 账号且想要在线图表，额外做：
- 让用户 fork 仓库到自己账号
- 用用户 fork 的地址重新 clone
- 让用户启用 GitHub Pages（Settings → Pages → Source 选 master 分支）
- 以后每次记录后 `git push`，图表自动更新

**没有 GitHub 也完全能用**——记录和统计不需要 GitHub。

## 数据文件

数据存在 `records.json`，和这个 SKILL.md 同目录。

```json
{
  "version": "2.0",
  "aliases": { "看英文原著": "看书" },
  "records": [
    {
      "id": "20260610-182449-fc55",
      "date": "2026-06-10",
      "start": "",
      "end": "",
      "duration_min": 30,
      "activity": "看书",
      "detail": "把时间当做朋友",
      "raw_input": "看《把时间当做朋友》半小时",
      "created_at": "2026-06-10T18:24:49.079383Z",
      "category": "学习"
    }
  ],
  "categories": {
    "学习": ["看书", "做作业"],
    "生活": ["吃饭", "洗漱洗衣", "休息"],
    "运动": ["早训", "健身"],
    "娱乐": ["打游戏", "玩手机"],
    "工作": ["AI技术研究", "公众号", "开会", "工作"]
  }
}
```

关键字段：
- `aliases` — 别名→标准名映射，自动积累
- `records[]` — 每条有 id/date/duration_min/activity/category，detail 可选
- `categories` — 类别→活动名数组，自动积累

## 核心流程：记录时间

### 第1步：解析用户输入

从用户话里提取 activity + duration_min：

| 用户说 | activity | duration_min |
|--------|----------|-------------|
| 看书半小时 | 看书 | 30 |
| 打游戏2h | 打游戏 | 120 |
| 学习了1小时 | 学习 | 60 |
| 9点到11点写代码 | 写代码 | 120（start="09:00" end="11:00"） |

**批量输入**用 `、` `，` `+` 拆分，逐条解析。

缺时长问"花了多久？"，缺活动问"做了什么？"

### 第2步：别名归并

1. activity 在 `aliases` 里？→ 用映射后的标准名
2. 和已有 activity 语义接近？→ 问用户要不要归并
3. 确认归并后写入 `aliases`

### 第3步：提取细节

输入里有书名、游戏名等细节就提取到 `detail`，没有不追问。

- 「看《把时间当做朋友》」→ activity:"看书", detail:"把时间当做朋友"
- 「打王者荣耀」→ activity:"打游戏", detail:"王者荣耀"

### 第4步：匹配类别

1. activity 已在 `categories` 里？→ 直接用
2. 按关键词推断：打/玩/刷→娱乐，学/读/背→学习，吃/睡/洗→生活，跑/健身/训→运动，写/做/开发→工作
3. 推断不出才问用户
4. 问一次记住，写入 `categories`

### 第5步：写入 + 提交

追加到 records 数组，写回 records.json。

如果有 git 仓库：
```bash
cd <records.json所在目录>
git add records.json
git commit -m "记录: <activity> <duration>分钟"
git push
```

### 第6步：回复用户

- 单条：`已记录：看书（把时间当做朋友）30分钟（学习）✅`
- 批量：`已记录 3 条，共 80 分钟 ✅` 后跟明细
- 附带：`今天已记录 X 条，共 Y 分钟。`

## 查看统计

| 用户说 | 范围 |
|--------|------|
| 今天 | date == 今天 |
| 昨天 | date == 昨天 |
| 本周 | 本周一 ~ 今天 |
| 本月 | 本月1日 ~ 今天 |
| 不指定 | 默认本周 |

输出格式：
```
📊 本周时间报告（6.8 - 6.14）

总记录：31 条 | 总投入：18h45m

📂 类别分布：
1. 学习 — 12h30m（42%）
2. 工作 — 8h（28%）
3. 生活 — 5h（18%）

📋 活动排名：
1. 备考六级 — 6h
2. AI技术研究 — 4h
3. 看书 — 2.5h
```

可视化提醒：`完整图表：https://<用户名>.github.io/time-tracker/`
无 GitHub 的用户：`打开 index.html 点右上角📂导入 records.json 即可查看图表`

## 修改 / 删除

- 修改：找到目标记录，改对应字段，重新提交
- 删除：展示内容，用户确认后移除，重新提交
- 补录：用户指定过去日期时，用那个日期而不是今天

## 类别管理

- 查看类别：展示 categories 字典
- 归并活动：移到目标类别，批量更新历史记录的 category
- 新建类别：添加到 categories
- 改类别名：重命名 key，批量更新历史记录

## 数据导入导出

**导出**：输出 records.json 完整 JSON，附带"复制到新平台说'导入数据'即可"

**导入**：解析用户提供的 JSON，校验格式，确认覆盖后写入

## 初始化

找不到 records.json 时创建：

```json
{
  "version": "2.0",
  "aliases": {},
  "records": [],
  "categories": {
    "学习": [],
    "生活": [],
    "运动": [],
    "娱乐": [],
    "工作": [],
    "其他": []
  }
}
```

## 提交规范

| 操作 | commit message |
|------|---------------|
| 记录 | `记录: <activity> <duration>分钟` |
| 批量 | `记录: N条 <total>分钟` |
| 修改 | `修改: <activity> → <new>分钟` |
| 删除 | `删除: <activity> <duration>分钟` |
| 初始化 | `init: time-tracker v2` |
