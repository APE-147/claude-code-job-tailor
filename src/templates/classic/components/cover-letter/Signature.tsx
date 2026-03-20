import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import type { CoverLetterSchema } from '@types';
const Signature = ({ data }: { data: CoverLetterSchema }) => {
  const { tokens } = useLocale();
  const styles = createStyles(tokens);

  return (
    <View style={styles.signatureContainer}>
      <Text style={styles.candidateName}>{data.content.signature}</Text>
    </View>
  );
};

export default Signature;

const createStyles = (currentTokens: ReturnType<typeof useLocale>['tokens']) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    signatureContainer: {
      flexDirection: 'column',
      marginTop: spacing.pagePadding / 2,
    },
    candidateName: {
      fontSize: typography.text.size,
      fontFamily: typography.fonts.regular,
      color: colors.primary,
      lineHeight: typography.text.lineHeight,
    },
  });
};
