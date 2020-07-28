import { DateTime } from 'luxon'

export type TimeChunk = {
  id: string
  start: string
  viewEnd: string
  dataEnd: string
  quantizeOffset: number
}

const toDT = (dateISO: string) => DateTime.fromISO(dateISO).toUTC()

export const getActiveTimeChunk = (
  activeStart: string,
  activeEnd: string,
  datasetStart: string,
  datasetEnd: string
) => {
  // view range is completely outside of dataset range
  if (+toDT(activeEnd) < +toDT(datasetStart) || +toDT(activeStart) > +toDT(datasetEnd)) {
    return []
  }

  // tileset should start at current year
  let chunkStart = toDT(activeStart).startOf('year')

  // end of *usable* tileset is end of year
  // end of *loaded* tileset is end of year + 100 days
  const chunkViewEnd = chunkStart.plus({ years: 1 })
  let chunkDataEnd = chunkStart.plus({ years: 1, days: 100 })

  // use dataset start if chunk starts before dataset
  if (+chunkStart < +toDT(datasetStart)) chunkStart = toDT(datasetStart)
  // use dataset end if chunk ends after dataset
  if (+chunkDataEnd > +toDT(datasetEnd)) chunkDataEnd = toDT(datasetEnd)

  const start = chunkStart.toString()
  const viewEnd = chunkViewEnd.toString()
  const dataEnd = chunkDataEnd.toString()

  // we will substract every timestamp with this to end up with shorter arrays indexes
  const quantizeOffset = Math.floor(+chunkStart / 1000 / 60 / 60 / 24)

  const chunk: TimeChunk = {
    start,
    viewEnd,
    dataEnd,
    quantizeOffset,
    id: `heatmapchunk_${start.slice(0, 13)}_${viewEnd.slice(0, 13)}`,
  }

  return [chunk]
}
