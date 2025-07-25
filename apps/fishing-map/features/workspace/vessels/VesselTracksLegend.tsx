import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { VESSEL_GRAPH_COLORS } from '@globalfishingwatch/deck-layers'
import type { UILegendColorRamp } from '@globalfishingwatch/ui-components'
import { LegendType, MapLegend } from '@globalfishingwatch/ui-components'

import { selectTimebarGraph } from 'features/app/selectors/app.timebar.selectors'
import { useTimebarTracksGraphSteps } from 'features/map/map-layers.hooks'

import MapLegendPlaceholder from '../shared/MapLegendPlaceholder'

import styles from 'features/workspace/shared/Sections.module.css'

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
    label: vesselsTimebarGraph === 'speed' ? t('eventInfo.speed') : t('eventInfo.depth'),
    unit: vesselsTimebarGraph === 'speed' ? t('common.knots') : t('common.meters'),
    values: steps.map((step) => step.value),
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
