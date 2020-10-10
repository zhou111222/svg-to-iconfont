# secoo-iconfont-common
SVG生成字体包，并生成css 样式引用,使用方式见[secoo-iconfont-common使用教程](https://www.secoo.com/appActivity/secoo-icon-font.shtml)
# 前言

此项目收集了secoo日常使用的icon。生成对应的icon-font。供大家使用。

## 技术栈

gulp-iconfont + gulp-iconfont-css + gulp-template


## 项目运行

```
// 初始化
npm install --save-dev   
// 默认打包(每个icon分开打包，最终生成文件在build文件夹)
gulp 
// 合并打包(每个icon合并打包，最终生成文件在finally文件夹)
gulp merge
```