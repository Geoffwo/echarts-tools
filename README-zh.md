# echarts-tools 基础指南

## 🚀 快速开始

### 环境准备
1. 安装 Node.js 14.18+ 
   - [官网下载](https://nodejs.org/)
   - 验证安装：
   
```bash
node -v  # 应显示 v14.18 或更高
npm -v   # 应显示 6.x+
```

### 下载项目
```bash
git clone https://github.com/Geoffwo/echarts-tools.git
git clone https://gitee.com/Geoffwo/echarts-tools.git
cd echarts-tools
```

### 安装依赖
```bash
npm install
```

### 编译项目
```bash
npm run build
```
构建完成后生成：
```
dist/
├── cjs/    # Vue2 项目使用的模块
└── iife/   # HTML 直接引用的脚本
```

---

## 📂 目录结构
```
echarts-tools/
├── dist/           # 构建输出目录（不要手动修改）
├── src/            # 未混淆的源代码
├── page/           # 代码示例
├── config/         # 构建配置文件
│   ├── esbuild.mjs          # ESBuild 配置
│   └── obfuscator.config.js # 混淆配置
├── package.json    # 项目配置
├── README.md    # 项目文档
└── README-zh.md       # 项目文档
```

---

## 🛠️ 使用方法

### Vue2 项目
1. 安装依赖
   ```bash
   npm install echarts-tools echarts@5 --save
   ```

2. 组件中使用
   [vue2Demo.vue](page/vue2Demo.vue)

### HTML 直接使用
[htmlDemo.html](page/htmlDemo.html)

---

## 🔧 常用命令

| 命令                  | 作用                          |
|-----------------------|------------------------------|
| `npm install`         | 安装开发依赖                  |
| `npm run build`       | 编译生产版本（含代码混淆）    |
| `npm run es5build`   | 仅编译不混淆（调试用）        |

---

## ⚠️ 注意事项
1. **必须安装 echarts**  
   项目本身不包含 echarts，需单独安装：
   ```bash
   npm install echarts@5 --save
   ```

2. **代码保护机制**  
   `dist/` 目录中的代码经过混淆：
    - 调试请使用 `npm run es5build` 生成的未混淆版本
    - 混淆配置见 `config/obfuscator.config.js`

3. **浏览器兼容性**  
   IIFE 版本需配合 echarts 5.x 使用，确保引入顺序：
   ```
   <!-- 先引入 echarts -->
   <script src="echarts.min.js"></script>
   <!-- 再引入本库 -->
   <script src="echarts-tools.js"></script>
   ```

---

## 📜 API 文档

### 核心函数

#### `importEcharts(echart, version = 'default', setAsDefault = false)`
注册 ECharts 版本供库使用。

**参数：**
- `echart`: Object - ECharts 库实例
- `version`: String - 版本标识符（默认：'default'）
- `setAsDefault`: Boolean - 是否设为默认版本（默认：false）

**示例：**
```javascript
import { importEcharts } from 'echarts-tools';
import echarts from 'echarts';

// 注册默认版本的 ECharts
importEcharts(echarts);

// 注册多个版本
importEcharts(echartsV5, 'v5', true);
importEcharts(echartsV4, 'v4');
```

#### `createBasicChartInstance(config, version = 'default')`
创建带有事件处理的基本 ECharts 实例。

**参数：**
- `config`: Object - 图表配置
  - `dom`: HTMLElement - 图表的 DOM 元素
  - `option`: Object - ECharts 选项配置
  - `events`: Object - 事件处理程序配置
  - `notMerge`: Boolean - 是否合并选项（默认：true）
  - `theme`: String | Object - ECharts 主题
  - `opts`: Object - 其他选项（默认：{renderer: 'canvas'}）
- `version`: String - 要使用的 ECharts 版本（默认：'default'）

**返回值：**
- Object - ECharts 实例或失败时返回 null

**示例：**
```javascript
import { createBasicChartInstance } from 'echarts-tools';

const myChart = createBasicChartInstance({
  dom: document.getElementById('chart-container'),
  option: {
    xAxis: { type: 'category', data: ['A', 'B', 'C'] },
    yAxis: { type: 'value' },
    series: [{ data: [1, 2, 3], type: 'bar' }]
  },
  events: {
    click: {
      handler: (params, chart, result) => {
        console.log('点击:', result);
      },
      strategy: 'xIndex'
    }
  }
});
```

#### `drawBasicChartFactory(config, version = 'default')`
使用简化配置创建图表的工厂函数。

**参数：**
- `config`: Object - 图表配置
  - `id`: String - DOM 元素 ID
  - `option`: Object - ECharts 选项配置
  - `events`: Object - 事件处理程序配置
- `version`: String - 要使用的 ECharts 版本（默认：'default'）

**返回值：**
- Object - ECharts 实例或失败时返回 null

**示例：**
```javascript
import { drawBasicChartFactory } from 'echarts-tools';

const myChart = drawBasicChartFactory({
  id: 'main',
  option: {
    xAxis: { type: 'category', data: ['A', 'B', 'C'] },
    yAxis: { type: 'value' },
    series: [{ data: [1, 2, 3], type: 'bar' }]
  },
  events: {
    click: 'xIndex' // 使用内置策略
  }
});
```

#### `printDoc()`
在控制台打印 API 文档。

**示例：**
```javascript
import { printDoc } from 'echarts-tools';

printDoc(); // 打印所有可用方法和配置
```

### 策略系统

#### `strategyUtils`
用于管理事件处理策略的工具。

**方法：**
- `get(name)`: 获取指定名称的策略
- `getAll()`: 获取所有注册的策略
- `getAllInfo()`: 获取所有注册的策略及其元数据

#### `registerEventHandler(name, handler, meta = {})`
注册自定义事件处理策略。

**参数：**
- `name`: String - 策略名称
- `handler`: Function - 策略实现
- `meta`: Object - 策略元数据（描述等）

**示例：**
```javascript
import { registerEventHandler } from 'echarts-tools';

registerEventHandler('customStrategy', (params, chart, config) => {
  // 自定义策略实现
  return { customData: 'processed' };
}, { description: '自定义事件处理策略' });
```

#### `registerSimpleEventHandler(name, handler, description)`
`registerEventHandler` 的简化版本，用于基本策略。

**参数：**
- `name`: String - 策略名称
- `handler`: Function - 策略实现
- `description`: String - 策略描述

**示例：**
```javascript
import { registerSimpleEventHandler } from 'echarts-tools';

registerSimpleEventHandler('customStrategy', (params, chart, config) => {
  // 自定义策略实现
  return { customData: 'processed' };
}, '自定义事件处理策略');
```

### 内置策略

#### `xIndex`
从点击坐标提取数据项的 x 轴索引，适用于笛卡尔坐标系（如折线图、柱状图）。

**返回值：**
- Object - { xIndex: Number } 或不在网格内时返回 null

#### `pie3dOver`
3D 饼图、环状图-鼠标进入样式处理。

**返回值：**
- String - '3D饼图自动放大'

#### `pie3dOut`
3D 饼图、环状图-鼠标移出样式处理。

**返回值：**
- String - '3D饼图自动恢复'

### 事件配置

事件可以通过三种方式配置：

1. **字符串语法**（使用内置策略）：
```javascript
events: {
  click: 'xIndex'
}
```

2. **函数语法**（自定义处理程序）：
```javascript
events: {
  click: (params, chart) => {
    console.log('点击:', params);
  }
}
```

3. **对象语法**（策略 + 自定义处理程序）：
```javascript
events: {
  click: {
    handler: (params, chart, result) => {
      console.log('点击:', result);
    },
    strategy: 'xIndex',
    config: {}, // 策略的自定义配置
    handlerType: 'zrender' // 事件系统: 'echarts' 或 'zrender'
  }
}
```

### 在代码中查看 API 文档：
```javascript
import { printDoc } from 'echarts-tools';
printDoc(); // 打印所有可用方法和配置
```

## � 教程与最佳实践

### 入门指南

#### 步骤 1: 安装
```bash
# 安装 echarts-tools 和 echarts
npm install echarts-tools echarts@5 --save
```

#### 步骤 2: 基本设置
```javascript
// 在主入口文件中（例如 main.js）
import { importEcharts } from 'echarts-tools';
import echarts from 'echarts';

// 注册 ECharts
importEcharts(echarts);
```

#### 步骤 3: 创建第一个图表
```javascript
// 在组件中
import { drawBasicChartFactory } from 'echarts-tools';

export default {
  mounted() {
    this.$nextTick(() => {
      this.createChart();
    });
  },
  methods: {
    createChart() {
      const chart = drawBasicChartFactory({
        id: 'chart-container',
        option: {
          xAxis: { type: 'category', data: ['A', 'B', 'C'] },
          yAxis: { type: 'value' },
          series: [{ data: [1, 2, 3], type: 'bar' }]
        }
      });
    }
  }
};
```

### 高级用法

#### 自定义事件策略

创建并注册自定义事件处理策略：

```javascript
import { registerSimpleEventHandler } from 'echarts-tools';

// 注册自定义策略
registerSimpleEventHandler('customClick', (params, chart, config) => {
  // 自定义逻辑
  return {
    seriesIndex: params.seriesIndex,
    dataIndex: params.dataIndex,
    value: params.value
  };
}, '自定义点击事件处理');

// 使用自定义策略
const chart = drawBasicChartFactory({
  id: 'chart-container',
  option: chartOption,
  events: {
    click: {
      handler: (params, chart, result) => {
        console.log('自定义点击结果:', result);
      },
      strategy: 'customClick'
    }
  }
});
```

#### 多版本 ECharts 管理

在同一应用中管理多个 ECharts 版本：

```javascript
import { importEcharts, drawBasicChartFactory } from 'echarts-tools';
import echartsV5 from 'echarts';
import echartsV4 from 'echarts/dist/echarts4.min.js';

// 注册两个版本
importEcharts(echartsV5, 'v5', true); // 设置为默认版本
importEcharts(echartsV4, 'v4');

// 使用默认版本（v5）
const chart1 = drawBasicChartFactory({
  id: 'chart1',
  option: option1
});

// 使用特定版本（v4）
const chart2 = drawBasicChartFactory({
  id: 'chart2',
  option: option2
}, 'v4');
```

### 最佳实践

#### 1. 性能优化

- **延迟初始化**：仅在图表可见时创建
- **防抖 resize**：限制 resize 事件频率，避免频繁重绘
- **数据精简**：限制数据点数量以提高渲染性能
- **销毁图表**：组件卸载时正确销毁图表实例

```javascript
// 示例：防抖 resize 处理
import { debounce } from 'lodash';

export default {
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.createChart();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    createChart() {
      this.chart = drawBasicChartFactory({/* 配置 */});
    },
    handleResize: debounce(function() {
      if (this.chart) {
        this.chart.resize();
      }
    }, 250)
  }
};
```

#### 2. 代码组织

- **分离配置**：将图表配置放在单独的文件或方法中
- **可重用策略**：创建通用事件策略以保持行为一致
- **主题管理**：使用 ECharts 主题确保样式一致

#### 3. 错误处理

- **验证输入**：检查有效的 DOM 元素和数据
- **捕获错误**：将图表创建包装在 try-catch 块中
- **回退选项**：数据缺失时提供默认选项

```javascript
// 示例：安全的图表创建
try {
  const chart = drawBasicChartFactory({
    id: 'chart-container',
    option: chartOption || {
      // 回退选项
      title: { text: '暂无数据' },
      series: []
    }
  });
} catch (error) {
  console.error('图表创建失败:', error);
}
```

#### 4. 可访问性

- **键盘导航**：确保图表可以通过键盘导航
- **屏幕阅读器支持**：添加适当的 aria 标签
- **颜色对比度**：使用可访问的配色方案

### 常见用例

#### 实时数据更新

```javascript
// 示例：实时数据图表
export default {
  data() {
    return {
      chart: null,
      data: [10, 20, 30, 40, 50]
    };
  },
  mounted() {
    this.createChart();
    this.startRealTimeUpdates();
  },
  methods: {
    createChart() {
      this.chart = drawBasicChartFactory({
        id: 'realtime-chart',
        option: this.getChartOption()
      });
    },
    getChartOption() {
      return {
        xAxis: { type: 'category', data: ['1s', '2s', '3s', '4s', '5s'] },
        yAxis: { type: 'value' },
        series: [{ data: this.data, type: 'line' }]
      };
    },
    startRealTimeUpdates() {
      setInterval(() => {
        // 更新数据
        this.data.shift();
        this.data.push(Math.random() * 100);
        
        // 更新图表
        if (this.chart) {
          this.chart.setOption(this.getChartOption());
        }
      }, 1000);
    }
  }
};
```

#### 多图表联动

```javascript
// 示例：联动图表
const chart1 = drawBasicChartFactory({
  id: 'chart1',
  option: option1,
  events: {
    click: {
      handler: (params, chart, result) => {
        // 根据 chart1 的选择更新 chart2
        updateChart2(result.xIndex);
      },
      strategy: 'xIndex'
    }
  }
});

function updateChart2(index) {
  // 根据选中索引更新 chart2 的逻辑
}
```

## �💖 支持项目

如果本项目对您有帮助，欢迎打赏支持作者持续维护：
- 🚀 任意金额 - 对作者的支持
- ☕ 5 元 - 请作者喝杯咖啡
- 📚 10 元 - 帮助文档改进

| 支付宝                             | 微信支付                            |
|---------------------------------|-----------------------------------|
| ![alipay](assets/alipay-qr.jpg) | ![wechat](assets/wechat-qr.jpg)   |

### 打赏性质说明
1. 所有打赏行为属于自愿赠与
2. 打赏金额不包含任何服务对价
3. 打赏后不产生任何义务关系
4. 未成年人请在监护人指导下操作

## 技术咨询
技术咨询请联系：<wangguoxv@163.com>