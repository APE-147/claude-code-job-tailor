import { describe, expect, test } from 'bun:test';
import {
  getProfileSectionVisibility,
  mergeProfileIntoApplicationData,
  mergeProfileIntoLoadedFiles,
  mergeProfileIntoResume,
} from '@shared/data/profile-loader';
import type { Profile } from '@/zod/profile-schema';
import { createValidApplicationData } from '../helpers/test-utils';

const profile: Profile = {
  name: 'Nathan',
  locale: 'zh',
  theme: 'modern',
  contact: {
    phone: '+86 123',
    email: 'nathan@example.com',
    github: 'https://github.com/ape-147',
  },
};

const profileWithVisibility: Profile = {
  ...profile,
  default_sections: {
    profile_picture: false,
    languages: false,
    soft_skills: false,
  },
  section_visibility: {
    education: false,
  },
};

describe('getProfileSectionVisibility', () => {
  test('merges legacy default_sections with section_visibility', () => {
    expect(getProfileSectionVisibility(profileWithVisibility)).toEqual({
      profile_picture: false,
      languages: false,
      soft_skills: false,
      education: false,
    });
  });
});

describe('mergeProfileIntoResume', () => {
  test('fills missing contact fields from profile', () => {
    const resume = {
      ...createValidApplicationData().resume,
      contact: {
        phone: '+61 999',
        email: 'resume@example.com',
      },
    };

    const result = mergeProfileIntoResume(profile, resume);

    expect(result.contact.phone).toBe('+61 999');
    expect(result.contact.email).toBe('resume@example.com');
    expect(result.contact.github).toBe('https://github.com/ape-147');
  });

  test('sets locale from profile when resume has none', () => {
    const resume = createValidApplicationData().resume;
    delete resume.locale;

    const result = mergeProfileIntoResume(profile, resume);

    expect(result.locale).toBe('zh');
  });

  test('does not override resume locale', () => {
    const resume = {
      ...createValidApplicationData().resume,
      locale: 'en' as const,
    };

    const result = mergeProfileIntoResume(profile, resume);

    expect(result.locale).toBe('en');
  });

  test('applies profile section visibility defaults', () => {
    const result = mergeProfileIntoResume(profileWithVisibility, createValidApplicationData().resume);

    expect(result.section_visibility).toEqual({
      profile_picture: false,
      languages: false,
      soft_skills: false,
      education: false,
    });
  });

  test('resume section visibility overrides profile defaults', () => {
    const resume = {
      ...createValidApplicationData().resume,
      section_visibility: {
        languages: true,
        education: true,
      },
    };

    const result = mergeProfileIntoResume(profileWithVisibility, resume);

    expect(result.section_visibility).toEqual({
      profile_picture: false,
      languages: true,
      soft_skills: false,
      education: true,
    });
  });
});

describe('mergeProfileIntoApplicationData', () => {
  test('merges profile defaults into resume and cover letter', () => {
    const applicationData = createValidApplicationData();
    applicationData.resume.contact.github = undefined;
    applicationData.cover_letter.personal_info.github = undefined;

    const result = mergeProfileIntoApplicationData(profile, applicationData);

    expect(result.resume.locale).toBe('zh');
    expect(result.resume.contact.github).toBe('https://github.com/ape-147');
    expect(result.cover_letter.personal_info.github).toBe('https://github.com/ape-147');
  });
});

describe('mergeProfileIntoLoadedFiles', () => {
  test('applies profile defaults before schema validation', () => {
    const applicationData = createValidApplicationData();
    applicationData.resume.contact.github = undefined;

    const files = [
      {
        fileName: 'resume.yaml' as const,
        path: '/tmp/resume.yaml',
        type: null as never,
        wrapperKey: 'resume',
        data: applicationData.resume,
      },
      {
        fileName: 'metadata.yaml' as const,
        path: '/tmp/metadata.yaml',
        type: null as never,
        wrapperKey: null,
        data: applicationData.metadata,
      },
    ];

    const result = mergeProfileIntoLoadedFiles(profile, files);
    const mergedResume = result[0]?.data as typeof applicationData.resume;

    expect(mergedResume.locale).toBe('zh');
    expect(mergedResume.contact.github).toBe('https://github.com/ape-147');
    expect(mergedResume.section_visibility).toBeUndefined();
  });

  test('merges section visibility into loaded resume data', () => {
    const applicationData = createValidApplicationData();

    const files = [
      {
        fileName: 'resume.yaml' as const,
        path: '/tmp/resume.yaml',
        type: null as never,
        wrapperKey: 'resume',
        data: {
          ...applicationData.resume,
          section_visibility: {
            languages: true,
          },
        },
      },
    ];

    const result = mergeProfileIntoLoadedFiles(profileWithVisibility, files);
    const mergedResume = result[0]?.data as typeof applicationData.resume;

    expect(mergedResume.section_visibility).toEqual({
      profile_picture: false,
      languages: true,
      soft_skills: false,
      education: false,
    });
  });

  test('uses profile theme only when metadata has no active_template', () => {
    const files = [
      {
        fileName: 'metadata.yaml' as const,
        path: '/tmp/metadata.yaml',
        type: null as never,
        wrapperKey: null,
        data: {
          ...createValidApplicationData().metadata,
          active_template: undefined,
        },
      },
    ];

    const result = mergeProfileIntoLoadedFiles(profile, files);
    const metadata = result[0]?.data as { active_template?: string };

    expect(metadata.active_template).toBe('modern');
  });

  test('does not override metadata active_template when already set', () => {
    const files = [
      {
        fileName: 'metadata.yaml' as const,
        path: '/tmp/metadata.yaml',
        type: null as never,
        wrapperKey: null,
        data: {
          ...createValidApplicationData().metadata,
          active_template: 'classic',
        },
      },
    ];

    const result = mergeProfileIntoLoadedFiles(profile, files);
    const metadata = result[0]?.data as { active_template?: string };

    expect(metadata.active_template).toBe('classic');
  });
});
