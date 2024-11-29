import type { TimeChunk } from './time-chunks'

export const getSourceId = (baseId: string, timeChunk: TimeChunk) => {
  return `${baseId}-${timeChunk.id}`
}

export const getLayerId = (baseId: string, timeChunk: TimeChunk, suffix = '') => {
  return `${getSourceId(baseId, timeChunk)}${suffix ? `-${suffix}` : ''}`
}
