import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import type { ResumeSchema } from '@types';

const Education = ({ resume, debug = false }: { resume: ResumeSchema; debug?: boolean }) => {
  const { labels, locale, tokens } = useLocale();
  const styles = createStyles(tokens, locale);

  // Don't render if education is empty (should be caught by registry, but defensive check)
  if (!resume.education || resume.education.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} debug={debug}>
      <Text style={styles.sectionTitle}>{labels.education}</Text>
      <View style={styles.separator} />
      {resume.education.map((edu, index) => (
        <View key={index} style={styles.educationEntry}>
          <View style={styles.educationHeader}>
            <Text style={styles.institution}>{edu.institution}</Text>
            <Text style={styles.locationDuration}>
              {edu.location} | {edu.duration}
            </Text>
          </View>
          <Text style={styles.program}>{edu.program}</Text>
        </View>
      ))}
    </View>
  );
};

export default Education;

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
    educationEntry: {
      marginBottom: spacing.pagePadding / 2,
    },
    educationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2,
    },
    institution: {
      fontFamily: typography.fonts.bold,
      fontSize: typography.text.size,
      color: colors.primary,
    },
    program: {
      fontFamily: typography.fonts.regular,
      fontSize: typography.text.size,
      color: colors.darkGray,
      marginBottom: 2,
    },
    locationDuration: {
      fontFamily: typography.fonts.regular,
      fontSize: typography.text.size,
      color: colors.mediumGray,
      textAlign: 'right',
    },
    separator: {
      width: '100%',
      borderBottom: `1px solid ${colors.separatorGray}`,
      paddingTop: spacing.pagePadding / 2,
      marginBottom: spacing.pagePadding / 2,
    },
  });
};
