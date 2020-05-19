import { Layer } from 'mapbox-gl'

import { Dictionary } from './types'

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

export const layersDictToArray = (layers: Dictionary<Layer>) =>
  Object.values(layers).flatMap((layerGroup) => layerGroup)

type AnyFunc = (...args: any[]) => any
export const memoizeCache: Dictionary<Dictionary<AnyFunc>> = {}
export const memoizeByLayerId = (id: string, dict: Dictionary<AnyFunc>) => {
  if (!memoizeCache[id]) {
    memoizeCache[id] = dict
  }
}
