import React from 'react';
import { Page, View, StyleSheet } from '@react-pdf/renderer';

import { getModernTokens } from '@template-core/design-tokens';
import { LocaleProvider } from '@template-core/locale-context';
import { detectLocale, type Locale } from '@template-core/i18n';
import type { ResumeSchema, ReactPDFProps } from '@types';

// Import section registry and utilities
import { RESUME_SECTIONS } from './section-registry';
import { getVisibleResumeSectionsByColumn } from '@template-core/section-utils';

/**
 * Configuration for the Resume document wrapper
 */
export const resumeConfig = {
  getDocumentProps: (data: ResumeSchema) => ({
    title: 'Resume',
    author: data.name,
    subject: `The resume of ${data.name}`,
  }),
  transformData: (data: ResumeSchema) => data,
  emptyStateMessage:
    'No resume data available. Please ensure source files exist or use -C flag to specify a company folder.',
};

/**
 * Resume PDF Component with dynamic section rendering
 * 72 dpi is the default for PDF
 * Ensure A4 page sizing (595.5 × 842.25 points)
 */
export const Resume = ({
  size = 'A4',
  orientation = 'portrait',
  wrap = true,
  debug = false,
  dpi = 72,
  bookmark,
  data,
  locale,
}: ReactPDFProps) => {
  const resumeData = data as ResumeSchema;
  const resolvedLocale: Locale = locale ?? resumeData.locale ?? detectLocale(resumeData.name, resumeData.title);
  const currentTokens = getModernTokens(resolvedLocale);
  const styles = createStyles(currentTokens);

  // Get visible sections organized by column
  const headerSections = getVisibleResumeSectionsByColumn(RESUME_SECTIONS, resumeData, 'header');
  const leftSections = getVisibleResumeSectionsByColumn(RESUME_SECTIONS, resumeData, 'left');
  const rightSections = getVisibleResumeSectionsByColumn(RESUME_SECTIONS, resumeData, 'right');

  return (
    <LocaleProvider locale={resolvedLocale}>
      <Page
        size={size}
        orientation={orientation}
        wrap={wrap}
        debug={debug}
        dpi={dpi}
        bookmark={bookmark}
        style={styles.page}
      >
        {headerSections.map((section) => {
          return (
            <section.component
              key={section.id}
              resume={resumeData}
              debug={debug}
              section={section}
            />
          );
        })}

        <View style={styles.container}>
          <View style={styles.leftColumn} debug={debug}>
            {leftSections.map((section) => {
              return <section.component key={section.id} resume={resumeData} debug={debug} />;
            })}
          </View>

          <View style={styles.rightColumn}>
            {rightSections.map((section) => {
              return <section.component key={section.id} resume={resumeData} debug={debug} />;
            })}
          </View>
        </View>
      </Page>
    </LocaleProvider>
  );
};

const createStyles = (currentTokens: ReturnType<typeof getModernTokens>) => {
  const { colors, spacing, typography } = currentTokens;

  return StyleSheet.create({
    page: {
      fontFamily: typography.text.fontFamily,
      padding: spacing.documentPadding,
      color: colors.darkGray,
    },
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    leftColumn: {
      flexDirection: 'column',
      width: spacing.columnWidth,
      paddingTop: spacing.pagePadding,
      paddingRight: spacing.pagePadding,
      borderRight: `1px solid ${colors.separatorGray}`,
    },
    rightColumn: {
      flex: 1,
      flexDirection: 'column',
      paddingLeft: spacing.pagePadding,
      paddingTop: spacing.pagePadding,
    },
  });
};
