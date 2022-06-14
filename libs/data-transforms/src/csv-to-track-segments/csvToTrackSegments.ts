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

export const NO_RECORD_ID = 'no_id'

export const csvToTrackSegments = ({
  records,
  latitude,
  longitude,
  timestamp,
  id,
}: Args): Segment[] => {
  const grouped = id ? groupBy(records, id) : { no_id: records }
  const segments = Object.values(grouped).map((groupedRecords) => {
    return groupedRecords.flatMap((record) => {
      const recordId = id && record[id] ? record[id] : NO_RECORD_ID
      if (record[latitude] && record[longitude] && record[timestamp]) {
        return {
          latitude: parseFloat(record[latitude]),
          longitude: parseFloat(record[longitude]),
          timestamp: getUTCDate(record[timestamp]).getTime(),
          id: recordId,
        }
      } else return []
    })
  })
  return segments
}
