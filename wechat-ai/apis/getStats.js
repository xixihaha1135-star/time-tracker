/**
 * getStats API — 查询时间统计摘要
 *
 * 入参：{ range: "week" | "month" | "year" }
 * 出参：{ isError, content, structuredContent, _meta }
 *
 * structuredContent 包含完整的统计数据，供 stat-card 组件渲染
 */

// 类别颜色映射
const CATEGORY_COLORS = {
  '学习': '#4A90D9',
  '生活': '#7ED321',
  '运动': '#F5A623',
  '娱乐': '#D0021B',
  '工作': '#50E3C2',
  '其他': '#9B9B9B'
};

/**
 * 计算指定时间范围的起止日期
 */
function getDateRange(range) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case 'week': {
      const dayOfWeek = today.getDay() || 7; // 周日=7
      const monday = new Date(today);
      monday.setDate(today.getDate() - dayOfWeek + 1);
      return {
        start: monday.toISOString().slice(0, 10),
        end: today.toISOString().slice(0, 10),
        label: `本周（${formatDateShort(monday)} - ${formatDateShort(today)}）`
      };
    }
    case 'month': {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        start: firstDay.toISOString().slice(0, 10),
        end: today.toISOString().slice(0, 10),
        label: `本月（${formatDateShort(firstDay)} - ${formatDateShort(today)}）`
      };
    }
    case 'year': {
      const firstDay = new Date(today.getFullYear(), 0, 1);
      return {
        start: firstDay.toISOString().slice(0, 10),
        end: today.toISOString().slice(0, 10),
        label: `今年（${formatDateShort(firstDay)} - ${formatDateShort(today)}）`
      };
    }
    default:
      return getDateRange('week');
  }
}

function formatDateShort(d) {
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

function formatDuration(totalMin) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} 分钟`;
  if (m === 0) return `${h} 小时`;
  return `${h} 小时 ${m} 分钟`;
}

/**
 * 计算连续记录天数
 */
function calculateStreak(records) {
  if (!records.length) return 0;

  // 提取去重日期并排序
  const dates = [...new Set(records.map(r => r.date))].sort().reverse();

  const today = new Date().toISOString().slice(0, 10);
  let streak = 0;

  // 检查今天或昨天是否有记录
  if (dates[0] !== today && dates[0] !== getYesterday()) {
    return 0;
  }

  let checkDate = new Date(dates[0]);
  for (const dateStr of dates) {
    const d = new Date(dateStr);
    const diff = Math.round((checkDate - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (diff === 1) {
      streak++;
      checkDate = new Date(d);
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * 生成洞察
 */
function generateInsights(stats) {
  const insights = [];

  // 连续性洞察
  if (stats.streak_days >= 7) {
    insights.push({
      type: 'streak',
      text: `连续 ${stats.streak_days} 天有记录，保持住！`
    });
  } else if (stats.streak_days >= 3) {
    insights.push({
      type: 'streak',
      text: `已连续记录 ${stats.streak_days} 天`
    });
  }

  // 主导类别洞察
  if (stats.category_breakdown.length > 0) {
    const top = stats.category_breakdown[0];
    if (top.percentage >= 40) {
      insights.push({
        type: 'dominant',
        text: `${top.category} 占比最高，达 ${top.percentage}%`
      });
    }
  }

  // 娱乐警告
  const entertainment = stats.category_breakdown.find(c => c.category === '娱乐');
  if (entertainment && entertainment.percentage >= 30) {
    insights.push({
      type: 'warning',
      text: `娱乐占比 ${entertainment.percentage}%，考虑调整一下分配`
    });
  }

  // 运动鼓励
  const sport = stats.category_breakdown.find(c => c.category === '运动');
  if (!sport || sport.total_min === 0) {
    insights.push({
      type: 'warning',
      text: '本周还没有运动记录，动起来！'
    });
  }

  return insights.slice(0, 3);
}

/**
 * 主函数
 */
module.exports = async function getStats(params, context) {
  const { range } = params;
  const { OPENID } = context;

  const { start, end, label } = getDateRange(range);

  const db = wx.cloud.database();
  const collection = db.collection('time_records');
  const _ = db.command;

  try {
    // 查询时间范围内的所有记录
    const result = await collection
      .where({
        _openid: OPENID,
        date: _.gte(start).and(_.lte(end))
      })
      .get();

    const records = result.data;

    if (!records.length) {
      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: `${label}暂无记录。开始记录时间吧，直接说「看书半小时」就行。`
          }
        ],
        structuredContent: {
          range,
          label,
          total_min: 0,
          daily_avg_min: 0,
          record_count: 0,
          streak_days: 0,
          category_breakdown: [],
          top_activities: [],
          insights: []
        },
        _meta: {
          ui: { componentPath: 'components/stat-card/index' }
        }
      };
    }

    // 总投入
    const total_min = records.reduce((sum, r) => sum + r.duration_min, 0);

    // 天数（有记录的天数）
    const activeDays = new Set(records.map(r => r.date)).size;
    const daily_avg_min = Math.round(total_min / activeDays);

    // 记录条数
    const record_count = records.length;

    // 连续天数
    const streak_days = calculateStreak(records);

    // 按类别聚合
    const categoryMap = {};
    records.forEach(r => {
      const cat = r.category || '其他';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { total_min: 0, activities: {} };
      }
      categoryMap[cat].total_min += r.duration_min;
      if (!categoryMap[cat].activities[r.activity]) {
        categoryMap[cat].activities[r.activity] = 0;
      }
      categoryMap[cat].activities[r.activity] += r.duration_min;
    });

    const category_breakdown = Object.entries(categoryMap)
      .map(([category, data]) => ({
        category,
        total_min: data.total_min,
        percentage: Math.round((data.total_min / total_min) * 100),
        color: CATEGORY_COLORS[category] || '#9B9B9B'
      }))
      .sort((a, b) => b.total_min - a.total_min);

    // 按活动聚合
    const activityMap = {};
    records.forEach(r => {
      if (!activityMap[r.activity]) {
        activityMap[r.activity] = 0;
      }
      activityMap[r.activity] += r.duration_min;
    });

    const top_activities = Object.entries(activityMap)
      .map(([activity, total_min]) => ({
        activity,
        total_min,
        percentage: Math.round((total_min / total_min) * 100)
      }))
      .sort((a, b) => b.total_min - a.total_min)
      .slice(0, 5);

    const stats = {
      total_min,
      daily_avg_min,
      record_count,
      streak_days,
      category_breakdown,
      top_activities
    };

    const insights = generateInsights(stats);

    const responseText = [
      `${label}`,
      `总投入：${formatDuration(total_min)} | 日均：${formatDuration(daily_avg_min)}`,
      `共 ${record_count} 条记录 | 连续 ${streak_days} 天`,
      insights.length ? `\n${insights.map(i => `- ${i.text}`).join('\n')}` : ''
    ].join('\n');

    return {
      isError: false,
      content: [
        {
          type: 'text',
          text: responseText
        }
      ],
      structuredContent: {
        range,
        label,
        ...stats,
        insights
      },
      _meta: {
        ui: {
          componentPath: 'components/stat-card/index'
        }
      }
    };
  } catch (err) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `查询失败：${err.message || '未知错误'}`
        }
      ],
      structuredContent: { error: err.message },
      _meta: {}
    };
  }
};
