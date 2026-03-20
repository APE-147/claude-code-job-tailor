import { pipe } from 'remeda';
import { COMPANY_FILES, PATHS } from '@shared/core/config';
import { PathHelpers } from '@shared/core/path-helpers';
import { validateCompanyPath } from './company-validation';
import { chain, chainPipe } from '@shared/core/functional-utils';
import { generateApplicationData } from '@shared/data/data-generation';
import { extractMetadata, generateAndWriteTailorContext } from './context-operations';
import { validateYamlFilesWithProfilePipeline } from './yaml-validation';
import { loadOptionalProfile } from '@shared/data/profile-loader';

// Import centralized types
import type { YamlFilesAndSchemasToWatch, SetContextResult } from './types';

/**
 * Executes the complete tailor context setup pipeline using functional composition.
 *
 * Pipeline flow (with short-circuit on error):
 * 1. Validates company directory exists
 * 2. Validates all required files exist
 * 3. Loads YAML files with wrapper extraction
 * 4. Validates YAML data against Zod schemas
 * 5. Generates TypeScript application data module
 * 6. Extracts metadata from validated files
 * 7. Generates and writes tailor-context.yaml
 *
 * @param {string} environmentName - Company name for context setup
 * @param {YamlFilesAndSchemasToWatch[]} yamlDocumentsToValidate - Files and schemas to validate
 * @returns {SetContextResult} Success with context metadata or error with details
 */
export const validateAndSetTailorEnvPipeline = (
  environmentName: string,
  yamlDocumentsToValidate: YamlFilesAndSchemasToWatch[],
  profileRef?: string,
): SetContextResult => {
  const profileResult = loadOptionalProfile(profileRef);

  if (!profileResult.success) {
    return profileResult;
  }

  return pipe(
    validateCompanyPath(PathHelpers.getCompanyPath(environmentName)),
    (r) =>
      chain(r, () =>
        validateYamlFilesWithProfilePipeline(
          environmentName,
          yamlDocumentsToValidate,
          profileResult.data,
        ),
      ),
    (r) =>
      chain(r, (yamlFiles) =>
        chainPipe(
          yamlFiles,
          (files) => generateApplicationData(environmentName, files),
          (files) => extractMetadata(files, COMPANY_FILES.METADATA),
          (metadata) =>
            generateAndWriteTailorContext(
              environmentName,
              metadata,
              PATHS.CONTEXT_FILE,
              profileRef,
            ),
        ),
      ),
  );
};
