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
        filename: args.path,       // 保留文件名信息
        presets: ['@babel/preset-env']  // 使用env预设智能转换
      });

      return { contents: result.code }; // 返回转换后代码
    });
  }
};

/**************************** 执行构建任务 ****************************/
esbuild.build({
  entryPoints: ['src/index.js'],  // 入口文件 - 从组件库主入口开始打包
  bundle: true,         // 打包依赖 - 将依赖树合并为单个文件
  outdir: 'dist',       // 输出目录 - 生成到dist文件夹
  target: 'es5',        // 目标环境 - 兼容IE11等旧浏览器
  format: 'cjs',       // ▲ 输出格式改为CommonJS - 解决模块导出兼容性问题 ▲
  minify: false,        // 压缩代码 - 测试阶段关闭，正式发布可启用
  sourcemap: false,     // SourceMap - 调试时建议开启
  loader: {
    '.js': 'jsx' // ▲ 强制JSX解析器 - 处理特殊JS语法兼容 ▲
  },
  plugins: [babelPlugin] // 加载插件 - 应用Babel转换
}).catch(() => process.exit(1));  // 异常处理 - 构建失败时终止进程