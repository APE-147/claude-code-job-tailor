import React from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { getElementVisibility } from '@template-core/section-utils';
import { RichText } from '@template-core/rich-text';
import { useLocale } from '@template-core/locale-context';
import type { ResumeSchema, ResumeSectionConfig } from '@types';

const Header = ({ resume, section }: { resume: ResumeSchema; section?: ResumeSectionConfig }) => {
  const { locale, tokens } = useLocale();
  const styles = createStyles(tokens, locale);

  // Check element-level visibility for profile picture
  const showProfilePicture =
    section && getElementVisibility(section, 'profile-picture', resume) && resume.profile_picture;

  return (
    <View>
      {/* Main header content */}
      <View style={styles.headerContainer}>
        {/* Content area with name, title, summary */}
        <View style={styles.contentArea}>
          <Text style={styles.name}>{resume.name}</Text>
          <Text style={styles.position}>{resume.title}</Text>
        </View>

        {/* Conditional profile picture rendering with element-level visibility */}
        {showProfilePicture && (
          <View style={styles.profileArea}>
            <Image src={resume.profile_picture} style={styles.profileImage} />
          </View>
        )}
      </View>

      {/* Conditional summary rendering */}
      {resume.summary && (
        <View style={styles.summaryContainer}>
          <RichText text={resume.summary} style={styles.summary} />
        </View>
      )}
    </View>
  );
};

export default Header;

const createStyles = (
  currentTokens: ReturnType<typeof useLocale>['tokens'],
  locale: ReturnType<typeof useLocale>['locale'],
) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    headerContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.pagePadding / 1.5,
    },
    summaryContainer: {
      width: '100%',
      paddingTop: spacing.pagePadding / 2,
      paddingBottom: spacing.pagePadding / 2,
      borderBottom: `1px solid ${colors.separatorGray}`,
      borderTop: `1px solid ${colors.separatorGray}`,
    },
    profileArea: {
      top: 0,
      right: 0,
      width: spacing.profileImageSize,
      height: spacing.profileImageSize,
      position: 'absolute',
    },
    profileImage: {
      width: spacing.profileImageSize,
      height: spacing.profileImageSize,
      borderRadius: spacing.profileImageSize / 2,
    },
    contentArea: {
      flex: 1,
      paddingRight: spacing.profileImageSize + spacing.pagePadding,
    },
    name: {
      color: colors.primary,
      fontSize: 22,
      fontFamily: typography.fonts.bold,
      textTransform: locale === 'zh' ? 'none' : 'uppercase',
      marginBottom: 2,
    },
    position: {
      color: colors.mediumGray,
      fontSize: 14,
      fontFamily: typography.fonts.bold,
      textTransform: locale === 'zh' ? 'none' : 'capitalize',
      marginBottom: 0,
    },
    summary: {
      color: colors.darkGray,
      fontSize: 10,
      fontFamily: typography.fonts.regular,
      lineHeight: locale === 'zh' ? 1.5 : 1.4,
    },
  });
};
