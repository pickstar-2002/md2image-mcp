export interface Theme {
    name: string;
    description: string;
    background: string;
    cardBackground: string;
    textColor: string;
    headingColor: string;
    mutedColor: string;
    accentColor: string;
    linkColor: string;
    codeBackground: string;
    codeColor: string;
    borderColor: string;
    tableHeaderBackground: string;
    shadow: string;
    border: string;
    css?: string;
}
export declare class ThemeManager {
    private themes;
    constructor();
    private initializeThemes;
    getTheme(name: string): Theme;
    getAvailableThemes(): Array<{
        name: string;
        description: string;
    }>;
    addCustomTheme(name: string, theme: Theme): void;
}
//# sourceMappingURL=themes.d.ts.map