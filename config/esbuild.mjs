/**************************** 引入依赖模块 ****************************/
import esbuild from 'esbuild';      // ESBuild 核心库 - 用于高性能打包
import { transform } from '@babel/core';  // Babel 转换器 - 用于ES6+语法降级
import * as fs from 'fs';          // 文件系统模块 - 用于读取源文件

/**************************** Babel 插件配置 ****************************/
/**
 * 自定义Babel插件：拦截.js文件加载请求，进行ES5语法转换
 * 解决ESBuild原生转换可能不彻底的问题
 */
const babelPlugin = {
  name: 'babel',  // 插件标识
  setup(build) {
    // 文件加载拦截器：处理所有.js文件
    build.onLoad({ filter: /\.js$/ }, async (args) => {
      const code = await fs.promises.readFile(args.path, 'utf8'); // 读取源文件

      // 使用Babel进行深度语法转换（比ESBuild更严格的ES5兼容）
      const result = await transform(code, {
        filename: args.path,       // 保留源文件路径信息
        presets: ['@babel/preset-env']  // 使用env预设智能转换ES6+语法
      });

      return { contents: result.code }; // 返回转换后的ES5代码
    });
  }
};

/**************************** 双格式构建逻辑 ****************************/
// 通用基础配置
const baseConfig = {
  entryPoints: ['src/index.js'],  // 入口文件 - 从组件库主入口开始打包
  bundle: true,         // 打包依赖 - 将依赖树合并为单个文件
  target: 'es5',        // 目标环境 - 兼容IE11等旧浏览器
  minify: false,        // 压缩代码 - 测试阶段关闭，正式发布可启用
  sourcemap: false,     // SourceMap - 调试时建议开启
  plugins: [babelPlugin], // 加载插件 - 应用Babel转换
  loader: { '.js': 'jsx' }// ▲ 强制JSX解析器 - 处理特殊JS语法兼容（处理React语法） ▲
};

// 并行构建两种格式
Promise.all([
  // IIFE 格式（HTML 直接使用）
  esbuild.build({
    ...baseConfig,
    format: 'iife',// 改为立即执行函数表达式 兼容html
    globalName: 'echartsTools', // 定义全局变量名称
    outdir: 'dist/iife'         // 输出到独立目录
  }),

  // CJS 格式（Vue2 项目）
  esbuild.build({
    ...baseConfig,
    format: 'cjs', // ▲ 输出格式改为CommonJS - 解决模块导出兼容性问题（Node.js模块系统） ▲ 兼容vue2
    outdir: 'dist/cjs'          // 输出到独立目录
  })
]).catch(() => process.exit(1));