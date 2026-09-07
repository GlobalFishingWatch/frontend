import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { VESSEL_GRAPH_COLORS } from '@globalfishingwatch/deck-layers'
import type { UILegendColorRamp } from '@globalfishingwatch/ui-components'
import { LegendType, MapLegend } from '@globalfishingwatch/ui-components'

import { useTimebarTracksGraphSteps } from 'features/_map/map/timebar-graph.hooks'
import { selectTimebarGraph } from 'features/_map/workspace/selectors/app.timebar.selectors'

import MapLegendPlaceholder from '../shared/MapLegendPlaceholder'

import styles from 'features/_map/workspace/shared/Section.module.css'

function VesselTracksLegend(): React.ReactElement<any> | null {
  const { t } = useTranslation()
  const steps = useTimebarTracksGraphSteps()
  const vesselsTimebarGraph = useSelector(selectTimebarGraph)

  if (vesselsTimebarGraph === 'none') {
    return null
  }

  if (!steps || !steps.length) {
    return (
      <div className={styles.legend}>
        <MapLegendPlaceholder />
      </div>
    )
  }

  const legend: UILegendColorRamp = {
    id: vesselsTimebarGraph,
    type: LegendType.ColorRampDiscrete,
    label:
      vesselsTimebarGraph === 'speed' ? t((t) => t.eventInfo.speed) : t((t) => t.eventInfo.depth),
    unit: vesselsTimebarGraph === 'speed' ? t((t) => t.common.knots) : t((t) => t.common.meters),
    // Depth steps are negative elevations. Flip the sign for display only — `steps` is
    // shared with the timebar graph, which scales off the raw negative values.
    // Positions are unchanged, so the reversed colour ramp below still lines up, and
    // formatLegendValue switches the last bucket's prefix from ≤ to ≥ on its own.
    values: steps.map((step) =>
      vesselsTimebarGraph === 'speed' ? step.value : Math.abs(step.value)
    ),
    colors:
      vesselsTimebarGraph === 'speed' ? VESSEL_GRAPH_COLORS : VESSEL_GRAPH_COLORS.slice().reverse(),
  }

  return (
    <div className={styles.legend}>
      <MapLegend layer={legend} roundValues={false} />
    </div>
  )
}

export default VesselTracksLegend
