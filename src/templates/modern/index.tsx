import React from 'react';
import { type TailorThemeProps, type ResumeSchema, type CoverLetterSchema } from '@/types';
import { WithPDFWrapper } from '@template-core/with-pdf-wrapper';
import { Resume, resumeConfig } from './resume';
import { CoverLetter, coverLetterConfig } from './cover-letter';

// Wrapped Resume component using render prop pattern
const ResumeDocument = ({
  data,
  locale,
}: {
  data?: ResumeSchema;
  locale?: 'en' | 'zh';
}): React.ReactElement => (
  <WithPDFWrapper data={data} config={resumeConfig}>
    {(transformedData) => <Resume data={transformedData} locale={locale} />}
  </WithPDFWrapper>
);

// Wrapped CoverLetter component using render prop pattern
const CoverLetterDocument = ({
  data,
  locale,
}: {
  data?: CoverLetterSchema;
  locale?: 'en' | 'zh';
}): React.ReactElement => (
  <WithPDFWrapper data={data} config={coverLetterConfig}>
    {(transformedData) => <CoverLetter data={transformedData} locale={locale} />}
  </WithPDFWrapper>
);

const modernTheme: TailorThemeProps = {
  id: 'modern',
  name: 'Modern',
  description: 'A clean, modern template design',
  documents: ['resume', 'cover-letter'] as const,
  components: {
    resume: ResumeDocument,
    coverLetter: CoverLetterDocument,
  },
  initialize: () => {
    // Font registration must happen after locale is known.
  },
};

export default modernTheme;
