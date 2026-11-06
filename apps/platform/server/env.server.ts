import { z } from 'zod'

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional())

// Google's documented charset (developers.google.com/sheets/api/guides/concepts).
// Catches a pasted URL or a trailing newline from the secret. Length is undocumented, so not checked
const spreadsheetId = optional(
  z.string().regex(/^[\w-]+$/, 'Expected a Google Sheets id (letters, digits, - and _), not a URL')
)

export const serverEnvSchema = z.object({
  // Without it no human session is accepted (assistant gate)
  HUMAN_SESSION_SECRET: optional(z.string()),
  // Without it SSR token refreshes need a captcha
  GATEWAY_FRONTEND_SECRET: optional(z.string()),
  // Without it every captcha protected request fails
  TURNSTILE_SECRET_KEY: optional(z.string()),
  // Without it CMS content can't be loaded
  STRAPI_URL: optional(z.url()),
  // Without it CMS requests are unauthenticated
  STRAPI_TOKEN: optional(z.string()),
  // Without it CMS preview pages are not available
  STRAPI_PREVIEW_SECRET: optional(z.string()),
  SPREADSHEET_CLIENT_EMAIL: optional(z.email()),
  // Stored with escaped newlines
  SPREADSHEET_PRIVATE_KEY: optional(z.string().transform((key) => key.replace(/\\n/gm, '\n'))),
  DOWNLOAD_SURVEY_SPREADSHEET_ID: spreadsheetId,
  FEEDBACK_SPREADSHEET_ID: spreadsheetId,
  MAP_ERRORS_SPREADSHEET_ID: spreadsheetId,
  DETECTIONS_FEEDBACK_SPREADSHEET_ID: spreadsheetId,
  IDENTITY_REVIEW_SPREADSHEET_ID: spreadsheetId,
  MIGRAMAR_SPREADSHEET_ID: spreadsheetId,
  TURNING_TIDES_BRAZIL_ID: spreadsheetId,
  TURNING_TIDES_CHILE_ID: spreadsheetId,
  TURNING_TIDES_PERU_ID: spreadsheetId,
  TURNING_TIDES_AIS_ID: spreadsheetId,
})

/**
 * Server-only env. A malformed value throws here. `server/env.plugin.ts` imports this module at
 * process start, so the throw stops the container from booting and Cloud Run keeps serving the
 * previous revision. Keys are optional here so dev runs without secrets; the plugin requires all
 * of them in production unless ALLOW_MISSING_SERVER_ENV=true.
 */
export const serverEnv = serverEnvSchema.parse(process.env)
