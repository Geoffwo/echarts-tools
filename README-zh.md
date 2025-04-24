# echarts-tools

简化 ECharts 在 Vue2、html 中使用的工具库（基于 echarts 5+）

## 安装
```bash
npm install echarts-tools echarts --save
```

## 项目结构
```
echarts-tools/
├── src/                           # 源代码目录 未开放
├── dist/                          # 输出目录（混淆后的代码）
│   ├── cjs/             # Vue2
│   │   └── index.js     
│   └── iife/            # html
│       └── index.js                        
└── package.json
```

## 查看文档

```javascript
import { printDoc } from 'echarts-tools';

// 查看文档
printDoc();
```

## 特性

- 支持快捷事件策略（如 `xIndex`）
- 提供工厂函数自动生成图表
- 内置事件处理策略系统

## 策略文档

通过 `printDoc()` 查看完整策略列表，或查看源码注释。

## 代码保护说明

本项目通过代码混淆技术保护核心逻辑，原始源代码可在 https://github.com/Geoffwo/echarts-tools.git 查看。混淆行为符合 ISC 许可证条款。
