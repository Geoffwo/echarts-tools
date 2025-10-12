/*! @license echarts-tools
 * Copyright (c) 2025 geoffwo
 * This source code is licensed under the ISC license
 */
import { registerSimpleEventHandler } from '../utils/strategyUtils.js';
const pie3dOver = (params, chart, config={}) => {
    const chartOption = chart.getOption()

    const hoveredSeriesIndex = chart.hoveredSeriesIndex; // 悬停的扇区系列索引

    const { seriesIndex, seriesName } = params;
    // 跳过无效系列（如辅助线）或已悬停的扇区
    if (seriesName === 'label-line') {
        return;
    }

    // 2.1 取消之前悬停的扇区
    if (hoveredSeriesIndex != null) {
        const prevHoveredSector = chartOption.series[hoveredSeriesIndex];
        const {pieData} = prevHoveredSector
        prevHoveredSector.parametricEquation = getParametricEquation({
            startRatio:pieData.startRatio,
            endRatio:pieData.endRatio,
            isSelected:pieData.isSelected,
            isHovered:false,// 取消悬停
            ringRatio:pieData.ringRatio,
            pieHeight:pieData.pieHeight,
        });
        pieData.isHovered = false;
    }

    // 2.2 放大当前悬停的扇区
    const targetSector = chartOption.series[seriesIndex];
    const {pieData} = targetSector
    targetSector.parametricEquation = getParametricEquation({
        startRatio:pieData.startRatio,
        endRatio:pieData.endRatio,
        isSelected:pieData.isSelected,
        isHovered:true,// 开启悬停
        ringRatio:pieData.ringRatio,
        pieHeight:pieData.pieHeight,
    });
    pieData.isHovered = true;

    // 2.3 更新悬停索引
    chart.hoveredSeriesIndex = seriesIndex;

    // 2.4 重新渲染图表
    chart.setOption(chartOption);

    return '3D饼图自动放大'
}

// 注册策略并添加元数据
registerSimpleEventHandler('pie3dOver', pie3dOver, '3D饼图、环状图-鼠标进入样式处理');



/**
 * 生成3D扇区的曲面参数方程（核心：控制扇区的形状、选中偏移、悬停放大）
 * @param {Object} config - 配置参数对象
 * @param {number} config.startRatio - 扇区起始占比（0-1，相对于总数值）
 * @param {number} config.endRatio - 扇区结束占比（0-1，相对于总数值）
 * @param {boolean} config.isSelected - 扇区是否选中（选中时向外偏移）
 * @param {boolean} config.isHovered - 扇区是否悬停（悬停时放大）
 * @param {number} config.ringRatio - 环形空心占比（0-1）
 * @param {number} config.sectorHeight - 扇区高度（含悬停偏移）
 * @returns {Object} 曲面参数方程（u/v参数范围 + x/y/z坐标计算）
 */
const getParametricEquation = (config = {}) => {
    const {
        startRatio,
        endRatio,
        isSelected = false,
        isHovered = false,
        ringRatio,
        pieHeight
    } = config
    // 1. 计算扇区的角度（占比转弧度，Math.PI*2=360度）
    const midRatio = (startRatio + endRatio) / 2// 扇区中间占比
    // 将比例转换为弧度
    const startRadian = startRatio * Math.PI * 2// 起始角度（弧度）
    const endRadian = endRatio * Math.PI * 2// 结束角度（弧度）
    const midRadian = midRatio * Math.PI * 2// 中间角度（弧度）

    // 计算偏移量（沿扇区中线方向）
    // 先判断是否为单个扇区，是则直接取消偏移
    let offsetX = 0;
    let offsetY = 0;

    // 2. 特殊处理：如果只有一个扇区，取消选中效果
    if (!(startRatio === 0 && endRatio === 1) && isSelected) {
        offsetX = Math.cos(midRadian) * 0.1;
        offsetY = Math.sin(midRadian) * 0.1;
    }

    // 悬停时的缩放比例
    const hoverScale = isHovered ? 1.05 : 1

    // 返回曲面参数方程（u/v控制曲面生成，x/y/z控制每个点的坐标）
    return {
        // u参数：控制扇区的角度范围（-π 到 3π，覆盖完整360度+冗余，避免缝隙）
        u: { min: -Math.PI, max: Math.PI * 3, step: Math.PI / 32 },
        // v参数：控制扇区的径向（0到2π，生成环形曲面）
        v: { min: 0, max: Math.PI * 2, step: Math.PI / 20 },
        // x坐标：控制水平方向位置
        x: (u, v) => {
            if (u < startRadian) return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * ringRatio) * hoverScale;
            if (u > endRadian) return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * ringRatio) * hoverScale;
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * ringRatio) * hoverScale;
        },
        // y坐标：控制垂直方向位置
        y: (u, v) => {
            if (u < startRadian) return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * ringRatio) * hoverScale;
            if (u > endRadian) return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * ringRatio) * hoverScale;
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * ringRatio) * hoverScale;
        },
        // z坐标：控制3D深度（高度）
        z: (u, v) => {
            const pieZHeight = pieHeight * 0.1
            if (u < -Math.PI * 0.5) return Math.sin(u); // 左侧冗余区域高度
            if (u > Math.PI * 2.5) return Math.sin(u) * pieZHeight; // 右侧冗余区域高度
            return Math.sin(v) > 0 ? pieZHeight : -1; // 核心扇区高度（上半部分高，下半部分低，形成立体）
        }
    }
}
