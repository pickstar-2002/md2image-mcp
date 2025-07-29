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

export class ThemeManager {
  private themes: Map<string, Theme> = new Map();

  constructor() {
    this.initializeThemes();
  }

  private initializeThemes() {
    // 默认主题
    this.themes.set('default', {
      name: '默认',
      description: '简洁的白色主题',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      cardBackground: '#ffffff',
      textColor: '#333333',
      headingColor: '#2c3e50',
      mutedColor: '#666666',
      accentColor: '#3498db',
      linkColor: '#3498db',
      codeBackground: '#f8f9fa',
      codeColor: '#e83e8c',
      borderColor: '#dee2e6',
      tableHeaderBackground: '#f8f9fa',
      shadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    });

    // 深色主题
    this.themes.set('dark', {
      name: '深色',
      description: '优雅的深色主题',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBackground: '#2d3748',
      textColor: '#e2e8f0',
      headingColor: '#f7fafc',
      mutedColor: '#a0aec0',
      accentColor: '#63b3ed',
      linkColor: '#63b3ed',
      codeBackground: '#1a202c',
      codeColor: '#fbb6ce',
      borderColor: '#4a5568',
      tableHeaderBackground: '#1a202c',
      shadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    });

    // 渐变主题
    this.themes.set('gradient', {
      name: '渐变',
      description: '彩色渐变主题',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBackground: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
      textColor: '#4a5568',
      headingColor: '#2d3748',
      mutedColor: '#718096',
      accentColor: '#805ad5',
      linkColor: '#805ad5',
      codeBackground: '#edf2f7',
      codeColor: '#d53f8c',
      borderColor: '#e2e8f0',
      tableHeaderBackground: '#f7fafc',
      shadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
      border: '1px solid rgba(102, 126, 234, 0.2)'
    });

    // 极简主题
    this.themes.set('minimal', {
      name: '极简',
      description: '极简黑白主题',
      background: '#ffffff',
      cardBackground: '#ffffff',
      textColor: '#000000',
      headingColor: '#000000',
      mutedColor: '#666666',
      accentColor: '#000000',
      linkColor: '#000000',
      codeBackground: '#f5f5f5',
      codeColor: '#000000',
      borderColor: '#e0e0e0',
      tableHeaderBackground: '#f5f5f5',
      shadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      border: '2px solid #000000'
    });

    // 彩色主题
    this.themes.set('colorful', {
      name: '彩色',
      description: '活力彩色主题',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      cardBackground: '#ffffff',
      textColor: '#2d3748',
      headingColor: '#e53e3e',
      mutedColor: '#718096',
      accentColor: '#38b2ac',
      linkColor: '#3182ce',
      codeBackground: '#fed7d7',
      codeColor: '#c53030',
      borderColor: '#feb2b2',
      tableHeaderBackground: '#fed7d7',
      shadow: '0 15px 35px rgba(255, 154, 158, 0.3)',
      border: '2px solid #feb2b2'
    });

    // 商务主题
    this.themes.set('business', {
      name: '商务',
      description: '专业商务主题',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      cardBackground: '#ffffff',
      textColor: '#2d3748',
      headingColor: '#1a365d',
      mutedColor: '#4a5568',
      accentColor: '#2b6cb0',
      linkColor: '#2b6cb0',
      codeBackground: '#edf2f7',
      codeColor: '#2b6cb0',
      borderColor: '#cbd5e0',
      tableHeaderBackground: '#f7fafc',
      shadow: '0 20px 40px rgba(30, 60, 114, 0.2)',
      border: '1px solid #cbd5e0'
    });

    // 温暖主题
    this.themes.set('warm', {
      name: '温暖',
      description: '温暖橙色主题',
      background: 'linear-gradient(135deg, #ff9a56 0%, #ffad56 100%)',
      cardBackground: '#fffaf0',
      textColor: '#744210',
      headingColor: '#9c4221',
      mutedColor: '#a0792c',
      accentColor: '#dd6b20',
      linkColor: '#c05621',
      codeBackground: '#fef5e7',
      codeColor: '#c05621',
      borderColor: '#fbd38d',
      tableHeaderBackground: '#fef5e7',
      shadow: '0 15px 35px rgba(255, 154, 86, 0.3)',
      border: '2px solid #fbd38d'
    });
  }

  getTheme(name: string): Theme {
    const theme = this.themes.get(name);
    if (!theme) {
      console.warn(`主题 "${name}" 不存在，使用默认主题`);
      return this.themes.get('default')!;
    }
    return theme;
  }

  getAvailableThemes(): Array<{name: string, description: string}> {
    return Array.from(this.themes.values()).map(theme => ({
      name: theme.name,
      description: theme.description
    }));
  }

  addCustomTheme(name: string, theme: Theme): void {
    this.themes.set(name, theme);
  }
}