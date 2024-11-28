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

export const getIsConcurrentError = (error?: ResponseError | { status?: number }) =>
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

export type ParsedAPIError = { status: number; message: string; metadata?: V2MetadataError }
export const parseAPIError = (error: ResponseError): ParsedAPIError => {
  const metadata = parseAPIErrorMetadata(error)
  return {
    status: parseAPIErrorStatus(error),
    message: parseAPIErrorMessage(error),
    ...(metadata && { metadata }),
  }
}

export function isAuthError(error = {} as Partial<ParsedAPIError> | null) {
  return isUnauthorized(error) || isForbidden(error)
}

export function isUnauthorized(error = {} as Partial<ParsedAPIError> | null) {
  return error?.status === 401
}

export function isForbidden(error = {} as Partial<ParsedAPIError> | null) {
  return error?.status === 403
}
