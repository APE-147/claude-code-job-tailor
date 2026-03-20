import { z } from 'zod';
import { LocaleSchema, ResumeSectionVisibilitySchema } from './schemas';
import { TemplateThemeEnum } from './tailor-context-schema';

const ProfileDefaultSectionsSchema = ResumeSectionVisibilitySchema.pick({
  profile_picture: true,
  languages: true,
  soft_skills: true,
});

export const ProfileSchema = z.object({
  name: z.string().min(1),
  locale: LocaleSchema,
  theme: TemplateThemeEnum.default('modern'),
  contact: z.object({
    phone: z.string().min(1),
    email: z.string().email(),
    address: z.string().min(1).optional(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
  }),
  default_sections: ProfileDefaultSectionsSchema.optional(),
  section_visibility: ResumeSectionVisibilitySchema.optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;
