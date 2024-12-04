import { useSelector } from 'react-redux'
import { LegendType, MapLegend } from '@globalfishingwatch/ui-components'
import {
  VESSEL_GRAPH_COLORS,
  VESSEL_DEPTH_VALUES,
  VESSEL_SPEED_VALUES,
} from '@globalfishingwatch/deck-layers'
import styles from 'features/workspace/shared/Sections.module.css'
import { selectTimebarGraph } from 'features/app/selectors/app.timebar.selectors'

const SPEEDS = [0, ...VESSEL_SPEED_VALUES.slice(0, -1)]
const DEPTHS = [0, ...VESSEL_DEPTH_VALUES.slice(0, -1)]

function VesselTracksLegend(): React.ReactElement | null {
  const vesselsTimebarGraph = useSelector(selectTimebarGraph)

  if (!vesselsTimebarGraph || vesselsTimebarGraph === 'none') {
    return null
  }

  const legend = {
    id: vesselsTimebarGraph,
    type: LegendType.ColorRampDiscrete,
    unit: vesselsTimebarGraph === 'speed' ? 'knots' : 'meters',
    values: vesselsTimebarGraph === 'speed' ? SPEEDS : DEPTHS,
    colors:
      vesselsTimebarGraph === 'speed' ? VESSEL_GRAPH_COLORS : VESSEL_GRAPH_COLORS.slice().reverse(),
  }

  return (
    <div className={styles.content}>
      <MapLegend layer={legend} />
    </div>
  )
}

export default VesselTracksLegend
