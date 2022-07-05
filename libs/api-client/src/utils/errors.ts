import { ResponseError } from '../api-client'

export const parseAPIErrorStatus = (error: ResponseError) => {
  return error.status || (error as any).code
}

export const parseAPIErrorMessage = (error: ResponseError) => {
  if (error.messages?.length) {
    return error.messages[0]?.detail
  }
  return error.message
}

export type ParsedAPIError = { code: number; message: string }
export const parseAPIError = (error: ResponseError): ParsedAPIError => ({
  code: parseAPIErrorStatus(error),
  message: parseAPIErrorMessage(error),
})
