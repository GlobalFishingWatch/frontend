export const getChunkBuffer = (interval: Interval) => {
  const { buffer, unit } = LIMITS_BY_INTERVAL[interval] || {}
  if (!unit) {
    throw new Error(`No buffer for interval: ${interval}`)
  }
  return Duration.fromObject({ [unit]: buffer }).toMillis()
}

export const getChunksByInterval = (start: number, end: number, interval: Interval): Chunk[] => {
  const chunkUnit = CHUNKS_BY_INTERVAL[interval]?.unit
  if (!chunkUnit) {
    return [{ id: 'full-time-range', interval, start, end }]
  }
  const startDate = DateTime.fromMillis(start).startOf(chunkUnit)
  const endDate = DateTime.fromMillis(end).endOf(chunkUnit)
  // TODO review if more than the interval units return an offset or calculates the total amount
  const chunksNumber = Math.round(
    Duration.fromMillis(endDate.toMillis() - startDate.toMillis()).as(chunkUnit)
  )
  const dataChunks: Chunk[] = Array.from(Array(chunksNumber).keys()).map((chunkIndex) => {
    return {
      id: `${chunkUnit}-${chunkIndex + 1}`,
      interval,
      start: startDate.plus({ [chunkUnit]: chunkIndex }).toMillis(),
      end: startDate.plus({ [chunkUnit]: chunkIndex + 1 }).toMillis(),
    }
  })
  const data = dataChunks.map((c) => ({
    ...c,
    startISO: DateTime.fromMillis(c.start).toISODate(),
    endISO: DateTime.fromMillis(c.end).toISODate(),
  }))
  return data
}

// TODO use the existing class function instead of repeating the logic
export const getChunks = (minFrame: number, maxFrame: number) => {
  const interval = getInterval(minFrame, maxFrame)
  const chunks = getChunksByInterval(minFrame, maxFrame, interval)
  return chunks
}
