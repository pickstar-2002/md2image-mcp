# Md2Image MCP - Markdown转知识卡片工具

[![npm version](https://img.shields.io/npm/v/md2image-mcp.svg)](https://www.npmjs.com/package/md2image-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

基于AI MCP协议的Markdown转知识卡片工具，可以让你用 Markdown 制作优雅的图文海报。

## ✨ 功能特性

- 🎨 **多种主题风格** - 7种精美主题任你选择
- 📄 **智能拆分** - 支持按分割线或自动拆分长文本
- 🖼️ **多格式输出** - 支持PNG、SVG格式
- 📋 **剪贴板支持** - 一键复制图片到剪贴板
- 👀 **所见即所得** - 实时预览渲染效果
- 🤖 **MCP协议** - 完美集成AI助手工作流

## 🚀 快速开始

### 安装

```bash
npm install -g md2image-mcp
```

### 作为MCP服务器使用

在你的MCP客户端配置中添加：

```json
{
  "mcpServers": {
    "md2image": {
      "timeout": 60,
      "type": "stdio",
      "command": "npx",
      "args": [
        "md2image-mcp"
      ]
    }
  }
}
```

### 命令行使用

```bash
# 生成单张长图文 (默认)
md2image-mcp convert "# 标题\n这是内容" --split-mode none

# 按水平分割线拆分
md2image-mcp convert "# 卡片1\n内容1\n---\n# 卡片2\n内容2" --split-mode hr

# 按长度自动拆分
md2image-mcp convert "很长的文本..." --split-mode auto --max-length 800
```

## 🎨 主题风格

| 主题名称 | 描述 | 适用场景 |
|---------|------|----------|
| `default` | 简洁的白色主题 | 通用场景 |
| `dark` | 优雅的深色主题 | 夜间阅读 |
| `gradient` | 彩色渐变主题 | 创意展示 |
| `minimal` | 极简黑白主题 | 专业文档 |
| `colorful` | 活力彩色主题 | 儿童教育 |
| `business` | 专业商务主题 | 商务演示 |
| `warm` | 温暖橙色主题 | 温馨内容 |

## 🛠️ MCP工具说明

### convert_markdown_to_image

将Markdown文本转换为知识卡片图片。

**参数：**
- `markdown` (必需): Markdown文本内容
- `theme` (可选): 主题风格，默认 'default'
- `format` (可选): 输出格式 'png' 或 'svg'，默认 'png'
- `width` (可选): 图片宽度，默认 800
- `height` (可选): 图片高度，0为自动高度
- `splitMode` (可选): 图片拆分模式: 'none' (长图文), 'hr' (按---分割), 'auto' (自动拆分)。默认为 'none'。
- `maxLength` (可选): 在 `auto` 模式下，每张图片的最大字符数。默认为 800。
- `outputPath` (可选): 图片输出目录的路径。如果未提供，将使用默认的 "output" 目录。
- `cwd` (可选): 用于解析相对路径的当前工作目录。
- `themeOverrides` (可选): 一个包含自定义颜色值的对象，用于覆盖所选主题的样式或创建新主题。

### list_themes

列出所有可用的主题风格。

### copy_to_clipboard

将生成的图片复制到剪贴板。

**参数：**
- `imagePath` (必需): 图片文件路径

### preview_markdown

预览Markdown渲染效果。

**参数：**
- `markdown` (必需): Markdown文本内容
- `theme` (可选): 主题风格

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请提交 Issue 或联系开发者。