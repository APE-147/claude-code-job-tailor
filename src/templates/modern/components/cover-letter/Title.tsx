import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import type { CoverLetterSchema } from '@types';

const Title = ({ data }: { data: CoverLetterSchema }) => {
  const { tokens } = useLocale();
  const styles = createStyles(tokens);
  // Use position if available, otherwise fall back to letter_title
  const titleText = data.position ? `Cover Letter ${data.position}` : data.content.letter_title;

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{titleText}</Text>
    </View>
  );
};

export default Title;

const createStyles = (currentTokens: ReturnType<typeof useLocale>['tokens']) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    titleContainer: {
      marginBottom: spacing.pagePadding / 1.5,
    },
    titleText: {
      fontSize: 12,
      fontFamily: typography.fonts.regular,
      color: colors.primary,
      marginBottom: 6,
      lineHeight: 1.33,
    },
  });
};
