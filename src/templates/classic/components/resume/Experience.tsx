import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useLocale } from '@template-core/locale-context';
import { RichText } from '@template-core/rich-text';
import { isResumeVisibilityEnabled } from '@template-core/section-utils';
import type { ExperienceItem, ResumeSchema } from '@types';

const ExperienceEntry = ({ experience, debug }: { experience: ExperienceItem; debug: boolean }) => {
  const { tokens } = useLocale();
  const styles = createStyles(tokens);
  const { company, position, location, duration, description, achievements, name } =
    experience as any;

  return (
    <View style={styles.experienceEntry} debug={debug}>
      {/* Position title (bold, primary color) */}
      <Text style={styles.positionTitle}>{position || name.split(' - ')[1]}</Text>

      {/* Company, Location | Date Range row */}
      <View style={styles.companyDateRow}>
        <Text style={styles.companyLocation}>
          {company || name.split(' - ')[0]}, {location}
        </Text>
        <Text style={styles.dateRange}>{duration}</Text>
      </View>

      {/* Description (for independent projects) */}
      {description && <RichText text={description} style={styles.descriptionText} />}

      {/* Achievements bullets */}
      {achievements && achievements.length > 0 && (
        <View>
          {achievements.map((achievement: string, index: number) => (
            <View key={index} style={styles.achievementItem}>
              <Text style={styles.bullet}>•</Text>
              <RichText text={achievement} style={styles.achievementText} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const Experience = ({ resume, debug = false }: { resume: ResumeSchema; debug?: boolean }) => {
  const hasIndependentProjects =
    isResumeVisibilityEnabled(resume, 'independent_projects') &&
    (resume.independent_projects?.length ?? 0) > 0;
  const hasProfessionalExperience =
    isResumeVisibilityEnabled(resume, 'professional_experience') &&
    (resume.professional_experience?.length ?? 0) > 0;
  const { labels, locale, tokens } = useLocale();
  const styles = createStyles(tokens, locale);

  // Don't render if both are empty (should be caught by registry, but defensive check)
  if (!hasIndependentProjects && !hasProfessionalExperience) {
    return null;
  }

  return (
    <View style={styles.container} debug={debug}>
      {hasProfessionalExperience &&
        <>
          <Text style={styles.sectionTitle}>{labels.professionalExperience}</Text>
          <View style={styles.separator} />
          {resume.professional_experience.map((experience, index) => (
            <ExperienceEntry
              key={`${experience.company}-${experience.position}-${index}`}
              experience={experience}
              debug={debug}
            />
          ))}
        </>}

      {hasIndependentProjects && (
        <>
          <Text style={styles.sectionTitle}>{labels.independentProjects}</Text>
          <View style={styles.separator} />

          {resume.independent_projects.map((experience, index) => (
            <ExperienceEntry
              key={`${experience.name}-${experience.location}-${index}`}
              experience={experience}
              debug={debug}
            />
          ))}
        </>
      )}
    </View>
  );
};

export default Experience;

const createStyles = (
  currentTokens: ReturnType<typeof useLocale>['tokens'],
  locale?: ReturnType<typeof useLocale>['locale'],
) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    container: {
      marginBottom: spacing.pagePadding,
    },
    sectionTitle: {
      color: colors.primary,
      fontFamily: typography.fonts.bold,
      fontSize: 11,
      textTransform: locale === 'zh' ? 'none' : 'uppercase',
    },
    experienceEntry: {
      marginBottom: spacing.pagePadding,
    },
    positionTitle: {
      fontFamily: typography.fonts.bold,
      fontSize: typography.text.size,
      color: colors.primary,
      marginBottom: 2,
    },
    companyDateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 4,
    },
    companyLocation: {
      fontFamily: typography.fonts.regular,
      fontSize: typography.text.size,
      color: colors.darkGray,
    },
    dateRange: {
      fontSize: typography.text.size,
      color: colors.mediumGray,
      textAlign: 'right',
    },
    achievementItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 1,
    },
    bullet: {
      fontSize: typography.text.size,
      color: colors.darkGray,
      marginRight: 6,
    },
    achievementText: {
      flex: 1,
      fontSize: typography.small.fontSize,
      color: colors.darkGray,
      lineHeight: typography.text.lineHeight,
    },
    descriptionText: {
      fontSize: typography.text.size,
      color: colors.darkGray,
      lineHeight: typography.text.lineHeight,
      marginBottom: 4,
    },
    separator: {
      width: '100%',
      borderBottom: `1px solid ${colors.separatorGray}`,
      paddingTop: spacing.pagePadding / 2,
      marginBottom: spacing.pagePadding / 2,
    },
  });
};
