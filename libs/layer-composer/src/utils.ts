import type { Dictionary, ExtendedLayer } from './types'

export function isUrlAbsolute(url: string) {
  if (!url) {
    throw new Error('Url absolute check needs a proper url')
  }
  return url.indexOf('http://') === 0 || url.indexOf('https://') === 0
}

export const flatObjectArrays = (object = {} as any) => {
  let objectParsed: { [key: string]: any } = {}
  Object.keys(object).forEach((key) => {
    if (object[key] && object[key].length) {
      const arrayObject = Object.fromEntries(
        object[key].map((source: any) => {
          const { id, ...rest } = source
          return [id, rest]
        })
      )
      objectParsed = { ...objectParsed, ...arrayObject }
    } else {
      objectParsed[key] = object[key]
    }
  })
  return objectParsed
}

export const layersDictToArray = (layers: Dictionary<ExtendedLayer>): ExtendedLayer[] =>
  Object.values(layers).flatMap((layerGroup) => layerGroup)

type AnyFunc = (...args: any[]) => any
export const memoizeCache: Dictionary<Dictionary<AnyFunc>> = {}
export const memoizeByLayerId = (id: string, dict: Dictionary<AnyFunc>) => {
  if (!memoizeCache[id]) {
    memoizeCache[id] = dict
  }
}
