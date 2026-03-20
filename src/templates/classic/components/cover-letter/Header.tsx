import React from 'react';
import { Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import type { CoverLetterSchema } from '@types';
const Header = ({ data }: { data: CoverLetterSchema }) => {
  const { tokens } = useLocale();
  const styles = createStyles(tokens);

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.companyArea}>
          <Text style={styles.companyName}>{data.company}</Text>
        </View>

        <View style={styles.contactArea}>
          <Text style={styles.contactName}>{data.name}</Text>
          {data.personal_info.address && (
            <Text style={styles.contactDetails}>{data.personal_info.address}</Text>
          )}
          <Text style={styles.contactDetails}>
            <Link style={styles.contactDetails} src={`mailto:${data.personal_info.email}`}>
              {data.personal_info.email}
            </Link>
          </Text>
          <Text style={styles.contactDetails}>{data.personal_info.phone}</Text>
        </View>
      </View>
      <View style={styles.separatorLine} />
    </View>
  );
};

export default Header;

const createStyles = (currentTokens: ReturnType<typeof useLocale>['tokens']) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.pagePadding / 2,
      width: '100%',
    },
    separatorLine: {
      borderBottom: `1px solid ${colors.separatorGray}`,
      marginBottom: spacing.pagePadding / 2,
      width: '100%',
    },
    companyArea: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    companyName: {
      fontSize: typography.small.fontSize,
      fontFamily: typography.fonts.bold,
      color: colors.darkGray,
    },
    contactArea: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      textAlign: 'right',
    },
    contactName: {
      fontSize: typography.small.fontSize,
      fontFamily: typography.fonts.regular,
      lineHeight: typography.text.lineHeight,
      color: colors.darkGray,
    },
    contactDetails: {
      fontFamily: typography.fonts.regular,
      fontSize: typography.small.fontSize,
      lineHeight: typography.text.lineHeight,
      color: colors.mediumGray,
    },
  });
};
