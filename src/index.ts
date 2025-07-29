#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { MarkdownToImageConverter } from './converter.js';
import { ThemeManager } from './themes.js';

class Md2ImageMCPServer {
  private server: Server;
  private converter: MarkdownToImageConverter;
  private themeManager: ThemeManager;

  constructor() {
    this.server = new Server({
      name: 'md2image-mcp',
      version: '1.0.0',
    });

    this.converter = new MarkdownToImageConverter();
    this.themeManager = new ThemeManager();
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'convert_markdown_to_image',
            description: '将Markdown文本转换为知识卡片图片',
            inputSchema: {
              type: 'object',
              properties: {
                markdown: {
                  type: 'string',
                  description: 'Markdown文本内容'
                },
                theme: {
                  type: 'string',
                  description: '主题风格 (default, dark, gradient, minimal, colorful)',
                  default: 'default'
                },
                format: {
                  type: 'string',
                  description: '输出格式 (png, svg)',
                  default: 'png'
                },
                width: {
                  type: 'number',
                  description: '图片宽度',
                  default: 800
                },
                height: {
                  type: 'number',
                  description: '图片高度 (0为自动高度)',
                  default: 0
                },
                splitMode: {
                  type: 'string',
                  description: "图片拆分模式: 'none' (长图文), 'hr' (按---分割线拆分), 'auto' (按长度自动拆分)",
                  enum: ['none', 'hr', 'auto'],
                  default: 'none'
                },
                maxLength: {
                  type: 'number',
                  description: "自动拆分模式下的最大字符数",
                  default: 800
                },
                outputPath: {
                  type: 'string',
                  description: '图片输出目录的路径。如果未提供，将使用默认的 "output" 目录。'
                },
                cwd: {
                  type: 'string',
                  description: '用于解析相对路径的当前工作目录。如果未提供，将使用进程的当前工作目录。'
                }
              },
              required: ['markdown']
            }
          },
          {
            name: 'list_themes',
            description: '列出所有可用的主题风格',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'copy_to_clipboard',
            description: '将生成的图片复制到剪贴板',
            inputSchema: {
              type: 'object',
              properties: {
                imagePath: {
                  type: 'string',
                  description: '图片文件路径'
                }
              },
              required: ['imagePath']
            }
          },
          {
            name: 'preview_markdown',
            description: '预览Markdown渲染效果',
            inputSchema: {
              type: 'object',
              properties: {
                markdown: {
                  type: 'string',
                  description: 'Markdown文本内容'
                },
                theme: {
                  type: 'string',
                  description: '主题风格',
                  default: 'default'
                }
              },
              required: ['markdown']
            }
          }
        ] as Tool[]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'convert_markdown_to_image':
            return await this.handleConvertMarkdown(args);
          
          case 'list_themes':
            return await this.handleListThemes();
          
          case 'copy_to_clipboard':
            return await this.handleCopyToClipboard(args);
          
          case 'preview_markdown':
            return await this.handlePreviewMarkdown(args);
          
          default:
            throw new Error(`未知的工具: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `错误: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    });
  }

  private async handleConvertMarkdown(args: any) {
    const {
      markdown,
      theme = 'default',
      format = 'png',
      width = 800,
      height = 0,
      splitMode = 'none',
      maxLength = 800,
      outputPath,
      cwd
    } = args;

    const results = await this.converter.convert({
      markdown,
      theme,
      format,
      width,
      height,
      splitMode,
      maxLength,
      outputPath,
      cwd
    });

    return {
      content: [
        {
          type: 'text',
          text: `成功生成 ${results.length} 张知识卡片:\n${results.map((r, i) => `${i + 1}. ${r.path} (${r.size})`).join('\n')}`
        }
      ]
    };
  }

  private async handleListThemes() {
    const themes = this.themeManager.getAvailableThemes();
    
    return {
      content: [
        {
          type: 'text',
          text: `可用主题:\n${themes.map(t => `- ${t.name}: ${t.description}`).join('\n')}`
        }
      ]
    };
  }

  private async handleCopyToClipboard(args: any) {
    const { imagePath } = args;
    await this.converter.copyToClipboard(imagePath);
    
    return {
      content: [
        {
          type: 'text',
          text: `图片已复制到剪贴板: ${imagePath}`
        }
      ]
    };
  }

  private async handlePreviewMarkdown(args: any) {
    const { markdown, theme = 'default' } = args;
    const previewPath = await this.converter.generatePreview(markdown, theme);
    
    return {
      content: [
        {
          type: 'text',
          text: `预览已生成: ${previewPath}`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Md2Image MCP服务器已启动');
  }
}

const server = new Md2ImageMCPServer();
server.run().catch(console.error);