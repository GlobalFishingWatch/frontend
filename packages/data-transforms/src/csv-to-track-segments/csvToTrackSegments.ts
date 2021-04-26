import groupBy from 'lodash/groupBy'
import { Segment } from '../track-value-array-to-segments'
import { Columns } from './types'

type Args = Columns & {
  records: Record<string, any>[]
}

const csvToTrackSegments = ({ records, latitude, longitude, timestamp, id }: Args): Segment[] => {
  const grouped = id ? groupBy(records, id) : { no_id: records }
  const segments = Object.values(grouped).map((groupedRecords) => {
    return groupedRecords.map((record) => {
      const recordId = id ? (record[id] as any).toString() : null
      return {
        latitude: parseFloat(record[latitude]),
        longitude: parseFloat(record[longitude]),
        timestamp: new Date(record[timestamp]).getTime(),
        id: recordId,
      }
    })
  })
  return segments
}

export default csvToTrackSegments
