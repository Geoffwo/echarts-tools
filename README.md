# echarts-tools Basic Guide

## 🚀 Quick Start

### Environment Setup
1. Install Node.js 14.18+ 
   - [Official Download](https://nodejs.org/)
   - Verify installation:
     ```bash
     node -v  # Should display v14.18 or higher
     npm -v   # Should display 6.x+
     ```

### Clone Project
```bash
git clone https://github.com/Geoffwo/echarts-tools.git
Or use China mirror:
git clone https://gitee.com/Geoffwo/echarts-tools.git
cd echarts-tools
```

### Install Dependencies
```bash
npm install
```

### Build Project
```bash
npm run build
```
After building, you'll get:
```
dist/
├── cjs/    # For Vue2 projects
└── iife/   # For direct HTML usage
```

---

## 📂 Directory Structure
```
echarts-tools/
├── dist/           # Build output (DO NOT modify manually)
├── src/            # Source code (unobfuscated)
├── page/           # Code examples
├── config/         # Build configurations
│   ├── esbuild.mjs          # ESBuild config
│   └── obfuscator.config.js # Obfuscation config
├── package.json    # Project config
├── README.md       # Documentation (English)
└── README-zh.md    # Documentation (Chinese)
```

---

## 🛠️ Usage

### For Vue2 Projects
1. Install dependencies
   ```bash
   npm install echarts-tools echarts@5 --save
   ```

2. Component usage example:  
   [vue2Demo.vue](page/vue2Demo.vue)

### For HTML Direct Usage
Example:  
[htmlDemo.html](page/htmlDemo.html)

---

## 🔧 Common Commands

| Command             | Description                      |
|----------------------|----------------------------------|
| `npm install`        | Install development dependencies |
| `npm run build`      | Build production version (with obfuscation) |
| `npm run es5build`  | Build without obfuscation (for debugging) |

---

## ⚠️ Important Notes
1. **echarts Peer Dependency**  
   This library requires echarts 5+:
   ```bash
   npm install echarts@5 --save
   ```

2. **Code Protection**  
   Files in `dist/` are obfuscated:
    - Use `npm run es5build` for unobfuscated debug builds
    - Obfuscation config: `config/obfuscator.config.js`

3. **Browser Compatibility**  
   IIFE version requirements:
   ```
   <!-- Load echarts first -->
   <script src="echarts.min.js"></script>
   <!-- Then load this library -->
   <script src="echarts-tools.js"></script>
   ```

---

## 📜 API Documentation

### Core Functions

#### `importEcharts(echart, version = 'default', setAsDefault = false)`
Registers an ECharts version for use with the library.

**Parameters:**
- `echart`: Object - ECharts library instance
- `version`: String - Version identifier (default: 'default')
- `setAsDefault`: Boolean - Whether to set as default version (default: false)

**Example:**
```javascript
import { importEcharts } from 'echarts-tools';
import echarts from 'echarts';

// Register ECharts with default version
importEcharts(echarts);

// Register multiple versions
importEcharts(echartsV5, 'v5', true);
importEcharts(echartsV4, 'v4');
```

#### `createBasicChartInstance(config, version = 'default')`
Creates a basic ECharts instance with event handling.

**Parameters:**
- `config`: Object - Chart configuration
  - `dom`: HTMLElement - DOM element for chart
  - `option`: Object - ECharts option configuration
  - `events`: Object - Event handlers configuration
  - `notMerge`: Boolean - Whether to merge options (default: true)
  - `theme`: String | Object - ECharts theme
  - `opts`: Object - Additional options (default: {renderer: 'canvas'})
- `version`: String - ECharts version to use (default: 'default')

**Returns:**
- Object - ECharts instance or null if failed

**Example:**
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
        console.log('Clicked:', result);
      },
      strategy: 'xIndex'
    }
  }
});
```

#### `drawBasicChartFactory(config, version = 'default')`
Factory function for creating charts with simplified configuration.

**Parameters:**
- `config`: Object - Chart configuration
  - `id`: String - DOM element ID
  - `option`: Object - ECharts option configuration
  - `events`: Object - Event handlers configuration
- `version`: String - ECharts version to use (default: 'default')

**Returns:**
- Object - ECharts instance or null if failed

**Example:**
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
    click: 'xIndex' // Use built-in strategy
  }
});
```

#### `printDoc()`
Prints API documentation to the console.

**Example:**
```javascript
import { printDoc } from 'echarts-tools';

printDoc(); // Prints all available methods and configs
```

### Strategy System

#### `strategyUtils`
Utility for managing event handling strategies.

**Methods:**
- `get(name)`: Gets a specific strategy by name
- `getAll()`: Gets all registered strategies
- `getAllInfo()`: Gets all registered strategies with metadata

#### `registerEventHandler(name, handler, meta = {})`
Registers a custom event handling strategy.

**Parameters:**
- `name`: String - Strategy name
- `handler`: Function - Strategy implementation
- `meta`: Object - Strategy metadata (description, etc.)

**Example:**
```javascript
import { registerEventHandler } from 'echarts-tools';

registerEventHandler('customStrategy', (params, chart, config) => {
  // Custom strategy implementation
  return { customData: 'processed' };
}, { description: 'Custom event handling strategy' });
```

#### `registerSimpleEventHandler(name, handler, description)`
Simplified version of `registerEventHandler` for basic strategies.

**Parameters:**
- `name`: String - Strategy name
- `handler`: Function - Strategy implementation
- `description`: String - Strategy description

**Example:**
```javascript
import { registerSimpleEventHandler } from 'echarts-tools';

registerSimpleEventHandler('customStrategy', (params, chart, config) => {
  // Custom strategy implementation
  return { customData: 'processed' };
}, 'Custom event handling strategy');
```

### Built-in Strategies

#### `xIndex`
Extracts x-axis index from click coordinates, suitable for Cartesian coordinate systems (e.g., line charts, bar charts).

**Returns:**
- Object - { xIndex: Number } or null if not in grid

#### `pie3dOver`
Handles mouse enter style for 3D pie charts and ring charts.

**Returns:**
- String - '3D饼图自动放大'

#### `pie3dOut`
Handles mouse leave style for 3D pie charts and ring charts.

**Returns:**
- String - '3D饼图自动恢复'

### Event Configuration

Events can be configured in three ways:

1. **String syntax** (use built-in strategy):
```javascript
events: {
  click: 'xIndex'
}
```

2. **Function syntax** (custom handler):
```javascript
events: {
  click: (params, chart) => {
    console.log('Clicked:', params);
  }
}
```

3. **Object syntax** (strategy + custom handler):
```javascript
events: {
  click: {
    handler: (params, chart, result) => {
      console.log('Clicked:', result);
    },
    strategy: 'xIndex',
    config: {}, // Custom config for strategy
    handlerType: 'zrender' // Event system: 'echarts' or 'zrender'
  }
}
```

### Access API docs programmatically:
```javascript
import { printDoc } from 'echarts-tools';
printDoc(); // Prints all available methods and configs
```

## � Tutorials & Best Practices

### Getting Started Guide

#### Step 1: Installation
```bash
# Install echarts-tools and echarts
npm install echarts-tools echarts@5 --save
```

#### Step 2: Basic Setup
```javascript
// In your main entry file (e.g., main.js)
import { importEcharts } from 'echarts-tools';
import echarts from 'echarts';

// Register ECharts
importEcharts(echarts);
```

#### Step 3: Create Your First Chart
```javascript
// In your component
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

### Advanced Usage

#### Custom Event Strategies

Create and register custom event handling strategies:

```javascript
import { registerSimpleEventHandler } from 'echarts-tools';

// Register a custom strategy
registerSimpleEventHandler('customClick', (params, chart, config) => {
  // Custom logic here
  return {
    seriesIndex: params.seriesIndex,
    dataIndex: params.dataIndex,
    value: params.value
  };
}, 'Custom click event handler');

// Use the custom strategy
const chart = drawBasicChartFactory({
  id: 'chart-container',
  option: chartOption,
  events: {
    click: {
      handler: (params, chart, result) => {
        console.log('Custom click result:', result);
      },
      strategy: 'customClick'
    }
  }
});
```

#### Multiple ECharts Versions

Manage multiple ECharts versions in the same application:

```javascript
import { importEcharts, drawBasicChartFactory } from 'echarts-tools';
import echartsV5 from 'echarts';
import echartsV4 from 'echarts/dist/echarts4.min.js';

// Register both versions
importEcharts(echartsV5, 'v5', true); // Set as default
importEcharts(echartsV4, 'v4');

// Use default version (v5)
const chart1 = drawBasicChartFactory({
  id: 'chart1',
  option: option1
});

// Use specific version (v4)
const chart2 = drawBasicChartFactory({
  id: 'chart2',
  option: option2
}, 'v4');
```

### Best Practices

#### 1. Performance Optimization

- **Lazy Initialization**: Create charts only when they're visible
- **Debounce Resize**: Throttle resize events to avoid frequent redraws
- **Data Reduction**: Limit data points for better rendering performance
- **Destroy Charts**: Properly destroy charts when components are unmounted

```javascript
// Example: Debounced resize handler
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
      this.chart = drawBasicChartFactory({/* config */});
    },
    handleResize: debounce(function() {
      if (this.chart) {
        this.chart.resize();
      }
    }, 250)
  }
};
```

#### 2. Code Organization

- **Separate Configuration**: Keep chart options in separate files or methods
- **Reusable Strategies**: Create common event strategies for consistent behavior
- **Theme Management**: Use ECharts themes for consistent styling

#### 3. Error Handling

- **Validate Inputs**: Check for valid DOM elements and data
- **Catch Errors**: Wrap chart creation in try-catch blocks
- **Fallback Options**: Provide default options when data is missing

```javascript
// Example: Safe chart creation
try {
  const chart = drawBasicChartFactory({
    id: 'chart-container',
    option: chartOption || {
      // Fallback option
      title: { text: 'No Data Available' },
      series: []
    }
  });
} catch (error) {
  console.error('Chart creation failed:', error);
}
```

#### 4. Accessibility

- **Keyboard Navigation**: Ensure charts can be navigated with keyboards
- **Screen Reader Support**: Add appropriate aria labels
- **Color Contrast**: Use accessible color schemes

### Common Use Cases

#### Real-time Data Updates

```javascript
// Example: Real-time data chart
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
        // Update data
        this.data.shift();
        this.data.push(Math.random() * 100);
        
        // Update chart
        if (this.chart) {
          this.chart.setOption(this.getChartOption());
        }
      }, 1000);
    }
  }
};
```

#### Multi-chart Coordination

```javascript
// Example: Linked charts
const chart1 = drawBasicChartFactory({
  id: 'chart1',
  option: option1,
  events: {
    click: {
      handler: (params, chart, result) => {
        // Update chart2 based on selection in chart1
        updateChart2(result.xIndex);
      },
      strategy: 'xIndex'
    }
  }
});

function updateChart2(index) {
  // Logic to update chart2 based on selected index
}
```

## �💖  Project Support

If this project helps you, consider supporting maintenance:

• 🚀 Any amount - General support

• ☕ 5 CNY - Buy me a coffee

• 📚 10 CNY - Documentation improvements


| Alipay                             | WeChat Pay                          |
|----------------------------------|-------------------------------------|
| ![alipay](assets/alipay-qr.jpg)  | ![wechat](assets/wechat-qr.jpg)     |

### Donation Terms
1. All donations are voluntary gifts
2. No services or obligations are implied
3. No contractual relationship established
4. Minors must obtain guardian consent

## Technical Support

Contact: <wangguoxv@163.com>

