import { marked } from 'marked';
import puppeteer from 'puppeteer';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname, isAbsolute } from 'path';
import { existsSync } from 'fs';
import clipboardy from 'clipboardy';
import { ThemeManager, Theme } from './themes.js';

export interface ConvertOptions {
  markdown: string;
  theme: string;
  format: 'png' | 'svg';
  width: number;
  height: number;
  splitMode: 'none' | 'hr' | 'auto';
  maxLength: number;
  outputPath?: string;
  cwd?: string;
}

export interface ConvertResult {
  path: string;
  size: string;
  index: number;
}

export class MarkdownToImageConverter {
  private themeManager: ThemeManager;

  constructor() {
    this.themeManager = new ThemeManager();
  }

  async convert(options: ConvertOptions): Promise<ConvertResult[]> {
    const baseDir = options.cwd || process.cwd();
    const outputDir = options.outputPath 
        ? (isAbsolute(options.outputPath) ? options.outputPath : join(baseDir, options.outputPath)) 
        : join(baseDir, 'output');
    
    // 确保输出目录存在
    await this.ensureOutputDir(outputDir);

    // 处理Markdown内容
    const contents = this.processMarkdown(options.markdown, options);
    
    const results: ConvertResult[] = [];
    
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];
      const result = await this.convertSingle(content, options, i, outputDir);
      results.push(result);
    }

    return results;
  }

  private processMarkdown(markdown: string, options: ConvertOptions): string[] {
    switch (options.splitMode) {
      case 'hr':
        // 按 --- 分割
        return markdown.split(/^---\s*$/m).filter(content => content.trim());
      case 'auto':
        // 自动拆分长文本
        return this.autoSplitText(markdown, options.maxLength);
      case 'none':
      default:
        // 不拆分，生成长图文
        return [markdown];
    }
  }

  private autoSplitText(text: string, maxLength: number): string[] {
    const paragraphs = text.split('\n\n');
    const chunks: string[] = [];
    let currentChunk = '';

    for (const paragraph of paragraphs) {
      if ((currentChunk + paragraph).length > maxLength && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  }

  private async convertSingle(
    markdown: string, 
    options: ConvertOptions, 
    index: number,
    outputDir: string
  ): Promise<ConvertResult> {
    const theme = this.themeManager.getTheme(options.theme);
    const html = this.generateHTML(markdown, theme);
    
    const timestamp = Date.now();
    const filename = `card_${timestamp}_${index + 1}.${options.format}`;
    const outputPath = join(outputDir, filename);

    if (options.format === 'png') {
      await this.generatePNG(html, outputPath, options.width, options.height);
    } else {
      await this.generateSVG(html, outputPath, options.width, options.height);
    }

    // 获取文件大小
    const stats = await import('fs').then(fs => fs.promises.stat(outputPath));
    const size = this.formatFileSize(stats.size);

    return {
      path: outputPath,
      size,
      index
    };
  }

  private generateHTML(markdown: string, theme: Theme): string {
    const htmlContent = marked(markdown);
    
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>知识卡片</title>
    <style>
        ${theme.css}
        
        body {
            margin: 0;
            padding: 40px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            line-height: 1.6;
            word-wrap: break-word;
            background: ${theme.background};
            color: ${theme.textColor};
        }
        
        .card {
            max-width: 100%;
            margin: 0 auto;
            background: ${theme.cardBackground};
            border-radius: 12px;
            padding: 32px;
            box-shadow: ${theme.shadow};
            border: ${theme.border};
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: ${theme.headingColor};
            margin-top: 0;
            margin-bottom: 16px;
        }
        
        h1 { font-size: 2em; font-weight: 700; }
        h2 { font-size: 1.5em; font-weight: 600; }
        h3 { font-size: 1.25em; font-weight: 600; }
        
        p {
            margin-bottom: 16px;
        }
        
        code {
            background: ${theme.codeBackground};
            color: ${theme.codeColor};
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        }
        
        pre {
            background: ${theme.codeBackground};
            color: ${theme.codeColor};
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 16px 0;
        }
        
        pre code {
            background: none;
            padding: 0;
        }
        
        blockquote {
            border-left: 4px solid ${theme.accentColor};
            margin: 16px 0;
            padding-left: 16px;
            color: ${theme.mutedColor};
            font-style: italic;
        }
        
        ul, ol {
            padding-left: 24px;
            margin-bottom: 16px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        a {
            color: ${theme.linkColor};
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
        }
        
        th, td {
            border: 1px solid ${theme.borderColor};
            padding: 8px 12px;
            text-align: left;
        }
        
        th {
            background: ${theme.tableHeaderBackground};
            font-weight: 600;
        }
        
        .watermark {
            position: absolute;
            bottom: 16px;
            right: 16px;
            font-size: 12px;
            color: ${theme.mutedColor};
            opacity: 0.6;
        }
    </style>
</head>
<body>
    <div class="card">
        ${htmlContent}
    </div>
    <div class="watermark">由 Md2Image MCP 生成</div>
</body>
</html>`;
  }

  private async generatePNG(html: string, outputPath: string, width: number, height: number) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width, height: height || 600 });
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // 如果高度为0，自动计算高度
      if (height === 0) {
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
        await page.setViewport({ width, height: bodyHeight + 100 });
      }

      await page.screenshot({
        path: outputPath,
        type: 'png',
        fullPage: true
      });
    } finally {
      await browser.close();
    }
  }

  private async generateSVG(html: string, outputPath: string, width: number, height: number) {
    // SVG生成逻辑 - 这里简化处理，实际可以使用更复杂的HTML到SVG转换
    const svgContent = `
<svg width="${width}" height="${height || 600}" xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      ${html}
    </div>
  </foreignObject>
</svg>`;

    await writeFile(outputPath, svgContent, 'utf-8');
  }

  async copyToClipboard(imagePath: string): Promise<void> {
    if (!existsSync(imagePath)) {
      throw new Error(`图片文件不存在: ${imagePath}`);
    }

    // 读取图片并复制到剪贴板
    const imageBuffer = await import('fs').then(fs => fs.promises.readFile(imagePath));
    
    // 注意：clipboardy主要支持文本，对于图片需要特殊处理
    // 这里提供文件路径作为替代方案
    await clipboardy.write(imagePath);
  }

  async generatePreview(markdown: string, theme: string): Promise<string> {
    const themeObj = this.themeManager.getTheme(theme);
    const html = this.generateHTML(markdown, themeObj);
    
    const outputDir = join(process.cwd(), 'output');
    const previewPath = join(outputDir, `preview_${Date.now()}.html`);
    await this.ensureOutputDir(outputDir);
    await writeFile(previewPath, html, 'utf-8');
    
    return previewPath;
  }

  private async ensureOutputDir(dir: string): Promise<void> {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}