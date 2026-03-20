import React, { createContext, useContext } from 'react';
import type { Locale, SectionLabels } from './i18n';
import { getLabels } from './i18n';
import { getModernTokens, type LocaleThemeTokens } from './design-tokens';

type LocaleContextValue = {
  locale: Locale;
  labels: SectionLabels;
  tokens: LocaleThemeTokens;
};

const defaultLocale = 'en' as const;

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  labels: getLabels(defaultLocale),
  tokens: getModernTokens(defaultLocale),
});

export const LocaleProvider = ({
  locale,
  tokens,
  children,
}: {
  locale: Locale;
  tokens?: LocaleThemeTokens;
  children: React.ReactNode;
}) => (
  <LocaleContext.Provider
    value={{
      locale,
      labels: getLabels(locale),
      tokens: tokens ?? getModernTokens(locale),
    }}
  >
    {children}
  </LocaleContext.Provider>
);

export const useLocale = (): LocaleContextValue => useContext(LocaleContext);
