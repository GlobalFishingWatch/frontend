import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import {
  FourwingsLayer,
  HEATMAP_ID,
  HEATMAP_HIGH_RES_ID,
  POSITIONS_ID,
  FourwingsVisualizationMode,
} from '@globalfishingwatch/deck-layers'
import { ChoiceOption, Icon } from '@globalfishingwatch/ui-components'
import {
  selectActivityMergedDataviewId,
  selectDetectionsMergedDataviewId,
} from 'features/dataviews/selectors/dataviews.selectors'
import { selectActivityVisualizationMode } from 'features/app/selectors/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'

export const useVisualizationsOptions = (
  category: DataviewCategory.Activity | DataviewCategory.Detections
) => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const layerId = useSelector(
    category === DataviewCategory.Detections
      ? selectDetectionsMergedDataviewId
      : selectActivityMergedDataviewId
  )
  const fourwingsActivityLayer = useGetDeckLayer<FourwingsLayer>(layerId)
  const isPositionsLayerAvailable = fourwingsActivityLayer?.instance?.getIsPositionsAvailable()
  const activeVisualizationOption = useSelector(selectActivityVisualizationMode)

  const onVisualizationModeChange = useCallback(
    (activityVisualizationMode: FourwingsVisualizationMode) => {
      dispatchQueryParams({ activityVisualizationMode })
    },
    [dispatchQueryParams]
  )

  const visualizationOptions: ChoiceOption<FourwingsVisualizationMode>[] = useMemo(() => {
    if (!layerId) {
      return []
    }
    return [
      {
        id: HEATMAP_ID,
        label: (
          <Icon
            icon={'heatmap-low-res'}
            tooltip={t('map.lowRes', 'See low resolution heatmaps')}
            tooltipPlacement="top"
          />
        ),
      },
      {
        id: HEATMAP_HIGH_RES_ID,
        label: (
          <Icon
            icon={'heatmap-high-res'}
            tooltip={t('map.highRes', 'See high resolution heatmaps')}
            tooltipPlacement="top"
          />
        ),
      },
      {
        id: POSITIONS_ID,
        label: (
          <Icon
            icon={isPositionsLayerAvailable ? 'vessel' : 'vessel-disabled'}
            tooltip={
              isPositionsLayerAvailable
                ? t('map.positions', 'See positions visualization mode')
                : t('map.positionsDisabled', 'Positions visualizations mode not available')
            }
            tooltipPlacement="top"
          />
        ),
        disabled: !isPositionsLayerAvailable,
      },
    ]
  }, [isPositionsLayerAvailable, layerId, t])

  return { visualizationOptions, activeVisualizationOption, onVisualizationModeChange }
}
