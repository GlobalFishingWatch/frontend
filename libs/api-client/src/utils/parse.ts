import { ResourceResponseType } from '@globalfishingwatch/api-types'

export const processStatus = (
  response: Response,
  requestStatus?: ResourceResponseType
): Promise<Response> => {
  return new Promise(async (resolve, reject) => {
    const { status, statusText } = response
    try {
      if (response.status >= 200 && response.status < 400) {
        return resolve(response)
      }

      if (requestStatus === 'default') {
        return reject(response)
      }
      // Compatibility with v1 and v2 errors format
      const errors = {
        message: '',
        messages: [],
      }
      if (response.status >= 400 && response.status < 500) {
        await response.text().then((text) => {
          try {
            const res = JSON.parse(text)
            errors.message = res.message
            errors.messages = res.messages
          } catch (e: any) {
            errors.message = statusText
          }
        })
      }
      return reject({
        status,
        message: errors?.message || statusText,
        messages: errors.messages,
      })
    } catch (e: any) {
      return reject({ status, message: statusText })
    }
  })
}

export const parseJSON = (response: Response) => response.json()
