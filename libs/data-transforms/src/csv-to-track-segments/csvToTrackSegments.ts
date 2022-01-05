import { groupBy } from 'lodash'
import { Segment } from '../track-value-array-to-segments'
import { Columns } from './types'

type Args = Columns & {
  records: Record<string, any>[]
}

const getUTCDate = (timestamp: string) => {
  const date = new Date(timestamp)
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    )
  )
}

export const csvToTrackSegments = ({
  records,
  latitude,
  longitude,
  timestamp,
  id,
}: Args): Segment[] => {
  const grouped = id ? groupBy(records, id) : { no_id: records }
  const segments = Object.values(grouped).map((groupedRecords) => {
    return groupedRecords.map((record) => {
      const recordId = id ? (record[id] as any).toString() : null
      return {
        latitude: parseFloat(record[latitude]),
        longitude: parseFloat(record[longitude]),
        timestamp: getUTCDate(record[timestamp]).getTime(),
        id: recordId,
      }
    })
  })
  return segments
}
