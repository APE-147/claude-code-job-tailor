import React from 'react';
import { Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { RichText } from '@template-core/rich-text';
import { useLocale } from '@template-core/locale-context';
import { isResumeVisibilityEnabled } from '@template-core/section-utils';
import type { ExperienceItem, ResumeSchema } from '@types';

const ExperienceEntry = ({ experience, debug }: { experience: ExperienceItem; debug: boolean }) => {
  const { tokens } = useLocale();
  const styles = createStyles(tokens);
  const {
    company,
    position,
    location,
    duration,
    description,
    company_description,
    achievements,
    name,
    linkedin,
  } = experience as any;

  return (
    <View style={styles.experienceEntry} debug={debug}>
      <View style={styles.companyHeader}>
        <Text style={styles.companyName}>
          {linkedin ? (
            <Link style={styles.companyName} src={linkedin}>
              {company || name.split(' - ')[0]}
            </Link>
          ) : (
            company || name.split(' - ')[0]
          )}
        </Text>
      </View>

      <Text style={styles.positionTitle}>{position || name.split(' - ')[1]}</Text>

      <Text style={styles.dateLocation}>
        {location} | {duration}
      </Text>

      {company_description && <Text style={styles.companyDescription}>{company_description}</Text>}

      {description && <Text style={styles.companyDescription}>{description}</Text>}

      {achievements && achievements.length > 0 && (
        <View>
          {achievements.map((achievement: string, index: number) => (
            <View key={index} style={styles.achievementItem}>
              <View style={styles.bullet} />
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
  const { labels, tokens } = useLocale();
  const styles = createStyles(tokens);

  if (!hasIndependentProjects && !hasProfessionalExperience) {
    return null;
  }

  return (
    <View style={styles.container} debug={debug}>
      {hasIndependentProjects && (
        <>
          <Text style={styles.sectionTitle}>{labels.independentProjects}</Text>
          {resume.independent_projects.map((experience, index) => (
            <ExperienceEntry
              key={`${experience.name}-${experience.location}-${index}`}
              experience={experience}
              debug={debug}
            />
          ))}
        </>
      )}

      {hasProfessionalExperience && (
        <>
          <Text style={styles.sectionTitle}>{labels.professionalExperience}</Text>
          {resume.professional_experience.map((experience, index) => (
            <ExperienceEntry
              key={`${experience.company}-${experience.position}-${index}`}
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

const createStyles = (currentTokens: ReturnType<typeof useLocale>['tokens']) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    container: {
      marginBottom: 0,
      marginRight: spacing.pagePadding / 3,
    },
    sectionTitle: {
      color: colors.primary,
      fontFamily: typography.fonts.bold,
      fontSize: 12,
      marginBottom: spacing.pagePadding / 2,
    },
    experienceEntry: {
      marginBottom: spacing.pagePadding / 2,
    },
    companyHeader: {
      marginBottom: 2,
    },
    companyName: {
      fontFamily: typography.fonts.bold,
      fontSize: 11,
      color: colors.primary,
    },
    positionTitle: {
      fontFamily: typography.fonts.bold,
      fontSize: 9,
      color: colors.darkGray,
      marginBottom: 2,
    },
    dateLocation: {
      fontFamily: typography.fonts.regular,
      fontSize: 9,
      color: colors.mediumGray,
      marginBottom: 4,
    },
    companyDescription: {
      fontFamily: typography.fonts.regular,
      fontSize: 9,
      color: colors.darkGray,
      marginBottom: 6,
      lineHeight: typography.text.lineHeight,
    },
    achievementItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 2,
    },
    bullet: {
      width: 2,
      height: 2,
      backgroundColor: colors.darkGray,
      borderRadius: 500,
      marginRight: 6,
      marginTop: 4,
      flexShrink: 0,
    },
    achievementText: {
      fontFamily: typography.fonts.regular,
      fontSize: 9,
      color: colors.darkGray,
      lineHeight: typography.text.lineHeight,
    },
  });
};
