import { z } from 'zod'

/** Docker turns an unset build ARG into an empty ENV, so '' counts as not set */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional())

/** 'true' or 'false', anything else throws. Unset or '' gives `fallback` */
const flag = (fallback: boolean) =>
  z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.stringbool({ truthy: ['true'], falsy: ['false'], case: 'sensitive' }).default(fallback)
  )

const clientEnvSchema = z.object({
  VITE_API_GATEWAY: optional(z.url()),
  VITE_PUBLIC_URL: optional(z.string()),
  VITE_WORKSPACE_ENV: optional(z.enum(['development', 'staging', 'production'])),
  VITE_REPORT_DAYS_LIMIT: optional(z.coerce.number().int().positive()),
  VITE_GOOGLE_TAG_MANAGER_ID: optional(z.string().regex(/^GTM-[A-Z0-9]+$/)),
  VITE_GOOGLE_MEASUREMENT_ID: optional(z.string().regex(/^G-[A-Z0-9]+$/)),
  VITE_GOOGLE_ANALYTICS_TEST_MODE: flag(false),
  VITE_I18N_DEBUG: flag(false),
  VITE_PLATFORM_MODE: flag(false),
  VITE_REALTIME_ENABLED: flag(false),
  VITE_SHOW_LEAVE_CONFIRMATION: flag(!import.meta.env.DEV),
  VITE_USE_LOCAL_DATASETS: flag(false),
  VITE_USE_LOCAL_DATAVIEWS: flag(false),
})

export type ClientEnv = z.infer<typeof clientEnvSchema>

/**
 * The `VITE_*` values Vite inlines at build time. Vite's own flags (DEV, PROD, SSR, MODE) stay on `import.meta.env`
 */
export const clientEnv: ClientEnv = clientEnvSchema.parse(import.meta.env)
