import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { FourwingsHeatmapPickingObject } from '@globalfishingwatch/deck-layers'
import type { FourwingsVectorsUnit } from '@globalfishingwatch/deck-loaders'

import { getDatasetTitleByDataview } from 'features/_map/datasets/datasets.utils'
import { selectAllDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'
import I18nNumber from 'features/i18n/i18nNumber'

import PopupSectionLayout from '../shared/PopupSectionLayout'

import popupStyles from '../Popup.module.css'

type VectorsTooltipRowProps = {
  feature: FourwingsHeatmapPickingObject
  loading?: boolean
  error?: string
  showFeaturesDetails: boolean
}

function VectorsTooltipRow({ feature, showFeaturesDetails }: VectorsTooltipRowProps) {
  const { t } = useTranslation()
  const dataviews = useSelector(selectAllDataviewInstancesResolved) as UrlDataviewInstance[]
  const dataview = dataviews?.find((d) => d.id === feature.layerId)
  const [speed, angle] = feature.aggregatedValues || []
  const unit = feature.sublayers?.[0]?.unit as FourwingsVectorsUnit
  if (!angle || !speed) {
    return null
  }

  const title = dataview ? getDatasetTitleByDataview(dataview, { showPrivateIcon: false }) : ''

  const color = feature.sublayers?.[0]?.color as string
  return (
    <Fragment>
      <PopupSectionLayout
        icon="vector-arrow"
        iconColor={color}
        iconStyle={{ transform: `rotate(${angle}deg)` }}
        title={showFeaturesDetails && title ? title : undefined}
      >
        {speed && (
          <span>
            <I18nNumber number={speed} /> {t((t) => t.common[unit], { defaultValue: unit })}
          </span>
        )}
      </PopupSectionLayout>
    </Fragment>
  )
}

export default VectorsTooltipRow
