export type Locale = 'en' | 'zh';

export type SectionLabels = {
  contact: string;
  profile: string;
  technicalExpertise: string;
  softSkills: string;
  languages: string;
  education: string;
  independentProjects: string;
  professionalExperience: string;
  coverLetter: string;
};

const LABELS: Record<Locale, SectionLabels> = {
  en: {
    contact: 'Contact',
    profile: 'Profile',
    technicalExpertise: 'Technical Expertise',
    softSkills: 'Soft Skills',
    languages: 'Languages',
    education: 'Education',
    independentProjects: 'Independent Projects',
    professionalExperience: 'Professional Experience',
    coverLetter: 'Cover Letter',
  },
  zh: {
    contact: '联系方式',
    profile: '个人简介',
    technicalExpertise: '专业技能',
    softSkills: '软技能',
    languages: '语言',
    education: '教育背景',
    independentProjects: '独立项目',
    professionalExperience: '工作经历',
    coverLetter: '求职信',
  },
};

const CJK_REGEX = /[\u3400-\u4dbf\u4e00-\u9fff]/;

export const getLabels = (locale: Locale): SectionLabels => LABELS[locale] ?? LABELS.en;

export const detectLocale = (name: string, title: string): Locale =>
  CJK_REGEX.test(`${name} ${title}`) ? 'zh' : 'en';
