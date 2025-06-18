import { z } from 'zod';

// --- User ---
export const KworkProjectUserSchema = z.object({
  username: z.string(),
  data: z.object({
    wants_count: z.string(),
    wants_hired_percent: z.string(),
  }),
});

// --- Project  ---
export const KworkProjectDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  priceLimit: z.string(),
  kwork_count: z.number(),
  user: KworkProjectUserSchema,
});

// --- Pagination ---
export const KworkPaginationSchema = z.object({
  data: z.array(z.unknown()), // z.unknown - мы валидируем элементы отдельно!
  next_page_url: z.string().nullable().optional(),
});

// --- API response ---
export const KworkApiResponseDtoSchema = z.object({
  success: z.boolean(),
  data: z.object({
    pagination: KworkPaginationSchema,
  }),
});

// --- Типы для импорта ---
export type KworkProjectUser = z.infer<typeof KworkProjectUserSchema>;
export type KworkProjectDto = z.infer<typeof KworkProjectDtoSchema>;
export type KworkApiResponseDto = z.infer<typeof KworkApiResponseDtoSchema>;
