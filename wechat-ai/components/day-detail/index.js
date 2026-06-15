/**
 * day-detail 组件 — 日详情卡片组件逻辑
 *
 * 通过 wx.modelContext.getViewContext() 获取 structuredContent 数据
 * 使用 Canvas 2D 绘制饼状图
 * 仅支持 tap 事件
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
 * 格式化分钟数为中文显示
 */
function formatDuration(totalMin) {
  if (totalMin === 0) return '0 分钟';
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} 分钟`;
  if (m === 0) return `${h} 小时`;
  return `${h} 小时 ${m} 分钟`;
}

/**
 * 格式化日期为中文显示
 */
function formatDateLabel(dateStr) {
  if (!dateStr) return '详情';

  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().slice(0, 10)) {
    return '今天';
  }
  if (dateStr === yesterday.toISOString().slice(0, 10)) {
    return '昨天';
  }

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekDay = weekDays[d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日 ${weekDay}`;
}

Component({
  properties: {
    // 外部传入的属性（备用，主要使用 modelContext）
    date: { type: String, value: '' },
    total_min: { type: Number, value: 0 },
    activities: { type: Array, value: [] }
  },

  data: {
    dateLabel: '详情',
    totalDisplay: '0 分钟',
    activities: [],
    pieSize: 200
  },

  lifetimes: {
    attached() {
      this._loadData();
    }
  },

  observers: {
    'total_min, activities'(total, acts) {
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
            date: data.date || '',
            total_min: data.total_min || 0,
            activities: (data.activities || []).map(item => ({
              ...item,
              color: item.color || CATEGORY_COLORS[item.category] || '#9B9B9B',
              displayTime: formatDuration(item.duration_min)
            }))
          });
          this._updateDisplay();
          this._drawPie();
        }
      } catch (err) {
        this._updateDisplay();
        this._drawPie();
      }
    },

    /**
     * 更新展示数据
     */
    _updateDisplay() {
      const { date, total_min, activities } = this.data;

      const formattedActivities = (activities || []).map(item => ({
        ...item,
        color: item.color || CATEGORY_COLORS[item.category] || '#9B9B9B',
        displayTime: formatDuration(item.duration_min)
      }));

      this.setData({
        dateLabel: formatDateLabel(date),
        totalDisplay: formatDuration(total_min),
        activities: formattedActivities
      });
    },

    /**
     * 绘制饼状图
     */
    _drawPie() {
      const query = this.createSelectorQuery();
      query.select('#pie-canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0] || !res[0].node) return;

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = wx.getSystemInfoSync().pixelRatio;

          const size = this.data.pieSize;
          canvas.width = size * dpr;
          canvas.height = size * dpr;
          ctx.scale(dpr, dpr);

          const centerX = size / 2;
          const centerY = size / 2;
          const radius = size / 2 - 16;

          const activities = this.data.activities || [];
          const total = activities.reduce((sum, item) => sum + item.duration_min, 0);

          if (total === 0 || activities.length === 0) {
            // 绘制空状态灰色圆形
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#f0f0f0';
            ctx.fill();
            return;
          }

          // 绘制各扇形
          let startAngle = -Math.PI / 2;

          activities.forEach((item) => {
            const sweepAngle = (item.duration_min / total) * Math.PI * 2;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sweepAngle);
            ctx.closePath();
            ctx.fillStyle = item.color || '#9B9B9B';
            ctx.fill();

            // 扇形间留白分隔线
            if (activities.length > 1) {
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.arc(centerX, centerY, radius, startAngle, startAngle + sweepAngle);
              ctx.lineTo(centerX, centerY);
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 2;
              ctx.stroke();
            }

            startAngle += sweepAngle;
          });
        });
    },

    /**
     * 卡片整体点击
     */
    onCardTap() {
      console.log('day-detail tapped');
    },

    /**
     * 单个活动行点击 — 可跳转编辑
     */
    onActivityTap(e) {
      const index = e.currentTarget.dataset.index;
      const activity = this.data.activities[index];
      if (activity) {
        // 预留：跳转到该活动的编辑/查看页面
        console.log('activity tapped:', activity.activity);
      }
    }
  }
});
