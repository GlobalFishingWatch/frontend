import { TimeChunk } from './time-chunks'

export const toURLArray = (paramName: string, arr: string[]) => {
  if (!arr?.length) return ''
  return arr
    .flatMap((element, i) => {
      if (!element) return []
      return `${paramName}[${i}]=${element}`
    })
    .join('&')
}

export const getSourceId = (baseId: string, timeChunk: TimeChunk) => {
  return `${baseId}-${timeChunk.id}`
}

export const getLayerId = (baseId: string, timeChunk: TimeChunk, suffix = '') => {
  return `${getSourceId(baseId, timeChunk)}${suffix ? `-${suffix}` : ''}`
}
