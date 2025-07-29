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
export declare class MarkdownToImageConverter {
    private themeManager;
    constructor();
    convert(options: ConvertOptions): Promise<ConvertResult[]>;
    private processMarkdown;
    private autoSplitText;
    private convertSingle;
    private generateHTML;
    private generatePNG;
    private generateSVG;
    copyToClipboard(imagePath: string): Promise<void>;
    generatePreview(markdown: string, theme: string): Promise<string>;
    private ensureOutputDir;
    private formatFileSize;
}
//# sourceMappingURL=converter.d.ts.map