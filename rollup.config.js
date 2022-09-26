import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";

export default {
  input: "src/index.ts", // 打包入口
  output: {
    // 打包出口
    file: "dist/index.js",
    format: "umd", // umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
    name: "test", // cdn方式引入时挂载在window上面用的就是这个名字
    sourcemap: true,
  },
  plugins: [
    // 打包插件
    resolve(), // 查找和打包node_modules中的第三方模块
    commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    typescript(), // 解析TypeScript
    babel({ babelHelpers: "bundled" }), // babel配置,编译es6
  ],
};
