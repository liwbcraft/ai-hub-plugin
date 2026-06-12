# AI Hub Manager Plugin (AI 助手聚合插件)

[中文](#中文) | [English](#english)

---

## 中文

![Obsidian 插件](https://img.shields.io/badge/Obsidian-Plugin-purple) ![版本](https://img.shields.io/badge/version-1.0.0-blue)

### 📖 简介

AI Hub Manager 是一个 Obsidian 插件，让你可以在 Obsidian 中一站式访问和管理多个 AI 助手。无需离开笔记环境，即可快速切换并使用各类 AI 聊天工具。

### ✨ 功能特性

- **多 AI 聚合**：内置 20+ 主流 AI 助手（ChatGPT、DeepSeek、通义千问、Kimi、豆包、文心一言、Gemini 等）
- **Tab 页切换**：顶部标签栏快速切换不同 AI，支持拖拽横向滚动
- **嵌入/弹窗模式**：自动识别可嵌入的网站，无法嵌入的 AI 会提供弹窗打开选项
- **完全自定义**：
  - 添加/删除/编辑任意 AI 模型
  - 拖拽调整 AI 显示顺序
  - 自定义名称、图标和 URL
- **刷新功能**：单独刷新当前 AI 或一键刷新全部 AI
- **界面精简**：可隐藏标签栏，获得更大浏览空间
- **多语言支持**：中文 / English

### 📦 安装方式

#### 从 Obsidian 官方社区安装

1. 打开 Obsidian 设置 → **第三方插件** → **社区插件**
2. 关闭 **安全模式**
3. 点击 **浏览**，搜索 "AI Hub Manager"
4. 安装并启用插件

#### 手动安装

1. 从 [Releases](https://github.com/liwbcraft/obsidian-ai-hub/releases) 下载 `main.js`、`styles.css` 和 `manifest.json`
2. 将它们放入你的笔记库 `.obsidian/plugins/ai-hub-manager/` 文件夹中
3. 重启 Obsidian 并在插件设置中启用

### 🚀 使用说明

1. 点击左侧功能区机器人图标 🤖，或通过命令面板执行 **打开 AI Hub**
2. 点击顶部标签切换不同 AI 助手
3. 需要弹窗打开的 AI 会显示占位符，点击按钮即可在新窗口打开
4. 在插件设置中可：
   - 设置默认打开的 AI
   - 隐藏/显示标签栏
   - 管理 AI 模型（增删改查、拖拽排序）
   - 切换语言

### 📋 默认支持的 AI 列表

| AI             | 图标 | 弹窗模式 |
| -------------- | ---- | -------- |
| ChatGPT        | 💬    | ✅        |
| DeepSeek       | 🤖    | ❌        |
| 通义千问       | ☁️    | ❌        |
| 元宝           | 💰    | ❌        |
| 豆包           | 🍡    | ❌        |
| Kimi           | 🌙    | ❌        |
| 秘塔搜索       | 🔍    | ❌        |
| 讯飞星火       | 🔥    | ✅        |
| Gemini         | ✨    | ❌        |
| 文心一言       | 🐻    | ❌        |
| 智谱清言       | 🔵    | ❌        |
| 商量 SenseChat | 🗣️    | ❌        |
| 百小应         | 🐦    | ✅        |
| 阶跃 AI        | ⚡    | ❌        |
| 天工 AI        | 🏔️    | ✅        |
| MiniMax        | 🪄    | ❌        |
| Copilot        | 🪟    | ✅        |
| Le Chat        | 🐓    | ❌        |
| HuggingChat    | 🤗    | ❌        |
| Grok           | 🚀    | ❌        |

> 💡 提示：可编辑或删除任意默认模型

### 📄 许可证

MIT

### 🙏 支持

如果这个插件对你有帮助，欢迎通过 [爱发电](https://ifdian.net/a/liwbcraft) 支持作者。

---

## English

![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-purple) ![Version](https://img.shields.io/badge/version-1.0.0-blue)

### 📖 Introduction

AI Hub Manager is an Obsidian plugin that allows you to access and manage multiple AI assistants in one place. Quickly switch between and use various AI chat tools without leaving your note-taking environment.

### ✨ Features

- **Multi-AI Aggregation**: Built-in support for 20+ mainstream AI assistants (ChatGPT, DeepSeek, Qwen, Kimi, Doubao, Ernie, Gemini, and more)
- **Tab Switching**: Fast switching between different AIs via the top tab bar, with drag-to-scroll support
- **Embed/Popup Mode**: Automatically detects embeddable websites; AIs that cannot be embedded provide popup options
- **Fully Customizable**:
  - Add/remove/edit any AI model
  - Drag to reorder AI display
  - Customize names, icons, and URLs
- **Refresh Functionality**: Refresh the current AI individually or all AIs with one click
- **Clean Interface**: Hide the tab bar for more browsing space
- **Multi-language Support**: 中文 / English

### 📦 Installation

#### From Obsidian Official Community

1. Open Obsidian Settings → **Third-party plugins** → **Community plugins**
2. Turn off **Safe mode**
3. Click **Browse** and search for "AI Hub Manager "
4. Install and enable the plugin

#### Manual Installation

1. Download `main.js`, `styles.css`, and `manifest.json` from [Releases](https://github.com/liwbcraft/obsidian-ai-hub/releases)
2. Place them in your vault's `.obsidian/plugins/ai-hub-manager/` folder
3. Restart Obsidian and enable the plugin in settings

### 🚀 Usage

1. Click the robot icon 🤖 in the left ribbon, or use the command palette to execute **Open AI Hub**
2. Click tabs at the top to switch between different AI assistants
3. AIs requiring popup mode will show a placeholder - click the button to open in a new window
4. In plugin settings, you can:
   - Set the default AI
   - Show/hide the tab bar
   - Manage AI models (add, delete, edit, drag to reorder)
   - Switch language

### 📋 Default AI List

| AI             | Icon | Popup |
| -------------- | ---- | ----- |
| ChatGPT        | 💬    | ✅     |
| DeepSeek       | 🤖    | ❌     |
| Tongyi Qianwen | ☁️    | ❌     |
| Yuanbao        | 💰    | ❌     |
| Doubao         | 🍡    | ❌     |
| Kimi           | 🌙    | ❌     |
| Metaso         | 🔍    | ❌     |
| iFlytek Spark  | 🔥    | ✅     |
| Gemini         | ✨    | ❌     |
| Ernie Bot      | 🐻    | ❌     |
| Zhipu Qingyan  | 🔵    | ❌     |
| SenseChat      | 🗣️    | ❌     |
| Baichuan       | 🐦    | ✅     |
| Step AI        | ⚡    | ❌     |
| Tiangong AI    | 🏔️    | ✅     |
| MiniMax        | 🪄    | ❌     |
| Copilot        | 🪟    | ✅     |
| Le Chat        | 🐓    | ❌     |
| HuggingChat    | 🤗    | ❌     |
| Grok           | 🚀    | ❌     |

> 💡 Tip: You can edit or delete any default model

### 📄 License

MIT

### 🙏 Support

If this plugin helps you, you can support the author via [iFudian](https://ifdian.net/a/liwbcraft).