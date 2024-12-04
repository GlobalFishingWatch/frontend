import { useSelector } from 'react-redux'
import { LegendType, MapLegend } from '@globalfishingwatch/ui-components'
import {
  VESSEL_GRAPH_COLORS,
  VESSEL_DEPTH_VALUES,
  VESSEL_SPEED_VALUES,
} from '@globalfishingwatch/deck-layers'
import { selectVesselsColorBy } from 'features/app/selectors/app.selectors'
import styles from 'features/workspace/shared/Sections.module.css'

const SPEEDS = [0, ...VESSEL_SPEED_VALUES.slice(0, -1)]
const DEPTHS = [0, ...VESSEL_DEPTH_VALUES.slice(0, -1)]

function VesselTracksLegend(): React.ReactElement | null {
  const vesselsColorBy = useSelector(selectVesselsColorBy)

  const legend = {
    id: vesselsColorBy,
    type: LegendType.ColorRampDiscrete,
    unit: vesselsColorBy === 'speed' ? 'knots' : 'meters',
    values: vesselsColorBy === 'speed' ? SPEEDS : DEPTHS,
    colors:
      vesselsColorBy === 'speed' ? VESSEL_GRAPH_COLORS : VESSEL_GRAPH_COLORS.slice().reverse(),
  }

  if (vesselsColorBy === 'track') {
    return null
  }

  return (
    <div className={styles.content}>
      <MapLegend layer={legend} />
    </div>
  )
}

export default VesselTracksLegend
