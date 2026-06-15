/**
 * index.js — 微信 AI 开发模式入口
 *
 * 职责：
 * 1. 注册登录中间件（检查 storage token / wx.login）
 * 2. 注册所有原子 API
 * 3. 注册所有原子组件
 *
 * 状态：代码提审未开放（官方原文：「暂未开放小程序 AI 开发模式的代码提审」）
 *       先写好代码，等开放后快速上线
 *
 * 架构：
 * - SKILL.md：业务描述（≤16KB）
 * - mcp.json：原子接口声明（≤24KB）
 * - index.js：注册所有接口
 * - apis/：原子接口实现
 * - components/：原子组件实现
 */

const recordTime = require('./apis/recordTime');
const getStats = require('./apis/getStats');
const modifyRecord = require('./apis/modifyRecord');

/**
 * 登录中间件
 *
 * 流程：
 * 1. 检查 wx.storage 中是否有已缓存的登录凭证
 * 2. 没有则调用 wx.login() 获取 code
 * 3. 通过 code 换取 openid（需要后端接口，或使用云函数）
 * 4. 将 openid 注入到 context 中
 *
 * 微信 AI 开发模式下，登录身份与主小程序共享，
 * 通过 storage 或 wx.login 获取。
 */
async function loginMiddleware(context) {
  try {
    // 1. 先从 storage 读取缓存的登录信息
    const cached = wx.getStorageSync('time_tracker_session');
    if (cached && cached.OPENID && cached.expireAt > Date.now()) {
      context.OPENID = cached.OPENID;
      return;
    }

    // 2. 没有缓存，调用 wx.login 获取 code
    const loginRes = await new Promise((resolve, reject) => {
      wx.login({
        success: resolve,
        fail: reject
      });
    });

    if (!loginRes.code) {
      throw new Error('wx.login 未返回 code');
    }

    // 3. 使用云函数换取 openid（推荐方式）
    const cloudRes = await wx.cloud.callFunction({
      name: 'getOpenId',
      data: { code: loginRes.code }
    });

    if (cloudRes.result && cloudRes.result.OPENID) {
      context.OPENID = cloudRes.result.OPENID;

      // 缓存登录信息，有效期 7 天
      wx.setStorageSync('time_tracker_session', {
        OPENID: cloudRes.result.OPENID,
        expireAt: Date.now() + 7 * 24 * 60 * 60 * 1000
      });
    } else {
      throw new Error('云函数未返回 OPENID');
    }
  } catch (err) {
    console.error('[time-tracker] 登录失败:', err);
    // 使用匿名标识作为降级方案
    context.OPENID = 'anonymous_' + Date.now();
  }
}

/**
 * API 包装器
 *
 * 为每个 API 添加：
 * 1. 登录检查（注入 OPENID）
 * 2. 参数校验
 * 3. 错误处理
 * 4. 统一返回格式
 */
function wrapApi(apiHandler) {
  return async function (params, context) {
    // 1. 登录中间件
    if (!context.OPENID) {
      await loginMiddleware(context);
    }

    // 2. 调用实际 API
    try {
      return await apiHandler(params, context);
    } catch (err) {
      console.error('[time-tracker] API 错误:', err);
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `出错了：${err.message || '未知错误'}\n请稍后重试。`
          }
        ],
        structuredContent: { error: err.message },
        _meta: {}
      };
    }
  };
}

/**
 * 注册所有原子 API
 *
 * 使用 wx.modelContext.createSkill() 注册
 * 微信 AI 开发模式会自动加载此文件
 */
function registerApis() {
  try {
    // 检查是否在微信 AI 环境中
    if (typeof wx !== 'undefined' && wx.modelContext && wx.modelContext.createSkill) {

      wx.modelContext.createSkill({
        skillId: 'time-tracker-wechat',
        skillName: '时间统计助手',
        version: '2.0.0',

        // 注册原子 API
        apis: {
          recordTime: wrapApi(recordTime),
          getStats: wrapApi(getStats),
          modifyRecord: wrapApi(modifyRecord)
        },

        // 注册原子组件
        components: {
          'stat-card': 'components/stat-card/index',
          'day-detail': 'components/day-detail/index'
        },

        // 生命周期
        onLaunch() {
          console.log('[time-tracker] SKILL 已启动');
        },

        onError(err) {
          console.error('[time-tracker] SKILL 错误:', err);
        }
      });

      console.log('[time-tracker] 3 个 API 已注册：recordTime, getStats, modifyRecord');
      console.log('[time-tracker] 2 个组件已注册：stat-card, day-detail');
    } else {
      // 非微信 AI 环境，导出供测试或独立使用
      console.log('[time-tracker] 非微信 AI 环境，导出 API 函数供直接调用');
    }
  } catch (err) {
    console.error('[time-tracker] 注册失败:', err);
  }
}

// 执行注册
registerApis();

// 导出 API 函数（供测试或非微信 AI 环境使用）
module.exports = {
  recordTime: wrapApi(recordTime),
  getStats: wrapApi(getStats),
  modifyRecord: wrapApi(modifyRecord),
  loginMiddleware,
  registerApis
};
