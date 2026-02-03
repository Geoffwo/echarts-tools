/*! @license echarts-tools
 * Copyright (c) 2025 geoffwo
 * This source code is licensed under the ISC license
 */
import { registerSimpleEventHandler } from '../utils/strategyUtils.js';
const yIndex = (params, myChart, option={}, config={}) => {
    const pointInPixel = [params.offsetX, params.offsetY];//获取点位信息

    // 检查该像素点是否在图表坐标系内
    if (myChart.containPixel('grid', pointInPixel)) {// grid是笛卡尔坐标系，比如折线图或柱状图
        // { seriesIndex: 0 } 表示使用第一个系列的坐标系进行转换（如 x/y 轴的数值）
        const pointInGrid = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel);

        return { yIndex: Math.abs(pointInGrid[1]) };//取数据坐标第2个维度的绝对值（通常是 y 轴值）
    }

    return null;
}

// 注册策略并添加元数据
registerSimpleEventHandler('yIndex', yIndex, '从点击坐标提取数据项的 y 轴索引，适用于笛卡尔坐标系（如折线图、柱状图）');
