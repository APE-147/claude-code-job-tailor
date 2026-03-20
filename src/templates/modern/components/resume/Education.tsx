import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

import { useLocale } from '@template-core/locale-context';
import type { ResumeSchema } from '@types';

const Education = ({ resume, debug = false }: { resume: ResumeSchema; debug?: boolean }) => {
  const { labels, tokens } = useLocale();
  const styles = createStyles(tokens);

  return (
    <View style={styles.container} debug={debug} wrap={false}>
      <Text style={styles.sectionTitle}>{labels.education}</Text>
      {resume.education.map((edu, index) => (
        <View key={index} style={styles.educationEntry}>
          <Text style={styles.institution}>{edu.institution}</Text>
          <Text style={styles.program}>{edu.program}</Text>
          <Text style={styles.locationDuration}>
            {edu.location} | {edu.duration}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default Education;

const createStyles = (currentTokens: ReturnType<typeof useLocale>['tokens']) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    container: {
      marginTop: spacing.pagePadding / 2,
      paddingTop: spacing.pagePadding,
      borderTop: `1px solid ${colors.separatorGray}`,
    },
    sectionTitle: {
      color: colors.primary,
      fontFamily: typography.fonts.bold,
      fontSize: 12,
      marginBottom: spacing.pagePadding / 2,
    },
    educationEntry: {
      marginBottom: spacing.pagePadding / 2,
    },
    institution: {
      fontFamily: typography.fonts.bold,
      fontSize: 9,
      color: colors.primary,
      marginBottom: 2,
    },
    program: {
      fontFamily: typography.fonts.regular,
      fontSize: 8,
      color: colors.darkGray,
      marginBottom: 2,
    },
    locationDuration: {
      fontFamily: typography.fonts.regular,
      fontSize: 8,
      color: colors.mediumGray,
    },
  });
};
