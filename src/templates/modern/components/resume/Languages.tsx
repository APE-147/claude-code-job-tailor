import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

import { useLocale } from '@template-core/locale-context';
import type { ResumeSchema } from '@types';

const Languages = ({ resume }: { resume: ResumeSchema }) => {
  const { labels, tokens } = useLocale();
  const styles = createStyles(tokens);

  // Don't render if no languages
  if (!resume.languages || resume.languages.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{labels.languages}</Text>
      <View style={styles.languagesList}>
        {resume.languages.map((language, index) => (
          <View key={index} style={styles.languageItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.languageText}>
              <Text style={styles.language}>{language.language}</Text> - {language.proficiency}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Languages;

const createStyles = (currentTokens: ReturnType<typeof useLocale>['tokens']) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    container: {
      flexDirection: 'column',
      marginBottom: spacing.pagePadding / 2,
    },
    sectionTitle: {
      fontFamily: typography.fonts.bold,
      fontSize: 12,
      color: colors.primary,
      marginBottom: spacing.pagePadding / 3,
    },
    languagesList: {
      flexDirection: 'column',
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 3,
    },
    bullet: {
      width: 8,
      fontSize: 4,
      fontFamily: typography.fonts.regular,
      color: colors.primary,
      paddingTop: 3,
    },
    languageText: {
      flex: 1,
      fontFamily: typography.fonts.regular,
      fontSize: 8,
      lineHeight: typography.text.lineHeight,
      color: colors.primary,
    },
    language: {
      fontFamily: typography.fonts.bold,
      fontSize: 8,
      color: colors.primary,
    },
  });
};
