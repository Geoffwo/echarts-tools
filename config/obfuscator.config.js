//npm install --save-dev javascript-obfuscator
//代码混淆
// obfuscator.config.js
module.exports = {
  // ================= 核心防御配置 =================
  unicodeEscapeSequence: false,  // 完全禁用所有 Unicode 转义符（如 \x20）
  stringArray: false,            // 关闭字符串数组加密（避免间接生成转义符）
  stringArrayEncoding: [],    // 禁用字符串编码（base64/rc4）
  splitStrings: false,           // 禁止拆分字符串（如 "a b" -> "a"+ "b"）
  transformObjectKeys: false,    // 禁止转换对象键名

  // ================= 辅助优化配置 =================
  compact: false,                 // 压缩代码（不影响符号）
  identifierNamesGenerator: 'mangled', // 变量名混淆为 a,b,c
  renameGlobals: true,          // 保留全局变量（确保 Vue 兼容性）
  ignoreRequireImports: true,    // 保留模块导入名称（如 import * as echarts）
  controlFlowFlattening: false,      // 关闭控制流平坦化
  deadCodeInjection: true,          // 关闭僵尸代码注入
  disableConsoleOutput: false,       // 保留 console 输出

  comments: /License|Copyright|@license|@preserve/i,// 保留许可证和版权注释
  // reservedStrings: [/./],      // 保护所有字符串内容（通配符）
  reservedNames: [ //导出函数名不被混淆
    '^createBasicChartInstance$',
    '^drawBasicChartFactory$',
    '^printDoc$',
    '^registerEventHandler$',
    '^registerSimpleEventHandler$',
    '^importEcharts$',
    '^echartsTools$' // 保留全局变量名
  ]
}
