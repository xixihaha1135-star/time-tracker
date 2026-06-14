/**
 * stat-card 组件 — 统计卡片组件逻辑
 *
 * 通过 wx.modelContext.getViewContext() 获取 structuredContent 数据
 * 使用 Canvas 2D 绘制环形图
 * 仅支持 tap 事件
 */

// 默认类别颜色
const DEFAULT_COLORS = {
  '学习': '#4A90D9',
  '生活': '#7ED321',
  '运动': '#F5A623',
  '娱乐': '#D0021B',
  '工作': '#50E3C2',
  '其他': '#9B9B9B'
};

// 洞察类型图标
const INSIGHT_ICONS = {
  streak: '🔥',
  trend: '📈',
  dominant: '📊',
  warning: '⚠️'
};

/**
 * 格式化分钟数为小时显示
 */
function formatHours(totalMin) {
  if (totalMin === 0) return '0h';
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (m === 0) return `${h}h`;
  return `${h}h${m}m`;
}

/**
 * 格式化分钟数为中文显示
 */
function formatDuration(totalMin) {
  if (totalMin === 0) return '0m';
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}m`;
}

Component({
  properties: {
    // 外部传入的属性（备用，主要使用 modelContext）
    label: { type: String, value: '' },
    total_min: { type: Number, value: 0 },
    daily_avg_min: { type: Number, value: 0 },
    record_count: { type: Number, value: 0 },
    streak_days: { type: Number, value: 0 },
    category_breakdown: { type: Array, value: [] },
    top_activities: { type: Array, value: [] },
    insights: { type: Array, value: [] }
  },

  data: {
    // 计算后的展示数据
    label: '',
    totalHours: '0h',
    dailyAvg: '0m',
    recordCount: '0',
    streakDays: '0',
    categoryBreakdown: [],
    topActivities: [],
    insights: [],
    insightIcons: INSIGHT_ICONS,

    // 环形图尺寸
    ringSize: 160
  },

  lifetimes: {
    attached() {
      this._loadData();
    }
  },

  observers: {
    'total_min, daily_avg_min, record_count, streak_days'(total, avg, count, streak) {
      this._updateDisplay();
    }
  },

  methods: {
    /**
     * 从 modelContext 加载数据
     */
    async _loadData() {
      try {
        const viewCtx = wx.modelContext.getViewContext();
        if (viewCtx && viewCtx.structuredContent) {
          const data = viewCtx.structuredContent;
          this.setData({
            label: data.label || '',
            total_min: data.total_min || 0,
            daily_avg_min: data.daily_avg_min || 0,
            record_count: data.record_count || 0,
            streak_days: data.streak_days || 0,
            category_breakdown: (data.category_breakdown || []).map(item => ({
              ...item,
              displayTime: formatDuration(item.total_min)
            })),
            top_activities: (data.top_activities || []).map(item => ({
              ...item,
              displayTime: formatDuration(item.total_min)
            })),
            insights: data.insights || []
          });
          this._updateDisplay();
          this._drawRing();
        }
      } catch (err) {
        // modelContext 不可用时使用 properties
        this._updateDisplay();
        this._drawRing();
      }
    },

    /**
     * 更新展示数据
     */
    _updateDisplay() {
      const { total_min, daily_avg_min, record_count, streak_days,
              category_breakdown, top_activities, insights } = this.data;

      // 为类别数据添加格式化时间
      const categoriesWithTime = (category_breakdown || []).map(item => ({
        ...item,
        displayTime: formatDuration(item.total_min)
      }));

      // 为活动数据添加格式化时间
      const activitiesWithTime = (top_activities || []).map(item => ({
        ...item,
        displayTime: formatDuration(item.total_min)
      }));

      this.setData({
        totalHours: formatHours(total_min),
        dailyAvg: formatDuration(daily_avg_min),
        recordCount: String(record_count),
        streakDays: String(streak_days),
        categoryBreakdown: categoriesWithTime,
        topActivities: activitiesWithTime,
        insights: insights || [],
        insightIcons: INSIGHT_ICONS
      });
    },

    /**
     * 绘制环形图
     */
    _drawRing() {
      const query = this.createSelectorQuery();
      query.select('#ring-canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0] || !res[0].node) return;

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = wx.getSystemInfoSync().pixelRatio;

          const size = this.data.ringSize;
          canvas.width = size * dpr;
          canvas.height = size * dpr;
          ctx.scale(dpr, dpr);

          const centerX = size / 2;
          const centerY = size / 2;
          const outerRadius = size / 2 - 8;
          const innerRadius = outerRadius * 0.65;
          const ringWidth = outerRadius - innerRadius;

          const breakdown = this.data.category_breakdown || [];
          const total = breakdown.reduce((sum, item) => sum + item.total_min, 0);

          if (total === 0) {
            // 绘制空状态灰色圆环
            ctx.beginPath();
            ctx.arc(centerX, centerY, (outerRadius + innerRadius) / 2, 0, Math.PI * 2);
            ctx.lineWidth = ringWidth;
            ctx.strokeStyle = '#e8e8e8';
            ctx.stroke();
            return;
          }

          // 绘制各段
          let startAngle = -Math.PI / 2;

          breakdown.forEach((item) => {
            const sweepAngle = (item.total_min / total) * Math.PI * 2;

            ctx.beginPath();
            ctx.arc(centerX, centerY, (outerRadius + innerRadius) / 2,
                    startAngle, startAngle + sweepAngle);
            ctx.lineWidth = ringWidth;
            ctx.strokeStyle = item.color || '#9B9B9B';
            ctx.lineCap = 'round';
            ctx.stroke();

            startAngle += sweepAngle;
          });
        });
    },

    /**
     * 卡片点击事件
     */
    onCardTap() {
      // 预留：点击卡片跳转到小程序详情页
      // wx.navigateTo({ url: '/pages/stats-detail/index' });
      console.log('stat-card tapped');
    }
  }
});
