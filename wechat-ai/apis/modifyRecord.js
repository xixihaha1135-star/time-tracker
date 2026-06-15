/**
 * modifyRecord API — 修改或删除一条时间记录
 *
 * 入参：{ id: string, action: "modify" | "delete", duration_min?: number, activity?: string, category?: string }
 * 出参：{ isError, content, structuredContent, _meta }
 */

/**
 * 根据活动名查找类别
 */
const CATEGORIES = {
  '学习': ['看书', '做作业', '备考六级'],
  '生活': ['吃饭', '洗漱洗衣', '休息'],
  '运动': ['早训', '健身'],
  '娱乐': ['玩手机', '打游戏'],
  '工作': ['AI技术研究', '公众号', '开会', '工作']
};

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
module.exports = async function modifyRecord(params, context) {
  const { id, action, duration_min, activity, category } = params;
  const { OPENID } = context;

  const db = wx.cloud.database();
  const collection = db.collection('time_records');

  try {
    // 查找记录（必须匹配 OPENID，防止越权）
    const query = await collection
      .where({
        _openid: OPENID,
        id
      })
      .get();

    if (!query.data.length) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: '找不到这条记录，可能已经被删除了。'
          }
        ],
        structuredContent: { success: false, error: 'record_not_found' },
        _meta: {}
      };
    }

    const record = query.data[0];

    // 删除操作
    if (action === 'delete') {
      await collection.doc(record._id).remove();

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: `已删除：${record.activity} ${record.duration_min} 分钟 ✅`
          }
        ],
        structuredContent: {
          success: true,
          action: 'delete',
          record: {
            id: record.id,
            activity: record.activity,
            duration_min: record.duration_min,
            category: record.category,
            date: record.date
          }
        },
        _meta: {}
      };
    }

    // 修改操作
    if (action === 'modify') {
      const updateData = {};

      if (duration_min !== undefined) {
        updateData.duration_min = duration_min;
      }

      if (activity !== undefined) {
        updateData.activity = activity;
        // 重新匹配类别（如果用户未指定新类别）
        if (category === undefined) {
          updateData.category = findCategory(activity);
        }
      }

      if (category !== undefined) {
        updateData.category = category;
      }

      if (Object.keys(updateData).length === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: '请提供要修改的字段（duration_min / activity / category）。'
            }
          ],
          structuredContent: { success: false, error: 'no_fields' },
          _meta: {}
        };
      }

      await collection.doc(record._id).update({ data: updateData });

      const newActivity = updateData.activity || record.activity;
      const newDuration = updateData.duration_min || record.duration_min;
      const newCategory = updateData.category || record.category;

      const changes = [];
      if (updateData.duration_min !== undefined) {
        changes.push(`${record.duration_min} → ${updateData.duration_min} 分钟`);
      }
      if (updateData.activity !== undefined) {
        changes.push(`活动：${record.activity} → ${updateData.activity}`);
      }
      if (updateData.category !== undefined) {
        changes.push(`类别：${record.category} → ${updateData.category}`);
      }

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: `已修改：${newActivity} ${newDuration} 分钟 ✅\n变更：${changes.join('，')}`
          }
        ],
        structuredContent: {
          success: true,
          action: 'modify',
          record: {
            id: record.id,
            activity: newActivity,
            duration_min: newDuration,
            category: newCategory,
            date: record.date
          }
        },
        _meta: {}
      };
    }

    return {
      isError: true,
      content: [{ type: 'text', text: `不支持的操作：${action}` }],
      structuredContent: { success: false, error: 'unknown_action' },
      _meta: {}
    };
  } catch (err) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `操作失败：${err.message || '未知错误'}`
        }
      ],
      structuredContent: { success: false, error: err.message },
      _meta: {}
    };
  }
};
