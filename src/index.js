/*! @license echarts-tools
* Copyright (c) 2025 geoffwo
* This source code is licensed under the ISC license
*/
import './strategy/xIndex.js'; // 注册内置策略
import './strategy/pie3D.js'; // 注册内置策略
export { createBasicChartInstance, drawBasicChartFactory, printDoc, importEcharts } from './utils/echartsUtils.js';
export { strategyUtils, registerEventHandler,registerSimpleEventHandler } from './utils/strategyUtils.js';
