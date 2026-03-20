// Design system constants for resume components
// Centralized design tokens to avoid circular imports
import { FONT_FAMILIES } from './fonts-register';
import type { Locale } from './i18n';
import tailwindColors from './libs/tailwind-colors';

type ModernFontSet = {
  regular: string;
  bold: string;
  sans: string;
  sansBold: string;
};

const englishFonts: ModernFontSet = {
  regular: FONT_FAMILIES.en.body,
  bold: FONT_FAMILIES.en.bodyBold,
  sans: FONT_FAMILIES.en.sans,
  sansBold: FONT_FAMILIES.en.sansBold,
};

const chineseFonts: ModernFontSet = {
  regular: FONT_FAMILIES.zh.body,
  bold: FONT_FAMILIES.zh.bodyBold,
  sans: FONT_FAMILIES.zh.sans,
  sansBold: FONT_FAMILIES.zh.sansBold,
};

const createModernTokens = ({
  accent,
  mediumGray,
  separatorGray,
  fonts,
  textSize,
  textLineHeight,
  titleTextTransform,
  titleLineHeight,
  subtitleFontSize,
  subtitleTextTransform,
  subtitleLineHeight,
  columnWidth,
  documentPadding,
}: {
  accent: string;
  mediumGray: string;
  separatorGray: string;
  fonts: ModernFontSet;
  textSize: number;
  textLineHeight: number;
  titleTextTransform: 'uppercase' | 'none';
  titleLineHeight: number;
  subtitleFontSize: number;
  subtitleTextTransform: 'capitalize' | 'none';
  subtitleLineHeight: number;
  columnWidth: number;
  documentPadding: number;
}) => ({
  colors: {
    primary: tailwindColors.zinc[900],
    accent,
    darkGray: tailwindColors.zinc[800],
    mediumGray,
    separatorGray,
    ...tailwindColors,
  },
  typography: {
    fonts,
    text: {
      size: textSize,
      fontFamily: fonts.regular,
      lineHeight: textLineHeight,
    },
    title: {
      fontSize: 22,
      fontFamily: fonts.bold,
      textTransform: titleTextTransform,
      marginBottom: 2,
      lineHeight: titleLineHeight,
    },
    subtitle: {
      fontSize: subtitleFontSize,
      fontFamily: fonts.bold,
      textTransform: subtitleTextTransform,
      marginBottom: 0,
      lineHeight: subtitleLineHeight,
    },
    small: {
      fontSize: 9,
      fontFamily: fonts.regular,
      lineHeight: textLineHeight,
    },
  },
  spacing: {
    columnWidth,
    documentPadding,
    pagePadding: 18,
    profileImageSize: 46,
    listItemSpacing: 4,
  },
});

export type ModernTokens = ReturnType<typeof createModernTokens>;
export type ClassicTokens = ReturnType<typeof createClassicTokens>;
export type LocaleThemeTokens = ModernTokens | ClassicTokens;

// Modern theme design tokens
const modernTokens: ModernTokens = createModernTokens({
  accent: tailwindColors.rose[600],
  mediumGray: tailwindColors.zinc[600],
  separatorGray: tailwindColors.zinc[400],
  fonts: englishFonts,
  textSize: 9,
  textLineHeight: 1.33,
  titleTextTransform: 'uppercase',
  titleLineHeight: 1.33,
  subtitleFontSize: 14,
  subtitleTextTransform: 'capitalize',
  subtitleLineHeight: 1.33,
  columnWidth: 180,
  documentPadding: 42,
});

// Classic theme design tokens (traditional, single-column layout)
const createClassicTokens = ({
  fonts,
  textSize,
  textLineHeight,
  titleTextTransform,
}: {
  fonts: ModernFontSet;
  textSize: number;
  textLineHeight: number;
  titleTextTransform: 'uppercase' | 'none';
}) => ({
  colors: {
    primary: tailwindColors.zinc[900],
    accent: tailwindColors.zinc[900],
    darkGray: tailwindColors.zinc[800],
    mediumGray: tailwindColors.zinc[600],
    separatorGray: tailwindColors.zinc[400],
    ...tailwindColors,
  },
  typography: {
    fonts,
    text: {
      size: textSize,
      fontFamily: fonts.regular,
      lineHeight: textLineHeight,
    },
    title: {
      fontSize: 11,
      fontFamily: fonts.bold,
      textTransform: titleTextTransform,
      marginBottom: 4,
      lineHeight: 1.2,
    },
    subtitle: {
      fontSize: 10,
      fontFamily: fonts.bold,
      textTransform: 'none' as const,
      marginBottom: 2,
      lineHeight: 1.2,
    },
    small: {
      fontSize: 9,
      fontFamily: fonts.regular,
      lineHeight: textLineHeight,
    },
  },
  spacing: {
    columnWidth: 0,
    documentPadding: 42,
    pagePadding: 8,
    profileImageSize: 48,
    listItemSpacing: 3,
  },
});

const classicTokens: ClassicTokens = createClassicTokens({
  fonts: englishFonts,
  textSize: 10,
  textLineHeight: 1.4,
  titleTextTransform: 'uppercase',
});

// Shared tokens for common values across all themes
const sharedTokens = {
  colors: {
    ...tailwindColors,
  },
  typography: {
    fonts: englishFonts,
    text: {
      fontFamily: englishFonts.regular,
    },
  },
  spacing: {
    documentPadding: 42,
  },
};

// Namespace export pattern
export const tokens = {
  modern: modernTokens,
  classic: classicTokens,
  shared: sharedTokens,
} as const;

const zhModernTokens: ModernTokens = createModernTokens({
  accent: tailwindColors.slate[600],
  mediumGray: tailwindColors.zinc[500],
  separatorGray: tailwindColors.zinc[300],
  fonts: chineseFonts,
  textSize: 9.5,
  textLineHeight: 1.5,
  titleTextTransform: 'none',
  titleLineHeight: 1.4,
  subtitleFontSize: 13,
  subtitleTextTransform: 'none',
  subtitleLineHeight: 1.4,
  columnWidth: 165,
  documentPadding: 40,
});

const zhClassicTokens: ClassicTokens = createClassicTokens({
  fonts: chineseFonts,
  textSize: 10.5,
  textLineHeight: 1.5,
  titleTextTransform: 'none',
});

export const getModernTokens = (locale: Locale = 'en'): ModernTokens =>
  locale === 'en' ? modernTokens : zhModernTokens;

export const getClassicTokens = (locale: Locale = 'en'): ClassicTokens =>
  locale === 'en' ? classicTokens : zhClassicTokens;

// Legacy exports for backward compatibility (will be removed after migration)
export const colors = modernTokens.colors;
export const typography = modernTokens.typography;
export const spacing = modernTokens.spacing;
