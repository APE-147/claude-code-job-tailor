import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import type { ResumeSchema } from '@types';

const Languages = ({ resume }: { resume: ResumeSchema }) => {
  const { labels, locale, tokens } = useLocale();
  const styles = createStyles(tokens, locale);

  if (!resume.languages || resume.languages.length === 0) {
    return null;
  }

  const itemSeparator = locale === 'zh' ? '、' : ' • ';
  const proficiencyWrap = locale === 'zh'
    ? (language: string, proficiency: string) => `${language}（${proficiency}）`
    : (language: string, proficiency: string) => `${language} (${proficiency})`;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{labels.languages}</Text>
      <View style={styles.separator} />
      <Text style={styles.languagesText}>
        {resume.languages
          .map((lang) => proficiencyWrap(lang.language, lang.proficiency))
          .join(itemSeparator)}
      </Text>
    </View>
  );
};

export default Languages;

const createStyles = (
  currentTokens: ReturnType<typeof useLocale>['tokens'],
  locale: ReturnType<typeof useLocale>['locale'],
) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    container: {
      marginBottom: spacing.pagePadding,
    },
    sectionTitle: {
      fontFamily: typography.fonts.bold,
      fontSize: 11,
      color: colors.primary,
      textTransform: locale === 'zh' ? 'none' : 'uppercase',
    },
    languagesText: {
      fontFamily: typography.fonts.regular,
      fontSize: typography.text.size,
      color: colors.darkGray,
      lineHeight: typography.text.lineHeight,
      marginBottom: spacing.pagePadding / 2,
    },
    separator: {
      width: '100%',
      borderBottom: `1px solid ${colors.separatorGray}`,
      paddingTop: spacing.pagePadding / 2,
      marginBottom: spacing.pagePadding / 2,
    },
  });
};
