/**
 * recordTime API — 记录一条时间花销
 *
 * 入参：{ activity: string, duration_min: number, date?: string }
 * 出参：{ isError, content, structuredContent, _meta }
 *
 * 数据存储：微信云开发数据库 time_records collection
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

// 默认类别映射
const CATEGORIES = {
  '学习': ['看书', '做作业', '备考六级'],
  '生活': ['吃饭', '洗漱洗衣', '休息'],
  '运动': ['早训', '健身'],
  '娱乐': ['玩手机', '打游戏'],
  '工作': ['AI技术研究', '公众号', '开会', '工作']
};

/**
 * 生成记录 ID：YYYYMMDD-HHmmss-xxxx
 */
function generateId() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timePart = now.toISOString().slice(11, 19).replace(/:/g, '');
  const rand = Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0');
  return `${datePart}-${timePart}-${rand}`;
}

/**
 * 根据活动名查找类别
 */
function findCategory(activity) {
  for (const [cat, activities] of Object.entries(CATEGORIES)) {
    if (activities.includes(activity)) {
      return cat;
    }
  }
  return '其他';
}

/**
 * 主函数
 */
module.exports = async function recordTime(params, context) {
  const { activity, duration_min, date } = params;
  const { OPENID } = context;

  const recordId = generateId();
  const recordDate = date || new Date().toISOString().slice(0, 10);
  const category = findCategory(activity);

  const db = wx.cloud.database();
  const collection = db.collection('time_records');

  // 写入记录
  const record = {
    _openid: OPENID,
    id: recordId,
    date: recordDate,
    duration_min,
    activity,
    category,
    created_at: new Date().toISOString()
  };

  try {
    await collection.add({ data: record });

    // 查询当日汇总
    const todayStart = recordDate;
    const todayEnd = recordDate;
    const todayRecords = await collection
      .where({
        _openid: OPENID,
        date: db.command.gte(todayStart).and(db.command.lte(todayEnd))
      })
      .get();

    const todayTotal = todayRecords.data.reduce((sum, r) => sum + r.duration_min, 0);
    const todayCount = todayRecords.data.length;

    const result = {
      success: true,
      recordId,
      activity,
      duration_min,
      category,
      date: recordDate,
      today_total: todayTotal,
      today_count: todayCount
    };

    return {
      isError: false,
      content: [
        {
          type: 'text',
          text: `已记录：${activity} ${duration_min} 分钟 ✅\n今天已记录 ${todayCount} 条，共 ${todayTotal} 分钟。`
        }
      ],
      structuredContent: result,
      _meta: {
        ui: {
          componentPath: 'components/stat-card/index',
          recordId
        }
      }
    };
  } catch (err) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `记录失败：${err.message || '未知错误'}`
        }
      ],
      structuredContent: { success: false, error: err.message },
      _meta: {}
    };
  }
};
