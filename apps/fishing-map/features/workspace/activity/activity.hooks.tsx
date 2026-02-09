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
import { getIsPositionSupportedInDataview } from 'features/dataviews/dataviews.utils'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
  selectActiveEnvironmentalDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import {
  selectActivityMergedDataviewId,
  selectDetectionsMergedDataviewId,
  selectHasActivityDataviewVesselGroups,
  selectHasDetectionsDataviewVesselGroups,
} from 'features/dataviews/selectors/dataviews.selectors'
import { setUserSetting } from 'features/user/user.slice'
import { replaceQueryParams } from 'routes/routes.actions'

export const useVisualizationsOptions = (
  category: DataviewCategory.Activity | DataviewCategory.Detections | DataviewCategory.Environment
) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const dataviews = useSelector(
    category === DataviewCategory.Activity
      ? selectActiveActivityDataviews
      : category === DataviewCategory.Detections
        ? selectActiveDetectionsDataviews
        : selectActiveEnvironmentalDataviews
  )

  const layerId = useSelector(
    category === DataviewCategory.Detections
      ? selectDetectionsMergedDataviewId
      : selectActivityMergedDataviewId
  )
  const hasActivityDataviewVesselGroups = useSelector(selectHasActivityDataviewVesselGroups)
  const hasDetectionsDataviewVesselGroups = useSelector(selectHasDetectionsDataviewVesselGroups)
  const hasVesselGroupsFilter =
    category === DataviewCategory.Activity
      ? hasActivityDataviewVesselGroups
      : category === DataviewCategory.Detections
        ? hasDetectionsDataviewVesselGroups
        : false

  const fourwingsActivityLayer = useGetDeckLayer<FourwingsLayer>(layerId)
  const isPositionsLayerAvailable = fourwingsActivityLayer?.instance?.getIsPositionsAvailable()
  const activeVisualizationOption = useSelector(
    category === DataviewCategory.Detections
      ? selectDetectionsVisualizationMode
      : category === DataviewCategory.Environment
        ? selectEnvironmentVisualizationMode
        : selectActivityVisualizationMode
  )

  const positionsSupported = dataviews.every((dataview) =>
    getIsPositionSupportedInDataview(dataview)
  )

  const onVisualizationModeChange = useCallback(
    (visualizationMode: FourwingsVisualizationMode) => {
      const categoryQueryParam = `${category}VisualizationMode`
      replaceQueryParams({ [categoryQueryParam]: visualizationMode })
      if (visualizationMode !== 'positions') {
        dispatch(setUserSetting({ [PREFERRED_FOURWINGS_VISUALISATION_MODE]: visualizationMode }))
      }
    },
    [category, dispatch]
  )

  const visualizationOptions: ChoiceOption<FourwingsVisualizationMode>[] = useMemo(() => {
    return [
      {
        id: HEATMAP_LOW_RES_ID,
        label: <Icon icon="heatmap-low-res" />,
        tooltip: t((t) => t.map.lowRes),
        tooltipPlacement: 'bottom',
      },
      {
        id: HEATMAP_ID,
        label: <Icon icon="heatmap-default-res" />,
        tooltip: t((t) => t.map.defaultRes),
        tooltipPlacement: 'bottom',
      },
      ...(category !== DataviewCategory.Environment
        ? ([
            {
              id: HEATMAP_HIGH_RES_ID,
              label: (
                <Icon
                  icon={hasVesselGroupsFilter ? 'heatmap-high-res-disabled' : 'heatmap-high-res'}
                />
              ),
              tooltip: hasVesselGroupsFilter
                ? t((t) => t.map.highResDisabled)
                : t((t) => t.map.highRes),
              tooltipPlacement: 'bottom',
              disabled: hasVesselGroupsFilter,
            },
            ...(positionsSupported
              ? [
                  {
                    id: POSITIONS_ID,
                    label: <Icon icon={isPositionsLayerAvailable ? 'vessel' : 'vessel-disabled'} />,
                    tooltip: isPositionsLayerAvailable
                      ? t((t) => t.map.positions)
                      : t((t) => t.map.positionsDisabled),
                    tooltipPlacement: 'bottom',
                    disabled: !isPositionsLayerAvailable,
                  },
                ]
              : []),
          ] as ChoiceOption<FourwingsVisualizationMode>[])
        : []),
    ]
  }, [category, hasVesselGroupsFilter, isPositionsLayerAvailable, positionsSupported, t])

  return useMemo(
    () => ({ visualizationOptions, activeVisualizationOption, onVisualizationModeChange }),
    [activeVisualizationOption, onVisualizationModeChange, visualizationOptions]
  )
}
