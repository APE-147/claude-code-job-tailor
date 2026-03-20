import React from 'react';
import { Text, View, StyleSheet, Link } from '@react-pdf/renderer';

import { useLocale } from '@template-core/locale-context';
import type { ResumeSchema } from '@types';

const Contact = ({ resume }: { resume: ResumeSchema }) => {
  const { contact } = resume;
  const { labels, tokens } = useLocale();
  const styles = createStyles(tokens);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{labels.contact}</Text>

      {/* Phone - Required, always show */}
      <View style={styles.contactItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.contactText}>{contact.phone}</Text>
      </View>

      {/* Email - Required, always show */}
      <View style={styles.contactItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.contactText}>
          <Link style={styles.contactText} src={`mailto:${contact.email}`}>
            {contact.email}
          </Link>
        </Text>
      </View>

      {/* Address - Optional */}
      {contact.address && (
        <View style={styles.contactItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.contactText}>{contact.address}</Text>
        </View>
      )}

      {/* LinkedIn - Optional */}
      {contact.linkedin && (
        <View style={styles.contactItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.contactText}>
            <Link style={styles.contactText} src={contact.linkedin}>
              LinkedIn Profile
            </Link>
          </Text>
        </View>
      )}

      {/* GitHub - Optional */}
      {contact.github && (
        <View style={styles.contactItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.contactText}>
            <Link style={styles.contactText} src={contact.github}>
              Github Profile
            </Link>
          </Text>
        </View>
      )}
    </View>
  );
};

export default Contact;

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
    contactItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.listItemSpacing,
    },
    bullet: {
      width: 8,
      fontSize: 4,
      fontFamily: typography.fonts.regular,
      color: colors.primary,
      paddingTop: 2,
    },
    contactText: {
      flex: 1,
      fontFamily: typography.fonts.regular,
      fontSize: 8,
      lineHeight: typography.text.lineHeight,
      color: colors.primary,
    },
  });
};
