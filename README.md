# echarts-tools

A utility library simplifying ECharts usage in Vue2 (based on echarts 5+)

## Installation
```bash
npm install echarts-tools echarts --save
```

## Project Structure
```
echarts-tools/
├── src/                           # Source code directory (not open)
├── dist/                          # Output directory (obfuscated code)
└── package.json
```

## View Documentation

```javascript
import { printDoc } from 'echarts-tools';

// View documentation
printDoc();
```

## Features

• Supports shortcut event strategies (e.g., `xIndex`)
• Provides factory functions for automatic chart generation
• Built-in event handling strategy system

## Strategy Documentation

Use `printDoc()` to view the full list of strategies, or refer to source code comments.

## Code Protection Notice

This project protects core logic through code obfuscation techniques. The original source code can be viewed in the /src directory. Obfuscation implementation is compliant with the ISC License terms.
