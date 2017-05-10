# mini.css

> [官网](http://minicss.org/) [github](https://github.com/Chalarangelo/mini.css)

### 概述

体积小，压缩后不到 **7KB**  
**多屏适配** ，不论`PC`还是`mobile`，所有组件都经过不同的设备测试  
风格无关，充分实现 **无限的可定制**  

既不类似`Bootstrap`，功能虽齐全但是  **笨重** ，也不类似`Pure.css`这样的微框架  
miniCSS兼有二者优点，通过在非常小的文件中提供大量的 **模块和组件** 来模糊*全功能*和*微框架*之间的界限  
网格、导航、输入控件、进度，以及一些更复杂的组件（如选项卡）应有尽有

### 安装

`npm`、`yarn`、`bower`、[`cdn`](https://cdnjs.com/libraries/mini.css) …

### 浏览器支持

![Browser support](/src/img/browser.png)

### 模块

#### 核心模块

基于`Normalize.css V5.0.0`重置浏览器差异，删除了一些旧版浏览器支持的规则，和其他调整。
比如字体，mini会检测系统而采用最佳字体等等…