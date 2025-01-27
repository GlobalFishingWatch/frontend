import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer, FourwingsVisualizationMode } from '@globalfishingwatch/deck-layers'
import {
  HEATMAP_HIGH_RES_ID,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
  POSITIONS_ID,
} from '@globalfishingwatch/deck-layers'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Icon } from '@globalfishingwatch/ui-components'

import { PREFERRED_FOURWINGS_VISUALISATION_MODE } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectActivityVisualizationMode,
  selectDetectionsVisualizationMode,
  selectEnvironmentVisualizationMode,
} from 'features/app/selectors/app.selectors'
import {
  selectActivityMergedDataviewId,
  selectDetectionsMergedDataviewId,
} from 'features/dataviews/selectors/dataviews.selectors'
import { setUserSetting } from 'features/user/user.slice'
import { useLocationConnect } from 'routes/routes.hook'

export const useVisualizationsOptions = (
  category: DataviewCategory.Activity | DataviewCategory.Detections | DataviewCategory.Environment
) => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useAppDispatch()
  const layerId = useSelector(
    category === DataviewCategory.Detections
      ? selectDetectionsMergedDataviewId
      : selectActivityMergedDataviewId
  )
  const fourwingsActivityLayer = useGetDeckLayer<FourwingsLayer>(layerId)
  const isPositionsLayerAvailable = fourwingsActivityLayer?.instance?.getIsPositionsAvailable()
  const activeVisualizationOption = useSelector(
    category === DataviewCategory.Detections
      ? selectDetectionsVisualizationMode
      : category === DataviewCategory.Environment
        ? selectEnvironmentVisualizationMode
        : selectActivityVisualizationMode
  )

  const onVisualizationModeChange = useCallback(
    (visualizationMode: FourwingsVisualizationMode) => {
      const categoryQueryParam = `${category}VisualizationMode`
      dispatchQueryParams({ [categoryQueryParam]: visualizationMode })
      if (visualizationMode !== 'positions') {
        dispatch(setUserSetting({ [PREFERRED_FOURWINGS_VISUALISATION_MODE]: visualizationMode }))
      }
    },
    [category, dispatch, dispatchQueryParams]
  )

  const visualizationOptions: ChoiceOption<FourwingsVisualizationMode>[] = useMemo(() => {
    return [
      {
        id: HEATMAP_LOW_RES_ID,
        label: <Icon icon="heatmap-low-res" />,
        tooltip: t('map.lowRes', 'See low resolution heatmaps'),
        tooltipPlacement: 'bottom',
      },
      {
        id: HEATMAP_ID,
        label: <Icon icon="heatmap-default-res" />,
        tooltip: t('map.defaultRes', 'See default resolution heatmaps'),
        tooltipPlacement: 'bottom',
      },
      ...(category !== DataviewCategory.Environment
        ? ([
            {
              id: HEATMAP_HIGH_RES_ID,
              label: <Icon icon="heatmap-high-res" />,
              tooltip: t('map.highRes', 'See high resolution heatmaps'),
              tooltipPlacement: 'bottom',
            },
            {
              id: POSITIONS_ID,
              label: <Icon icon={isPositionsLayerAvailable ? 'vessel' : 'vessel-disabled'} />,
              tooltip: isPositionsLayerAvailable
                ? t('map.positions', 'See positions visualization mode')
                : t(
                    'map.positionsDisabled',
                    'A more detailed visualization is available in areas with less activity, please zoom in or reduce your time range to see it'
                  ),
              tooltipPlacement: 'bottom',
              disabled: !isPositionsLayerAvailable,
            },
          ] as ChoiceOption<FourwingsVisualizationMode>[])
        : []),
    ]
  }, [category, isPositionsLayerAvailable, t])

  return useMemo(
    () => ({ visualizationOptions, activeVisualizationOption, onVisualizationModeChange }),
    [activeVisualizationOption, onVisualizationModeChange, visualizationOptions]
  )
}
