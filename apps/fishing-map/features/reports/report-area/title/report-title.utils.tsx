import type { Report } from '@globalfishingwatch/api-types'

import type { Locale } from 'types'

export function getReportAreaStringByLocale(
  string: Report['name'] | Report['description'],
  locale = 'en' as Locale | string
) {
  if (!string) {
    return ''
  }
  try {
    let parsedResponse = string
    if (string.startsWith('```json') || (string.startsWith('{') && string.endsWith('}'))) {
      const jsonString = string.replace('```json\n', '').replace('\n```', '').trim()
      parsedResponse = JSON.parse(jsonString)
      if (parsedResponse[locale as any]) {
        return parsedResponse[locale as any] as string
      }
      return parsedResponse[Object.keys(parsedResponse)[0] as keyof typeof parsedResponse] as string
    }
    return parsedResponse
  } catch (_: any) {
    return string
  }
}
