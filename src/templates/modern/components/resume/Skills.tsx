import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

import { useLocale } from '@template-core/locale-context';
import { isResumeVisibilityEnabled } from '@template-core/section-utils';
import type { ResumeSchema } from '@types';

const TechnicalExpertiseSection = ({ resume }: { resume: ResumeSchema }) => {
  const { labels, tokens } = useLocale();
  const styles = createStyles(tokens);

  // Don't render if no technical expertise
  if (
    !isResumeVisibilityEnabled(resume, 'technical_expertise') ||
    !resume.technical_expertise ||
    resume.technical_expertise.length === 0
  ) {
    return null;
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>{labels.technicalExpertise}</Text>
      {resume.technical_expertise.map((category, index) => (
        <View key={index} style={styles.groupBySection}>
          <Text style={styles.categoryTitle}>{category.resume_title}</Text>
          <View style={styles.skillsList}>
            <Text style={styles.skillText}>{category.skills.join(', ')}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const SoftSkillsSection = ({ resume }: { resume: ResumeSchema }) => {
  const { labels, tokens } = useLocale();
  const styles = createStyles(tokens);

  // Don't render if no soft skills
  if (!isResumeVisibilityEnabled(resume, 'soft_skills') || !resume.skills || resume.skills.length === 0) {
    return null;
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>{labels.softSkills}</Text>
      {resume.skills.map((skill, index) => (
        <View key={index} style={styles.skillItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.skillText}>{skill}</Text>
        </View>
      ))}
    </View>
  );
};

const Skills = ({ resume }: { resume: ResumeSchema }) => {
  const hasTechnicalExpertise =
    isResumeVisibilityEnabled(resume, 'technical_expertise') &&
    (resume.technical_expertise?.length ?? 0) > 0;
  const hasSoftSkills =
    isResumeVisibilityEnabled(resume, 'soft_skills') && (resume.skills?.length ?? 0) > 0;
  const { tokens } = useLocale();
  const styles = createStyles(tokens);

  // Don't render container if both sections are empty
  if (!hasTechnicalExpertise && !hasSoftSkills) {
    return null;
  }

  return (
    <>
      {hasTechnicalExpertise && (
        <View style={styles.container}>
          <TechnicalExpertiseSection resume={resume} />
        </View>
      )}
      {hasSoftSkills && (
        <View style={styles.container}>
          <SoftSkillsSection resume={resume} />
        </View>
      )}
    </>
  );
};

export default Skills;

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
    categoryTitle: {
      fontFamily: typography.fonts.bold,
      fontSize: 8,
      color: colors.darkGray,
      marginBottom: 3,
    },
    groupBySection: {
      marginBottom: spacing.pagePadding / 3,
    },
    skillsList: {
      flexDirection: 'row',
    },
    skillItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 2,
    },
    bullet: {
      width: 8,
      fontSize: 4,
      fontFamily: typography.fonts.regular,
      color: colors.primary,
      paddingTop: 0,
    },
    skillText: {
      flex: 1,
      fontFamily: typography.fonts.regular,
      fontSize: 8,
      lineHeight: typography.text.lineHeight,
      color: colors.primary,
    },
  });
};
