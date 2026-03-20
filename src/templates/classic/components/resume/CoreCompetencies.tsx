import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import type { ResumeSchema } from '@types';

const CoreCompetencies = ({ resume }: { resume: ResumeSchema }) => {
  const { labels, locale, tokens } = useLocale();
  const styles = createStyles(tokens, locale);

  if (!resume.skills || resume.skills.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{labels.softSkills}</Text>
      <View style={styles.separator} />
      <Text style={styles.skillsText}>{resume.skills.join(' • ')}</Text>
    </View>
  );
};

export default CoreCompetencies;

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
    skillsText: {
      fontFamily: typography.fonts.regular,
      fontSize: typography.text.size,
      color: colors.darkGray,
      lineHeight: typography.text.lineHeight,
    },
    separator: {
      width: '100%',
      borderBottom: `1px solid ${colors.separatorGray}`,
      paddingTop: spacing.pagePadding / 2,
      marginBottom: spacing.pagePadding / 2,
    },
  });
};
