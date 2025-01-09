import type { TimeseriesByTypeProps } from '../types'

type IndividualTimeseriesProps = TimeseriesByTypeProps<'individual'> & { width: number }

export function IndividualTimeseries({ data }: IndividualTimeseriesProps) {
  console.log('🚀 ~ IndividualTimeseries ~ data:', data)
  return <h1>TODO</h1>
}
