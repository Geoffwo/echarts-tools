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

## 📜 查看文档
在代码中查看 API 文档：
```javascript
import { printDoc } from 'echarts-tools';
printDoc(); // 打印所有可用方法和配置
```

## 💖 支持项目

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