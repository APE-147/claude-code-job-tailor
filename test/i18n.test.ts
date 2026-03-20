import { describe, expect, test } from 'bun:test';
import { detectLocale, getLabels, type Locale } from '../src/templates/shared/i18n';

describe('getLabels', () => {
  test('returns English labels for en', () => {
    const labels = getLabels('en');

    expect(labels.contact).toBe('Contact');
    expect(labels.technicalExpertise).toBe('Technical Expertise');
    expect(labels.softSkills).toBe('Soft Skills');
    expect(labels.languages).toBe('Languages');
    expect(labels.education).toBe('Education');
    expect(labels.independentProjects).toBe('Independent Projects');
    expect(labels.professionalExperience).toBe('Professional Experience');
  });

  test('returns Chinese labels for zh', () => {
    const labels = getLabels('zh');

    expect(labels.contact).toBe('联系方式');
    expect(labels.education).toBe('教育背景');
    expect(labels.independentProjects).toBe('独立项目');
    expect(labels.professionalExperience).toBe('工作经历');
  });

  test('defaults to en for unknown locale', () => {
    expect(getLabels('fr' as Locale).contact).toBe('Contact');
  });
});

describe('detectLocale', () => {
  test('detects zh from CJK in title', () => {
    expect(detectLocale('Nathan', 'AI 原生实践者')).toBe('zh');
  });

  test('detects en from Latin-only content', () => {
    expect(detectLocale('John Doe', 'Senior Engineer')).toBe('en');
  });

  test('detects zh from CJK in name', () => {
    expect(detectLocale('张三', 'Engineer')).toBe('zh');
  });
});
