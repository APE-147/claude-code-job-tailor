import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import type { CoverLetterSchema } from '@types';

const Body = ({ data }: { data: CoverLetterSchema }) => {
  const { locale, tokens } = useLocale();
  const styles = createStyles(tokens, locale);

  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.paragraph}>{data.content.opening_line}</Text>
      {data.content.body.map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
    </View>
  );
};

export default Body;

const createStyles = (
  currentTokens: ReturnType<typeof useLocale>['tokens'],
  locale: ReturnType<typeof useLocale>['locale'],
) => {
  const { colors, spacing, typography } = currentTokens;
  const isZh = locale === 'zh';

  return StyleSheet.create({
    bodyContainer: {
      flexDirection: 'column',
      marginBottom: spacing.pagePadding / 2,
    },
    paragraph: {
      fontSize: isZh ? 9 : 10,
      fontFamily: typography.fonts.regular,
      color: colors.primary,
      marginBottom: spacing.pagePadding / 3,
      lineHeight: isZh ? 1.4 : 1.5,
    },
  });
};
