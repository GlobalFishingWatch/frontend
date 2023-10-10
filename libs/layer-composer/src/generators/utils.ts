import { AnyGeneratorConfig, LayerVisibility } from './types'

export function isConfigVisible(config: AnyGeneratorConfig): LayerVisibility {
  return config.visible !== undefined && config.visible !== null
    ? config.visible
      ? 'visible'
      : 'none'
    : 'visible'
}

export const toURLArray = (paramName: string, arr: string[]) => {
  if (!arr?.length) return ''
  return arr
    .flatMap((element, i) => {
      if (!element) return []
      return `${paramName}[${i}]=${element}`
    })
    .join('&')
}

export const addURLSearchParams = (url: URL, key: string, values: any[]): URL => {
  if (!url) {
    console.warn('URL is needed in addUrlSearchParams')
    return url
  }
  if (!key || !values?.length) {
    console.warn('key and values are needed in addUrlSearchParams')
    return url
  }
  values.forEach((value, index) => {
    url.searchParams.set(`${key}[${index}]`, value)
  })
  return url
}
