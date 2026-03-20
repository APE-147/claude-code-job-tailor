import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import type { CoverLetterSchema } from '@types';

const DateLine = ({ data }: { data: CoverLetterSchema }) => {
  const { tokens } = useLocale();
  const styles = createStyles(tokens);

  return (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>{data.date}</Text>
    </View>
  );
};

export default DateLine;

const createStyles = (currentTokens: ReturnType<typeof useLocale>['tokens']) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    dateContainer: {
      flexDirection: 'row',
      marginBottom: spacing.pagePadding * 1.5,
    },
    dateText: {
      fontSize: 9,
      fontFamily: typography.fonts.regular,
      color: colors.mediumGray,
    },
  });
};
