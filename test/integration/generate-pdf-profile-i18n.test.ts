import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import { dump } from 'js-yaml';
import { createValidApplicationData } from '../helpers/test-utils';

const projectRoot = process.cwd();
const tailorBase = join(projectRoot, 'resume-data', 'tailor');
const tmpDir = join(projectRoot, 'tmp');
const tempCompany = `e2e-profile-merge-${Date.now()}`;
const tempCompanyDir = join(tailorBase, tempCompany);
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
  data.cover_letter.company = tempCompany;
  data.resume.name = 'Profile Merge Candidate';
  data.resume.title = 'Platform Engineer';
  data.resume.contact = {} as never;
  data.cover_letter.personal_info = {} as never;

  writeFileSync(join(tempCompanyDir, 'metadata.yaml'), dump(data.metadata));
  writeFileSync(join(tempCompanyDir, 'job_analysis.yaml'), dump({ job_analysis: data.job_analysis }));
  writeFileSync(join(tempCompanyDir, 'resume.yaml'), dump({ resume: data.resume }));
  writeFileSync(
    join(tempCompanyDir, 'cover_letter.yaml'),
    dump({ cover_letter: data.cover_letter }),
  );
});

afterAll(() => {
  rmSync(tempCompanyDir, { recursive: true, force: true });
  rmSync(tempPdfPath, { force: true });
});

describe('generate-pdf profile + i18n e2e', () => {
  test('requires profile when required contact fields only exist in profile', () => {
    const withoutProfile = runGeneratePdf('-C', tempCompany, '-D', 'resume');
    expect(withoutProfile.exitCode).not.toBe(0);

    const withProfile = runGeneratePdf('-C', tempCompany, '-P', 'default-en.example', '-D', 'resume');
    expect(withProfile.exitCode).toBe(0);
    expect(existsSync(tempPdfPath)).toBe(true);
    expect(statSync(tempPdfPath).size).toBeGreaterThan(1000);
  });

  test('generates english resume with english section labels when pdftotext is available', () => {
    const pdfPath = join(tmpDir, 'resume-tech-corp.pdf');
    const result = runGeneratePdf('-C', 'tech-corp', '-P', 'default-en.example', '-D', 'resume');

    expect(result.exitCode).toBe(0);
    expect(existsSync(pdfPath)).toBe(true);

    const pdftotext = runShell('command -v pdftotext >/dev/null');
    if (pdftotext.exitCode === 0) {
      const extracted = runShell(`pdftotext '${pdfPath}' -`);
      const text = extracted.stdout.toString();

      expect(text).toContain('Contact');
      expect(text).toContain('Technical Expertise');
    }
  });

  test('generates zh resume successfully with locale profile', () => {
    const pdfPath = join(tmpDir, `resume-${tempCompany}.pdf`);
    const result = runGeneratePdf('-C', tempCompany, '-P', 'default-zh.example', '-D', 'resume');

    expect(result.exitCode).toBe(0);
    expect(existsSync(pdfPath)).toBe(true);
    expect(statSync(pdfPath).size).toBeGreaterThan(1000);

    const pdfinfo = runShell(`command -v pdfinfo >/dev/null && pdfinfo '${pdfPath}'`);
    if (pdfinfo.exitCode === 0) {
      expect(pdfinfo.stdout.toString()).toContain('Pages:');
    }

    const pdffonts = runShell(`command -v pdffonts >/dev/null && pdffonts '${pdfPath}'`);
    if (pdffonts.exitCode === 0) {
      expect(pdffonts.stdout.toString()).toContain('NotoSansSC');
    }
  });
});
