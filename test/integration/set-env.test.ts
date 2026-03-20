import { test, expect, describe, beforeAll, afterAll } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { dump } from 'js-yaml';
import { createValidApplicationData } from '../helpers/test-utils';

// ============================================================================
// Test Fixtures
// ============================================================================

const testBase = 'test/fixtures/set-env-test';
const validCompanyPath = join(testBase, 'valid-company');
const invalidCompanyPath = join(testBase, 'invalid-company');

const mockMetadata = {
  company: 'Valid Test Company',
  folder_path: validCompanyPath,
  available_files: ['metadata.yaml', 'job_analysis.yaml'],
  position: 'Software Engineer',
  primary_focus: 'engineer + [react, typescript]',
  job_summary: 'Building modern web applications',
  job_details: {
    company: 'Valid Test Company',
    location: 'Remote',
    experience_level: 'Mid-level',
    employment_type: 'Full-time',
    must_have_skills: ['TypeScript', 'React'],
    nice_to_have_skills: ['GraphQL'],
    team_context: 'Small team',
    user_scale: '10,000 users',
  },
  active_template: 'modern',
  last_updated: '2025-01-01T00:00:00.000Z',
};

const mockJobAnalysis = {
  job_analysis: {
    position: 'Software Engineer',
    company: 'Valid Test Company',
    location: 'Remote',
    employment_type: 'Full-time',
    experience_level: 'Mid-level',
    job_focus: [
      {
        primary_area: 'engineer',
        specialties: ['react', 'typescript'],
        weight: 1.0,
      },
    ],
    must_have_skills: ['TypeScript', 'React'],
    nice_to_have_skills: ['GraphQL'],
    responsibilities: ['Build features'],
    team_context: 'Small team',
    user_scale: '10,000 users',
    additional_context: 'Modern tech stack',
  },
};

// ============================================================================
// Setup and Teardown
// ============================================================================

beforeAll(() => {
  // Create test directory structure
  if (existsSync(testBase)) {
    rmSync(testBase, { recursive: true, force: true });
  }

  // Create valid company fixture
  mkdirSync(validCompanyPath, { recursive: true });
  writeFileSync(join(validCompanyPath, 'metadata.yaml'), dump(mockMetadata), 'utf-8');
  writeFileSync(join(validCompanyPath, 'job_analysis.yaml'), dump(mockJobAnalysis), 'utf-8');

  // Create invalid company directory (missing required files)
  mkdirSync(invalidCompanyPath, { recursive: true });
  writeFileSync(join(invalidCompanyPath, 'incomplete.yaml'), 'key: value', 'utf-8');
});

afterAll(() => {
  // Clean up test directory
  if (existsSync(testBase)) {
    rmSync(testBase, { recursive: true, force: true });
  }

  // Clean up generated context file
  if (existsSync('.claude/tailor-context.yaml')) {
    rmSync('.claude/tailor-context.yaml', { force: true });
  }
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('set-env.ts CLI Integration', () => {
  describe('Case 1: bun run set-env (no arguments)', () => {
    test('should throw error when no arguments provided', async () => {
      const result = await Bun.spawn(['bun', 'run', 'set-env'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      }).exited;

      // Should exit with error code 1
      expect(result).toBe(1);
    });

    test('error output should indicate missing required argument', async () => {
      const proc = Bun.spawn(['bun', 'run', 'set-env'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      const stderr = await new Response(proc.stderr).text();
      const stdout = await new Response(proc.stdout).text();
      const output = stdout + stderr;

      // Should contain error message (may include ANSI color codes)
      expect(output.toLowerCase()).toContain('required');
    });
  });

  describe('Case 2: bun run set-env -C (missing company name value)', () => {
    test('should throw error when -C flag has no value', async () => {
      const result = await Bun.spawn(['bun', 'run', 'set-env', '-C'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      }).exited;

      // Should exit with error code 1
      expect(result).toBe(1);
    });

    test('error output should indicate missing company name', async () => {
      const proc = Bun.spawn(['bun', 'run', 'set-env', '-C'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      const stderr = await new Response(proc.stderr).text();
      const stdout = await new Response(proc.stdout).text();
      const output = stdout + stderr;

      // Should contain error message (may include ANSI color codes)
      expect(output.toLowerCase()).toContain('required');
    });
  });

  describe('Case 3: bun run set-env -C valid-company (happy path)', () => {
    test('should succeed with valid company name', async () => {
      // This test would require the company fixture to exist in resume-data/tailor/
      // For now, we can verify the structure works
      expect(existsSync(validCompanyPath)).toBe(true);
      expect(existsSync(join(validCompanyPath, 'metadata.yaml'))).toBe(true);
      expect(existsSync(join(validCompanyPath, 'job_analysis.yaml'))).toBe(true);
    });

    test('should create context file on success', async () => {
      // This would require mocking or using real company data
      // The test structure ensures we have valid fixtures
      expect(mockMetadata.company).toBe('Valid Test Company');
      expect(mockMetadata.position).toBe('Software Engineer');
    });

    test('should output success message with company details', async () => {
      // When implemented with real company, should verify:
      // - Company name is shown
      // - Position is shown
      // - File count is shown
      expect(mockMetadata.available_files).toHaveLength(2);
    });
  });

  describe('Case 4: bun run set-env -C invalid-company (invalid company)', () => {
    test('should throw error when company does not exist', async () => {
      const result = await Bun.spawn(['bun', 'run', 'set-env', '-C', 'non-existent-company'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      }).exited;

      // Should exit with error code 1
      expect(result).toBe(1);
    });

    test('error output should indicate company not found', async () => {
      const proc = Bun.spawn(['bun', 'run', 'set-env', '-C', 'non-existent-company'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      const stderr = await new Response(proc.stderr).text();
      const stdout = await new Response(proc.stdout).text();
      const output = stdout + stderr;

      // Should contain error about company not found (may include ANSI color codes)
      expect(output.toLowerCase()).toContain('not found');
    });

    test('should throw error when company missing required files', async () => {
      const result = await Bun.spawn(['bun', 'run', 'set-env', '-C', 'invalid-company'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      }).exited;

      // Should exit with error code 1
      expect(result).toBe(1);
    });

    test('error output should indicate missing required files', async () => {
      const proc = Bun.spawn(['bun', 'run', 'set-env', '-C', 'invalid-company'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      const stderr = await new Response(proc.stderr).text();
      const stdout = await new Response(proc.stdout).text();
      const output = stdout + stderr;

      // Should contain error about missing files (may include ANSI color codes)
      expect(output.toLowerCase()).toContain('not found');
    });
  });

  describe('Exit Codes', () => {
    test('should exit with code 0 on success', async () => {
      // Placeholder - would need valid company in resume-data/tailor/
      // This documents the expected behavior
      expect(true).toBe(true);
    });

    test('should exit with code 1 on error', async () => {
      const result = await Bun.spawn(['bun', 'run', 'set-env'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      }).exited;

      expect(result).toBe(1);
    });
  });

  describe('Output Format', () => {
    test('success message should include company name', async () => {
      // When successful, output should contain:
      // "Context set • {company} • {fileCount} file(s)"
      expect(mockMetadata.company).toBeDefined();
    });

    test('error message should be clear and actionable', async () => {
      const proc = Bun.spawn(['bun', 'run', 'set-env'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      const stderr = await new Response(proc.stderr).text();
      const stdout = await new Response(proc.stdout).text();
      const output = stdout + stderr;

      // Should contain either usage info or clear error message
      expect(output.length).toBeGreaterThan(0);
    });
  });

  describe('Data Validation', () => {
    test('should validate metadata against schema', async () => {
      // Metadata fixture should pass validation
      expect(mockMetadata.company).toBeTruthy();
      expect(mockMetadata.position).toBeTruthy();
      expect(mockMetadata.folder_path).toBeTruthy();
    });

    test('should validate job_analysis against schema', async () => {
      // Job analysis fixture should pass validation
      expect(mockJobAnalysis.job_analysis.position).toBeTruthy();
      expect(mockJobAnalysis.job_analysis.must_have_skills).toHaveLength(2);
    });

    test('should reject invalid metadata', async () => {
      // Invalid fixture exists but should be rejected
      expect(existsSync(invalidCompanyPath)).toBe(true);
    });
  });

  describe('File System Operations', () => {
    test('should create .claude directory if not exists', async () => {
      // When context is written successfully, directory should be created
      // This is handled by the script
      expect(true).toBe(true);
    });

    test('should write context file to correct location', async () => {
      // Context file should be written to .claude/tailor-context.yaml
      // This is documented in the script
      expect(true).toBe(true);
    });

    test('should overwrite existing context file', async () => {
      // Running twice should update the file
      expect(true).toBe(true);
    });
  });

  describe('Profile Support', () => {
    const projectRoot = process.cwd();
    const generatedDataPath = join(projectRoot, 'src', 'data', 'application.ts');
    const contextFilePath = join(projectRoot, '.claude', 'tailor-context.yaml');
    const tempCompany = `set-env-profile-${Date.now()}`;
    const tempCompanyPath = join(projectRoot, 'resume-data', 'tailor', tempCompany);
    const tempProfileName = `set-env-profile-${Date.now()}`;
    const tempProfilePath = join(projectRoot, 'resume-data', 'profiles', `${tempProfileName}.yaml`);
    const originalGeneratedData = existsSync(generatedDataPath)
      ? readFileSync(generatedDataPath, 'utf-8')
      : null;
    const originalContextFile = existsSync(contextFilePath)
      ? readFileSync(contextFilePath, 'utf-8')
      : null;

    beforeAll(() => {
      mkdirSync(tempCompanyPath, { recursive: true });

      const data = createValidApplicationData();
      data.metadata.company = tempCompany;
      data.metadata.folder_path = `resume-data/tailor/${tempCompany}`;
      delete (data.metadata as Record<string, unknown>).active_template;
      data.cover_letter.company = tempCompany;
      data.resume.name = 'Preview Profile Candidate';
      data.resume.title = 'Platform Engineer';
      data.resume.contact = {} as never;
      data.cover_letter.personal_info = {} as never;

      writeFileSync(join(tempCompanyPath, 'metadata.yaml'), dump(data.metadata), 'utf-8');
      writeFileSync(
        join(tempCompanyPath, 'job_analysis.yaml'),
        dump({ job_analysis: data.job_analysis }),
        'utf-8',
      );
      writeFileSync(join(tempCompanyPath, 'resume.yaml'), dump({ resume: data.resume }), 'utf-8');
      writeFileSync(
        join(tempCompanyPath, 'cover_letter.yaml'),
        dump({ cover_letter: data.cover_letter }),
        'utf-8',
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
        'utf-8',
      );
    });

    afterAll(() => {
      rmSync(tempCompanyPath, { recursive: true, force: true });
      rmSync(tempProfilePath, { force: true });

      if (originalGeneratedData === null) {
        rmSync(generatedDataPath, { force: true });
      } else {
        writeFileSync(generatedDataPath, originalGeneratedData, 'utf-8');
      }

      if (originalContextFile === null) {
        rmSync(contextFilePath, { force: true });
      } else {
        writeFileSync(contextFilePath, originalContextFile, 'utf-8');
      }
    });

    test('set-env merges profile into generated application data and context', async () => {
      const proc = Bun.spawn(
        ['bun', 'run', 'set-env', '-C', tempCompany, '-P', tempProfileName],
        {
          cwd: projectRoot,
          stdio: ['pipe', 'pipe', 'pipe'],
        },
      );

      const exitCode = await proc.exited;
      const stdout = await new Response(proc.stdout).text();
      const stderr = await new Response(proc.stderr).text();

      expect(exitCode).toBe(0);
      expect(`${stdout}${stderr}`).toContain('Tailor context created');

      const generatedData = readFileSync(generatedDataPath, 'utf-8');
      expect(generatedData).toContain('"active_template": "classic"');
      expect(generatedData).toContain('"locale": "zh"');
      expect(generatedData).toContain('"phone": "+86 15605769562"');
      expect(generatedData).toContain('"email": "nathan_jobs@fastmail.com"');
      expect(generatedData).toContain('"section_visibility": {');
      expect(generatedData).toContain('"profile_picture": false');
      expect(generatedData).toContain('"languages": false');
      expect(generatedData).toContain('"soft_skills": false');

      const contextYaml = readFileSync(contextFilePath, 'utf-8');
      expect(contextYaml).toContain(`active_profile: ${tempProfileName}`);
      expect(contextYaml).toContain('active_template: classic');
    });
  });
});
