import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import { dump } from 'js-yaml';
import { createValidApplicationData } from '../helpers/test-utils';

const projectRoot = process.cwd();
const tailorBase = join(projectRoot, 'resume-data', 'tailor');
const profileBase = join(projectRoot, 'resume-data', 'profiles');
const tmpDir = join(projectRoot, 'tmp');

const tempCompany = `e2e-classic-profile-${Date.now()}`;
const tempProfileName = `e2e-classic-profile-${Date.now()}`;
const tempCompanyDir = join(tailorBase, tempCompany);
const tempProfilePath = join(profileBase, `${tempProfileName}.yaml`);
const tempPdfPath = join(tmpDir, `resume-${tempCompany}.pdf`);

const runGeneratePdf = (...args: string[]) =>
  Bun.spawnSync({
    cmd: ['bun', 'run', 'generate-pdf', ...args],
    cwd: projectRoot,
    stdout: 'pipe',
    stderr: 'pipe',
    env: process.env,
  });

const runShell = (command: string) =>
  Bun.spawnSync({
    cmd: ['zsh', '-lc', command],
    cwd: projectRoot,
    stdout: 'pipe',
    stderr: 'pipe',
    env: process.env,
  });

beforeAll(() => {
  mkdirSync(tempCompanyDir, { recursive: true });

  const data = createValidApplicationData();
  data.metadata.company = tempCompany;
  data.metadata.folder_path = `resume-data/tailor/${tempCompany}`;
  delete (data.metadata as Record<string, unknown>).active_template;
  data.cover_letter.company = tempCompany;
  data.resume.name = '张三';
  data.resume.title = '平台工程师';
  data.resume.summary = '**技术负责人**，持续交付复杂系统。';
  data.resume.profile_picture = 'avatar.png';
  data.resume.languages = [{ language: '英语', proficiency: '熟练' }];
  data.resume.skills = ['Leadership', '沟通协作'];
  data.resume.technical_expertise = [
    { resume_title: '工程体系', skills: ['TypeScript', 'React', '自动化测试'] },
  ];
  data.resume.professional_experience = [
    {
      company: '示例科技',
      position: '平台工程师',
      location: '远程',
      duration: '2022-至今',
      achievements: ['主导 **平台化重构**，交付效率提升 30%'],
    },
  ];
  data.resume.contact = {} as never;
  data.cover_letter.personal_info = {} as never;

  writeFileSync(join(tempCompanyDir, 'metadata.yaml'), dump(data.metadata));
  writeFileSync(join(tempCompanyDir, 'job_analysis.yaml'), dump({ job_analysis: data.job_analysis }));
  writeFileSync(join(tempCompanyDir, 'resume.yaml'), dump({ resume: data.resume }));
  writeFileSync(
    join(tempCompanyDir, 'cover_letter.yaml'),
    dump({ cover_letter: data.cover_letter }),
  );

  writeFileSync(
    tempProfilePath,
    dump({
      name: 'Nathan',
      locale: 'zh',
      theme: 'classic',
      contact: {
        phone: '+86 15605769562',
        email: 'nathan_jobs@fastmail.com',
        github: 'https://github.com/APE-147',
      },
      default_sections: {
        profile_picture: false,
        languages: false,
        soft_skills: false,
      },
    }),
  );
});

afterAll(() => {
  rmSync(tempCompanyDir, { recursive: true, force: true });
  rmSync(tempProfilePath, { force: true });
  rmSync(tempPdfPath, { force: true });
});

describe('generate-pdf classic profile e2e', () => {
  test('renders classic zh resume with locale-aware fonts and section visibility', () => {
    const result = runGeneratePdf('-C', tempCompany, '-P', tempProfileName, '-D', 'resume');

    expect(result.exitCode).toBe(0);
    expect(existsSync(tempPdfPath)).toBe(true);
    expect(statSync(tempPdfPath).size).toBeGreaterThan(1000);

    const pdffonts = runShell(`command -v pdffonts >/dev/null && pdffonts '${tempPdfPath}'`);
    if (pdffonts.exitCode === 0) {
      expect(pdffonts.stdout.toString()).toContain('NotoSansSC');
    }

    const pdftotext = runShell(`command -v pdftotext >/dev/null && pdftotext '${tempPdfPath}' -`);
    if (pdftotext.exitCode === 0) {
      const text = pdftotext.stdout.toString();

      expect(text).toContain('个人简介');
      expect(text).toContain('专业技能');
      expect(text).toContain('工作经历');
      expect(text).toContain('教育背景');
      expect(text).not.toContain('Leadership');
      expect(text).not.toContain('英语');
    }
  });
});
