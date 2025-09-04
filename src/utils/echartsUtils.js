/*! @license echarts-tools echartsUtils.js
 * Copyright (c) 2025 geoffwo
 * This source code is licensed under the ISC license
 */
import {strategyUtils} from './strategyUtils.js'
const handlerStrategies = strategyUtils.getAll()
let echarts = null
// -------------------------- Echarts生成函数 --------------------------
function importEcharts(echart){
  if (echart) {
    echarts = echart
  }
}
/**
 * 实例化Echarts
 * @param {Object} config
 */
function createBasicChartInstance(config) {
  //只解构出需要的部分
  const { dom, option = {}, events = null, notMerge = true, theme = null, opts = {renderer: 'canvas'} } = config || {};

  if (!(dom instanceof HTMLElement)) {
    console.warn(`Invalid DOM element`)
    return; // 中断函数执行
  }

  try {
    const myChart = echarts.init(dom, theme, opts);
    myChart.setOption(option, notMerge);

    // -------------------------- 事件绑定核心逻辑 --------------------------
    if (events) {
      const eventListeners = [];

      Object.entries(events).forEach(([eventName, eventConfig]) => {
        // 1. 解析事件配置
        const { handler, strategy, config, handlerType } = parseEventConfig(eventConfig);

        // 2. 生成事件处理器
        const wrappedHandler = createEventHandler({ handler, strategy, config });

        // 3. 绑定到对应事件系统
        bindChartEvent(myChart, eventName, wrappedHandler, handlerType);
      });
    }

    return myChart;
  } catch (error) {
    console.error('ECharts init failed:', error);
    return null;
  }
}

/**
 * 创建图表实例（带类型校验） Echarts工厂
 * @param {Object} config
 * @param {Object} context - 组件上下文
 */
function drawBasicChartFactory(config, context) {
  //只解构出需要的部分
  const {data=[],id='',optionFuc=()=>{},option={} } = config


  const dom = document.getElementById(id);
  if (!dom) {
    console.warn(`DOM #${id} not found`)
    return; // 中断函数执行
  }

  const finalOption = optionFuc(data, context) || option;
  if (!finalOption) {
    console.warn('Invalid ECharts option')
    return; // 中断函数执行
  }

  return createBasicChartInstance({...config,dom, option:finalOption });
}

// -------------------------- 事件处理工具函数 --------------------------

/**
* 解析事件配置，返回标准化结构
*/
function parseEventConfig(eventConfig) {
  // 快捷模式（字符串语法，如 'xIndex'）
  if (typeof eventConfig === 'string') {
    return {
      strategy: eventConfig
    };
  }

  // 原始模式（函数语法，如 (params, chart) => {}）
  if (typeof eventConfig === 'function') {
    return {
      handler: eventConfig
    };
  }

  // 混合模式（对象语法）
  if (eventConfig && typeof eventConfig === 'object') {
    return {
      handler: eventConfig.handler,
      strategy: eventConfig.strategy,
      config: eventConfig.config,
      handlerType: eventConfig.handlerType
    };
  }

  // 无效配置
  console.warn('Invalid event config:', eventConfig);
  return {};
}

/**
* 创建事件处理器闭包
*/
function createEventHandler({ handler, strategy, config }) {
  return (params, myChart) => {
    try {
      let strategyResult;
      // 执行策略逻辑
      if (strategy && handlerStrategies[strategy]) {
        strategyResult = handlerStrategies[strategy](params, myChart, config);
      }

      // 分发处理逻辑
      if(handler){
        // 混合模式 或 原始模式
        handler(params, myChart, strategyResult);
      }else{
        // 日志模式
        console.log('Auto handle:', strategyResult);
      }
    } catch (err) {
      console.error(`Event error:`, err);
    }
  };
}

/**
* 绑定到 ECharts/ZRender 事件系统 默认ZRender
*/
function bindChartEvent(chart, eventName, handler, handlerType = 'zrender') {
  const listener = params => handler(params, chart);

  if (handlerType === 'echarts') {
    chart.on(eventName, listener);
  } else if (handlerType === 'zrender') {
    chart.getZr().on(eventName, listener);
  } else {
    console.warn(`Unknown handlerType: ${handlerType}, event ${eventName} skipped`);
  }
}

// -------------------------- 文档生成函数 --------------------------
function printDoc() {
  printBasicChartInstanceDoc()
  printBasicChartFactoryDoc()
  printStrategyDoc()
};//print

function printBasicChartInstanceDoc() {
  const docContent = {
    title: 'ECharts 基础方法案例',
    basicMode: `
const chartInstance = createBasicChartInstance({
  dom: document.getElementById('chart-container'),
  data: yourData,
  option: yourOption,
  events: {
    click: 'xIndex'
  }
});`,

    intactMode: `
createBasicChartInstance({
  dom: document.getElementById('chart-container'),
  data: yourData,
  option: yourOption,
  events: {
    mousemove: {
      handler:(params, chart, result) => {
        console.log(result);
      },
      strategy: 'xIndex',
      config:{},//通常用于自定义配置
      //echarts==>chart.on()
      //zrender==>chart.getZr().on()
      handlerType: 'zrender'
    }
  },
  notMerge: true,
  theme: null,
  opts: {renderer: 'canvas'}
});`
  };

  console.log(`\n${docContent.title}:`);
  console.log(`\n1. 基础案例:\n   ${docContent.basicMode}`);
  console.log(`\n2. 完整案例:\n   ${docContent.intactMode}`);
};//print
/**
 * 打印 ECharts 工具库的文档信息
 */
function printBasicChartFactoryDoc() {
  const docContent = {
    title: 'ECharts 工厂方法案例',
    quickMode: `
drawBasicChartFactory({
  data:[],
  id: 'main',
  optionFuc:getOptions01,
  events:{
    click:'xIndex'
  }
},this)`,

    rawMode: `
drawBasicChartFactory({
  data:[],
  id: 'main',
  optionFuc:getOptions01,
  events:{
    click:(params, chart) => {
      console.log(params, chart);
    }
  }
},this)`,

    hybridMode: `
drawBasicChartFactory({
  data:[],
  id: 'main',
  optionFuc:getOptions01,
  events:{
    click:{
      handler:(params, chart, result) => {
        console.log(result);
      },
      strategy: 'xIndex'
    }
  }
},this)`,
    sampleMode: `
drawBasicChartFactory({
  id: 'main',
  option:getOptions01(data,_this)
},this)`
  };

  console.log(`\n${docContent.title}:`);
  console.log(`\n1. 快捷模式（事件:字符串语法）:\n   ${docContent.quickMode}`);
  console.log(`\n2. 原始模式（事件:函数语法）:\n   ${docContent.rawMode}`);
  console.log(`\n3. 混合模式（事件:对象语法）:\n   ${docContent.hybridMode}`);
  console.log(`\n4. 简单模式（配置:直接接受option）:\n   ${docContent.sampleMode}`);
};//print

/**
 * 打印 策略列表的信息
 */
function printStrategyDoc() {
  const allInfo = strategyUtils.getAllInfo();
  const docContent = `
registerSimpleEventHandler(
  '策略名称',
  (params, myChart,config)=>{//策略方法
    console.log(params, myChart, config);
  },
  '策略描述'
);`;

  console.log(`\n自定义注册策略方法:\n   ${docContent}`);
  console.log('\n内置策略列表信息:');
  Object.entries(allInfo).forEach(([key, info]) => {
    console.log(`\n${key} ${info.description}`);
  })
};//print

export {
  printDoc,
  createBasicChartInstance,
  drawBasicChartFactory,
  importEcharts
}


