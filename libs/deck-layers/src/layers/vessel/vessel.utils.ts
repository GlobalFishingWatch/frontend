import { DateTime, Duration } from 'luxon'
import { getUTCDateTime } from '../../utils/dates'

export const getVesselTrackThunks = (start: number, end: number) => {
  const startDT = getUTCDateTime(start)
  const endDT = getUTCDateTime(end)
  const yearsDelta = Math.ceil(Duration.fromMillis(+endDT - +startDT).as('years'))
  const startYear = startDT.startOf('year').year
  const endYear = startYear + yearsDelta
  const bufferChunks = endYear >= DateTime.now().year ? 1 : 2
  // Prebuffering one year before and another after (only when initialYear is not the latest)
  const yearsChunks = [...new Array(yearsDelta + bufferChunks)].map((_, i) => startYear + i - 1)
  // Generating one full year per chunk so we could take advantage of browser cache more often
  const chunks = yearsChunks.map((year) => {
    const start = DateTime.fromObject({ year }, { zone: 'utc' }).toISO()
    const end = DateTime.fromObject({ year: year + 1 }, { zone: 'utc' })
      .minus({ millisecond: 1 })
      .toISO()
    return { start, end }
  })
  return chunks
}
