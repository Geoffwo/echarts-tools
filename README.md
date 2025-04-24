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
   ```html
   <!-- Load echarts first -->
   <script src="echarts.min.js"></script>
   <!-- Then load this library -->
   <script src="echarts-tools.js"></script>
   ```

---

## 📜 View Documentation
Access API docs programmatically:
```javascript
import { printDoc } from 'echarts-tools';
printDoc(); // Prints all available methods and configs
```

