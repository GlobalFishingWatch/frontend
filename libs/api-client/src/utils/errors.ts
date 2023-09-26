import { ResponseError, V2MetadataError } from '../api-client'

export const parseAPIErrorStatus = (error: ResponseError) => {
  return error.status || (error as any).code
}

export const parseAPIErrorMessage = (error: ResponseError) => {
  if (error.messages?.length) {
    return error.messages[0]?.detail
  }
  return error.message
}

export const parseAPIErrorMetadata = (error: ResponseError) => {
  if (error.messages?.length) {
    return error.messages[0]?.metadata
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
  return error?.status === 401 || error?.status === 403
}
