import { TimebarTracks } from '@globalfishingwatch/timebar'

import { useTimebarPoints } from './timebar-vessel.hooks'

const TimebarPointsGraph = () => {
  const points = useTimebarPoints()

  if (!points || points.length === 0) {
    return null
  }

  return <TimebarTracks key="tracks" data={points} />
}

export default TimebarPointsGraph
