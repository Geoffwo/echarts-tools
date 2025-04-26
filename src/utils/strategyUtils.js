/*! @license echarts-tools strategyUtils.js
 * Copyright (c) 2025 geoffwo
 * This source code is licensed under the ISC license
 */
const strategyStore = new Map(); // 使用 Map 存储策略及其元数据


/**
* 获取所有注册的策略
*/
const strategyUtils = {
  get: (name) => strategyStore.get(name).handler,
  getAll: () => Object.fromEntries(Array.from(strategyStore).map(([k, v]) => [k, v.handler])),
  getAllInfo: () => Object.fromEntries(Array.from(strategyStore).map(([k, v]) => [k, v.meta])),
};

/**
 * 注册事件处理策略
 * @param {string} name 策略名称
 * @param {Function} handler 处理函数
 * @param {Object} meta 元数据（描述、参数、示例等）
 */
function registerEventHandler(name, handler, meta = {}) {
  // 校验必要参数
  if (!name || typeof handler !== 'function') {
    throw new Error('Invalid strategy registration: name and handler are required');
  }

  // 存储策略函数和元数据
  strategyStore.set(name, {
    handler,
    meta: { ...meta }
  });
}

function registerSimpleEventHandler(name, handler, description) {
  registerEventHandler(name, handler, {description})
}

export{
  strategyUtils,
  registerEventHandler,
  registerSimpleEventHandler
}
