export interface AccessibilityConfig {
  highContrast: boolean;
  fontFamily: 'default' | 'opendyslexic';
  textSizePercent: number; // 100-200
  preferredLanguage: string;
  voiceInputEnabled: boolean;
}
