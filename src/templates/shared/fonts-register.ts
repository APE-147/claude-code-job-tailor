import { Font } from '@react-pdf/renderer';
import path from 'path';
import type { Locale } from './i18n';

const NOTO_REGULAR = path.join(__dirname, 'fonts', 'NotoSansSC-Regular.ttf');
const NOTO_BOLD = path.join(__dirname, 'fonts', 'NotoSansSC-Bold.ttf');

const LATO_SOURCES = {
  regular: 'https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf',
  italic: 'https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf',
  light: 'https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh50XSwiPHA.ttf',
  semibold: 'https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6MYrmSPY4.ttf',
  bold: 'https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf',
} as const;

const OPEN_SANS_SOURCES = {
  regular: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf',
  light: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0a.ttf',
  bold: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0b.ttf',
  italic: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf',
} as const;

let hyphenationDisabled = false;
const registeredLocales = new Set<Locale>();

export const FONT_FAMILIES = {
  en: {
    body: 'Lato',
    bodyItalic: 'Lato Italic',
    bodyLight: 'Lato Light',
    bodySemibold: 'Lato Semibold',
    bodyBold: 'Lato Bold',
    sans: 'Open Sans',
    sansLight: 'Open Sans Light',
    sansBold: 'Open Sans Bold',
    sansItalic: 'Open Sans Italic',
  },
  zh: {
    body: 'Noto Sans SC',
    bodyItalic: 'Noto Sans SC',
    bodyLight: 'Noto Sans SC',
    bodySemibold: 'Noto Sans SC Bold',
    bodyBold: 'Noto Sans SC Bold',
    sans: 'Noto Sans SC',
    sansLight: 'Noto Sans SC',
    sansBold: 'Noto Sans SC Bold',
    sansItalic: 'Noto Sans SC',
  },
} as const;

type LatoSources = {
  regular: string;
  italic: string;
  light: string;
  semibold: string;
  bold: string;
};

type OpenSansSources = {
  regular: string;
  light: string;
  bold: string;
  italic: string;
};

type FontFamilies = {
  regular: string;
  italic: string;
  light: string;
  semibold: string;
  bold: string;
};

type SansFamilies = {
  regular: string;
  light: string;
  bold: string;
  italic: string;
};

const registerLato = (families: FontFamilies, sources: LatoSources) => {
  Font.register({ family: families.regular, src: sources.regular });
  Font.register({ family: families.italic, fontStyle: 'italic', src: sources.italic });
  Font.register({ family: families.light, fontWeight: 'light', src: sources.light });
  Font.register({ family: families.semibold, fontWeight: 'semibold', src: sources.semibold });
  Font.register({ family: families.bold, fontWeight: 'bold', src: sources.bold });
};

const registerOpenSans = (families: SansFamilies, sources: OpenSansSources) => {
  Font.register({ family: families.regular, src: sources.regular });
  Font.register({ family: families.light, fontWeight: 'light', src: sources.light });
  Font.register({ family: families.bold, fontWeight: 'bold', src: sources.bold });
  Font.register({ family: families.italic, fontStyle: 'italic', src: sources.italic });
};

export const registerFonts = (locale: Locale = 'en') => {
  // MUST be first: disable hyphenation before any font registration (required for CJK)
  if (!hyphenationDisabled) {
    Font.registerHyphenationCallback((word: string) => [word]);
    hyphenationDisabled = true;
  }

  if (registeredLocales.has(locale)) {
    return;
  }

  if (locale === 'zh') {
    registerLato(
      {
        regular: FONT_FAMILIES.zh.body,
        italic: FONT_FAMILIES.zh.bodyItalic,
        light: FONT_FAMILIES.zh.bodyLight,
        semibold: FONT_FAMILIES.zh.bodySemibold,
        bold: FONT_FAMILIES.zh.bodyBold,
      },
      {
        regular: NOTO_REGULAR,
        italic: NOTO_REGULAR,
        light: NOTO_REGULAR,
        semibold: NOTO_BOLD,
        bold: NOTO_BOLD,
      },
    );
    registerOpenSans(
      {
        regular: FONT_FAMILIES.zh.sans,
        light: FONT_FAMILIES.zh.sansLight,
        bold: FONT_FAMILIES.zh.sansBold,
        italic: FONT_FAMILIES.zh.sansItalic,
      },
      {
        regular: NOTO_REGULAR,
        light: NOTO_REGULAR,
        bold: NOTO_BOLD,
        italic: NOTO_REGULAR,
      },
    );
  } else {
    registerLato(
      {
        regular: FONT_FAMILIES.en.body,
        italic: FONT_FAMILIES.en.bodyItalic,
        light: FONT_FAMILIES.en.bodyLight,
        semibold: FONT_FAMILIES.en.bodySemibold,
        bold: FONT_FAMILIES.en.bodyBold,
      },
      LATO_SOURCES,
    );
    registerOpenSans(
      {
        regular: FONT_FAMILIES.en.sans,
        light: FONT_FAMILIES.en.sansLight,
        bold: FONT_FAMILIES.en.sansBold,
        italic: FONT_FAMILIES.en.sansItalic,
      },
      OPEN_SANS_SOURCES,
    );
  }

  registeredLocales.add(locale);
};
