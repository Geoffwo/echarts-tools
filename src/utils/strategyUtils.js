/*! @license echarts-tools
 * Copyright (c) 2025 geoffwo
 * This source code is licensed under the ISC license
 */
const strategyStore = new Map(); // 使用 Map 存储策略及其元数据

const xIndex = (params, myChart,config={}) => {
  // config,给自定义策略的预留位置
  // const {seriesIndex=0,finder='grid'} = config

  const pointInPixel = [params.offsetX, params.offsetY];//获取点位信息

  // 检查该像素点是否在图表坐标系内
  if (myChart.containPixel('grid', pointInPixel)) {// grid是笛卡尔坐标系，比如折线图或柱状图
    // { seriesIndex: 0 } 表示使用第一个系列的坐标系进行转换（如 x/y 轴的数值）
    const pointInGrid = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel);

    return { xIndex: Math.abs(pointInGrid[0]) };//取数据坐标第1个维度的绝对值（通常是 x 轴值）
  }

  return null;
}

// 注册策略并添加元数据
registerSimpleEventHandler('xIndex', xIndex, '从点击坐标提取数据项的 x 轴索引，适用于笛卡尔坐标系（如折线图、柱状图）');

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
