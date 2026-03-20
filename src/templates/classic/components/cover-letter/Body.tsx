import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import { RichText } from '@template-core/rich-text';
import type { CoverLetterSchema } from '@types';

const Body = ({ data }: { data: CoverLetterSchema }) => {
  const { tokens } = useLocale();
  const styles = createStyles(tokens);

  return (
    <View style={styles.bodyContainer}>
      <RichText text={data.content.opening_line} style={styles.paragraph} />
      {data.content.body.map((paragraph, index) => (
        <RichText key={index} text={paragraph} style={styles.paragraph} />
      ))}
    </View>
  );
};

export default Body;

const createStyles = (currentTokens: ReturnType<typeof useLocale>['tokens']) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    bodyContainer: {
      flexDirection: 'column',
      marginBottom: spacing.pagePadding / 2,
    },
    paragraph: {
      fontSize: typography.text.size,
      fontFamily: typography.fonts.regular,
      color: colors.primary,
      marginBottom: spacing.pagePadding / 3,
      lineHeight: typography.text.lineHeight,
    },
  });
};
