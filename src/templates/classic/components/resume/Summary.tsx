import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import { RichText } from '@template-core/rich-text';
import type { ResumeSchema } from '@types';

const Summary = ({ resume }: { resume: ResumeSchema }) => {
  const { labels, locale, tokens } = useLocale();
  const styles = createStyles(tokens, locale);

  // Only render if summary exists and is not empty
  if (!resume.summary || resume.summary.trim() === '') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{labels.profile}</Text>
      <View style={styles.separator} />
      <RichText text={resume.summary} style={styles.summaryText} />
    </View>
  );
};

export default Summary;

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
      marginBottom: 0,
    },
    summaryText: {
      fontFamily: typography.fonts.regular,
      fontSize: typography.text.size,
      lineHeight: typography.text.lineHeight,
      color: colors.darkGray,
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
