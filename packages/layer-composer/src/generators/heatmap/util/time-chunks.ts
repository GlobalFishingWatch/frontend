import { SlowBuffer } from 'buffer'
import { DateTime } from 'luxon'
import { buffer } from 'd3'

export type TimeChunk = {
  id: string
  start: string
  viewEnd: string
  dataEnd: string
  quantizeOffset: number
}

const toDT = (dateISO: string) => DateTime.fromISO(dateISO).toUTC()

// Buffer size relative to active time delta
const TIME_CHUNK_BUFFER_RELATIVE_SIZE = 0.2

// Thresholds / extra time to load per precision level
const TIME_CHUNK_OVERFLOW_BY_PRECISION = {
  day: { days: 100 },
}

export const getActiveTimeChunks = (
  activeStart: string,
  activeEnd: string,
  datasetStart: string,
  datasetEnd: string
) => {
  const delta = +toDT(activeEnd) - +toDT(activeStart)
  const bufferSize = delta * TIME_CHUNK_BUFFER_RELATIVE_SIZE
  const bufferedActiveStart = +toDT(activeStart) - bufferSize
  const bufferedActiveEnd = +toDT(activeEnd) + bufferSize

  // view range is completely outside of dataset range
  if (bufferedActiveEnd < +toDT(datasetStart) || bufferedActiveStart > +toDT(datasetEnd)) {
    return []
  }

  // tileset should start at current year
  const firstChunkStart = DateTime.fromMillis(bufferedActiveStart).toUTC().startOf('year')
  const chunkStarts = [firstChunkStart]
  while (true) {
    const nextChunkStart = chunkStarts[chunkStarts.length - 1].plus({ years: 1 })
    if (+nextChunkStart > bufferedActiveEnd) {
      break
    }
    chunkStarts.push(nextChunkStart)
  }

  const chunks: TimeChunk[] = chunkStarts.map((chunkStart) => {
    // end of *usable* tileset is end of year
    // end of *loaded* tileset is end of year + 100 days
    const chunkViewEnd = chunkStart.plus({ years: 1 })
    let chunkDataEnd = chunkViewEnd.plus(TIME_CHUNK_OVERFLOW_BY_PRECISION.day)
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
    return chunk
  })

  return chunks
}
