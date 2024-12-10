import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import type { UILegendColorRamp } from '@globalfishingwatch/ui-components'
import { LegendType, MapLegend } from '@globalfishingwatch/ui-components'
import { VESSEL_GRAPH_COLORS } from '@globalfishingwatch/deck-layers'
import styles from 'features/workspace/shared/Sections.module.css'
import { selectTimebarGraph } from 'features/app/selectors/app.timebar.selectors'
import { useTimebarTracksGraphSteps } from 'features/map/map-layers.hooks'

function VesselTracksLegend(): React.ReactElement | null {
  const { t } = useTranslation()
  const steps = useTimebarTracksGraphSteps()
  const vesselsTimebarGraph = useSelector(selectTimebarGraph)

  if (!steps || !steps.length) {
    return null
  }

  const legend: UILegendColorRamp = {
    id: vesselsTimebarGraph,
    type: LegendType.ColorRampDiscrete,
    label:
      vesselsTimebarGraph === 'speed'
        ? t('timebarSettings.graphSpeed', 'Vessel speed')
        : t('timebarSettings.graphDepth', 'Vessel depth'),
    unit:
      vesselsTimebarGraph === 'speed' ? t('common.knots', 'knots') : t('common.meters', 'meters'),
    values: steps.map((step) => step.value),
    colors:
      vesselsTimebarGraph === 'speed' ? VESSEL_GRAPH_COLORS : VESSEL_GRAPH_COLORS.slice().reverse(),
  }

  return (
    <div className={styles.legend}>
      <MapLegend layer={legend} />
    </div>
  )
}

export default VesselTracksLegend
