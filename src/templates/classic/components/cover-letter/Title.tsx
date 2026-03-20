import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import type { CoverLetterSchema } from '@types';
const Title = ({ data }: { data: CoverLetterSchema }) => {
  const { labels, tokens } = useLocale();
  const styles = createStyles(tokens);
  const title = data.position ? `${labels.coverLetter} ${data.position}` : labels.coverLetter;

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{title}</Text>
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
      lineHeight: typography.text.lineHeight,
    },
  });
};
