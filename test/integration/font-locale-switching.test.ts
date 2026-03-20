import React from 'react';
import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { renderToFile, type DocumentProps } from '@react-pdf/renderer';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { themes } from '../../src/templates';
import { registerFonts } from '../../src/templates/shared/fonts-register';
import { createValidApplicationData } from '../helpers/test-utils';

const tmpDir = join(process.cwd(), 'tmp', `font-switch-${Date.now()}`);
const zhPdfPath = join(tmpDir, 'resume-zh.pdf');
const enPdfPath = join(tmpDir, 'resume-en.pdf');

const runShell = (command: string) =>
  Bun.spawnSync({
    cmd: ['zsh', '-lc', command],
    cwd: process.cwd(),
    stdout: 'pipe',
    stderr: 'pipe',
    env: process.env,
  });

beforeAll(() => {
  mkdirSync(tmpDir, { recursive: true });
});

afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe('font registration locale switching', () => {
  test('renders zh then en in the same process without family collision', async () => {
    const base = createValidApplicationData();
    const modernTheme = themes.modern;

    if (!modernTheme) {
      throw new Error('modern theme is required for font locale switching test');
    }
    const zhResume = {
      ...base.resume,
      locale: 'zh' as const,
      name: '张晨',
      title: '前端工程师',
      summary: '负责多语言简历系统与 PDF 渲染稳定性。',
      profile_picture: undefined,
      contact: {
        ...base.resume.contact,
        address: '上海市徐汇区',
      },
      skills: ['跨语言排版', '字体治理'],
      languages: [
        {
          language: '中文',
          proficiency: '母语',
        },
      ],
    };
    const enResume = {
      ...base.resume,
      locale: 'en' as const,
      name: 'Jane Doe',
      title: 'Platform Engineer',
      summary: 'Built resilient resume rendering for multilingual PDF generation.',
      profile_picture: undefined,
      skills: ['internationalization', 'pdf rendering'],
      languages: [
        {
          language: 'English',
          proficiency: 'Native',
        },
      ],
    };

    registerFonts('zh');
    await renderToFile(
      React.createElement(modernTheme.components.resume, {
        data: zhResume,
        locale: 'zh',
      }) as unknown as React.ReactElement<DocumentProps>,
      zhPdfPath,
    );

    registerFonts('en');
    await renderToFile(
      React.createElement(modernTheme.components.resume, {
        data: enResume,
        locale: 'en',
      }) as unknown as React.ReactElement<DocumentProps>,
      enPdfPath,
    );

    expect(existsSync(zhPdfPath)).toBe(true);
    expect(existsSync(enPdfPath)).toBe(true);

    const pdffonts = runShell('command -v pdffonts >/dev/null');
    if (pdffonts.exitCode === 0) {
      expect(runShell(`pdffonts '${zhPdfPath}'`).stdout.toString()).toContain('NotoSansSC');
      expect(runShell(`pdffonts '${enPdfPath}'`).stdout.toString()).toContain('Lato');
    }

    const pdftotext = runShell('command -v pdftotext >/dev/null');
    if (pdftotext.exitCode === 0) {
      expect(runShell(`pdftotext '${zhPdfPath}' -`).stdout.toString()).toContain('张晨');
      const enText = runShell(`pdftotext '${enPdfPath}' -`).stdout.toString();
      expect(enText).toContain('JANE DOE');
      expect(enText).toContain('Platform Engineer');
    }
  });
});
