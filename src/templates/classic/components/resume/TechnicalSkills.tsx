import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import type { ResumeSchema } from '@types';

const TechnicalSkills = ({ resume }: { resume: ResumeSchema }) => {
  const { labels, locale, tokens } = useLocale();
  const styles = createStyles(tokens, locale);

  if (!resume.technical_expertise || resume.technical_expertise.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{labels.technicalExpertise}</Text>
      <View style={styles.separator} />
      {resume.technical_expertise.map((category, index) => (
        <View key={index} style={styles.categoryRow}>
          <Text style={styles.categoryLabel}>{category.resume_title}:</Text>
          <Text style={styles.categoryContent}>{category.skills.join(', ')}</Text>
        </View>
      ))}
    </View>
  );
};

export default TechnicalSkills;

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
      color: colors.primary,
      fontFamily: typography.fonts.bold,
      fontSize: 11,
      textTransform: locale === 'zh' ? 'none' : 'uppercase',
    },
    categoryRow: {
      flexDirection: 'row',
      marginBottom: 3,
    },
    categoryLabel: {
      fontFamily: typography.fonts.bold,
      fontSize: typography.text.size,
      color: colors.darkGray,
      marginRight: 4,
    },
    categoryContent: {
      fontFamily: typography.fonts.regular,
      fontSize: typography.text.size,
      color: colors.darkGray,
      flex: 1,
    },
    separator: {
      width: '100%',
      borderBottom: `1px solid ${colors.separatorGray}`,
      paddingTop: spacing.pagePadding / 2,
      marginBottom: spacing.pagePadding / 2,
    },
  });
};
