# FormatHub: 强大的 JSON/YAML 格式化与树形结构查看工具

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/muzihuaner/json/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/muzihuaner/json?style=social)](https://github.com/muzihuaner/json)

## 📖 项目简介

**FormatHub** 是一个专为开发者设计的高效 JSON/YAML 数据处理工具。它提供了一个直观的界面，允许用户快速粘贴、格式化、压缩和查看结构化数据，极大地提升了处理配置、API 响应或日志文件的效率。

无论是需要将单行 JSON 美化、将 YAML 转换为 JSON，还是通过交互式树形结构快速定位数据，FormatHub 都是您的理想选择。

## ✨ 主要功能

* **双向格式化 (Format)：** 支持将 JSON 或 YAML 数据格式化为易于阅读的带缩进结构。
* **交互式树形视图 (Tree View)：** 格式化后的数据可以切换到树形结构视图，支持节点的**折叠和展开**，方便快速浏览和定位深层嵌套数据。
* **数据压缩 (Compress)：** 一键将格式化数据转换为紧凑、无空格的单行 JSON。
* **多语言支持：** 同时支持 JSON 和 YAML 格式的解析与转换。
* **代码高亮：** 输出代码视图提供语法高亮，增强可读性。
* **数据持久化：** 输入内容自动保存至本地浏览器存储（Local Storage），避免意外丢失。
* **文件操作：** 支持一键复制输出内容和下载文件。

## 🚀 快速使用

### 步骤 1: 输入数据
在左侧的 "Input" 文本区域中粘贴您的 JSON 或 YAML 字符串。

### 步骤 2: 选择操作
根据您的需求，点击顶部的功能按钮：

* **JSON 格式化：** 将输入内容转换为标准 JSON 格式并美化。
* **YAML 格式化：** 将输入内容转换为标准 YAML 格式并美化。
* **压缩：** 将格式化后的数据压缩为单行 JSON。

### 步骤 3: 查看结果
结果将显示在右侧的输出面板：
* **代码视图：** 显示带高亮的格式化代码。
* **树形视图：** 提供可折叠的层级结构展示。

## 🛠️ 技术栈

本项目基于 Web 标准技术构建，确保了良好的跨浏览器兼容性和性能：

* **前端框架：** Tailwind CSS (用于快速布局和美化)
* **核心功能：** JavaScript (原生逻辑实现格式化、压缩、树形构建)
* **解析库：**
    * `js-yaml` (用于 YAML 的解析和序列化)
    * `highlight.js` (用于代码高亮显示)

## 🔗 GitHub 仓库

本项目开源，欢迎提交 Issue、Pull Request 或 Star 支持！

**项目地址：**
[https://github.com/muzihuaner/json](https://github.com/muzihuaner/json)
