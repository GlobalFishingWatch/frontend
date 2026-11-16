import { CONCURRENT_ERROR_STATUS } from '../config'

export type V2MetadataError = Record<string, any>
export interface V2MessageError {
  detail: string
  title: string
  metadata?: V2MetadataError
}
export interface ResponseError {
  status: number
  message: string
  messages?: V2MessageError[]
}

export const getIsUnauthorizedError = (error?: ResponseError | { status?: number }) =>
  error && error.status && error.status > 400 && error.status < 403

export const getIsRateLimitExceeded = (error?: ResponseError | { status?: number }) =>
  error?.status === CONCURRENT_ERROR_STATUS

// The 524 timeout from cloudfare is not handled properly
// and rejects with a typeError
export const crossBrowserTypeErrorMessages = [
  'Load failed', // Safari
  'Failed to fetch', // Chromium
]
export const getIsTimeoutError = (error?: ResponseError | { message?: string }) => {
  if (!error?.message) return false
  return crossBrowserTypeErrorMessages.some((e) => e.includes(error?.message as string))
}

export const parseAPIErrorStatus = (error: ResponseError) => {
  return error?.status || (error as any).code || null
}

export const parseAPIErrorMessage = (error: ResponseError) => {
  if (error?.messages?.length) {
    return error?.messages[0]?.detail
  }
  return error?.message || ''
}

export const parseAPIErrorMetadata = (error: ResponseError) => {
  if (error?.messages?.length) {
    return error?.messages[0]?.metadata
  }
  return {} as V2MetadataError
}

export type ParsedAPIError = {
  status: number
  message: string
  metadata?: V2MetadataError
  refreshError?: boolean
}
export const parseAPIError = (
  error: ResponseError & { refreshError?: boolean }
): ParsedAPIError => {
  const metadata = parseAPIErrorMetadata(error)
  return {
    status: parseAPIErrorStatus(error),
    message: parseAPIErrorMessage(error),
    ...(metadata && { metadata }),
    ...(error?.refreshError && { refreshError: true }),
  }
}

export function isUnauthorized(error = {} as Partial<ParsedAPIError> | null) {
  return error?.status === 401
}

export function isForbidden(error = {} as Partial<ParsedAPIError> | null) {
  return error?.status === 403
}

export function isAuthError(error = {} as Partial<ParsedAPIError> | null) {
  return isUnauthorized(error) || isForbidden(error)
}

// Answers of the captcha protected requests: 401 rejected token, 503 Turnstile unavailable.
// App servers verifying a captcha must throw these same messages
export const CAPTCHA_ERRORS = {
  invalid: 'invalid captcha',
  unavailable: 'captcha verification unavailable',
} as const
const CAPTCHA_ERROR_MESSAGES = Object.values(CAPTCHA_ERRORS)

// Matched by message, it survives server-fn deserialization like the session messages below
export const isCaptchaError = (error?: { message?: string } | null) =>
  CAPTCHA_ERROR_MESSAGES.some((m) => error?.message?.includes(m))

const NO_SESSION_MESSAGES = [
  'No refresh token',
  'No login token provided',
  'Invalid refresh token',
  'Invalid access token',
] as const

// Auth/session rejection — incl. server-fn errors that lose `status` after deserialization.
// A rejected captcha is a 401 too, but the session is still valid
export function isSessionError(error?: { status?: number; message?: string } | null) {
  if (!error || isCaptchaError(error)) {
    return false
  }
  if (isAuthError(error) || getIsUnauthorizedError(error)) {
    return true
  }
  const message = error.message ?? ''
  return NO_SESSION_MESSAGES.some((m) => message.includes(m))
}

export const isTransientError = (error?: ResponseError | { status?: number; message?: string }) =>
  !isSessionError(error) &&
  (getIsTimeoutError(error) ||
    !(error as { status?: number })?.status ||
    (error as any).status >= 500)
