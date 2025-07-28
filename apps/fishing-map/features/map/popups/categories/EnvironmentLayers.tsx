import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { format } from 'd3-format'

import { DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type {
  FourwingsHeatmapPickingObject,
  FourwingsHeatmapStaticPickingObject,
} from '@globalfishingwatch/deck-layers'
import { HEATMAP_STATIC_PROPERTY_ID } from '@globalfishingwatch/deck-layers'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'

import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { isBathymetryDataview } from 'features/dataviews/dataviews.utils'
import { selectEnvironmentalDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'

import styles from '../Popup.module.css'

type ContextTooltipRowProps = {
  features: (FourwingsHeatmapPickingObject | FourwingsHeatmapStaticPickingObject)[]
  showFeaturesDetails: boolean
}

function parseEnvironmentalValue(value: any) {
  if (typeof value === 'number') {
    return format(',.2~f')(value)
  }
  if (typeof value === 'string') {
    return format(',.2~f')(parseFloat(value))
  }
  return value as number
}

function EnvironmentTooltipSection({
  features,
  showFeaturesDetails = false,
}: ContextTooltipRowProps) {
  const { t } = useTranslation()

  const dataviews = useSelector(selectEnvironmentalDataviews) as UrlDataviewInstance[]
  return (
    <Fragment>
      {features.map((feature, index) => {
        const dataview = dataviews.find((d) => d.id === feature.layerId)

        const isHeatmapFeature =
          feature.subcategory === DataviewType.HeatmapAnimated ||
          feature.subcategory === DataviewType.HeatmapStatic
        const value =
          feature.subcategory === DataviewType.HeatmapAnimated
            ? feature.sublayers?.[0]?.value
            : (feature as FourwingsHeatmapStaticPickingObject).properties?.[
                HEATMAP_STATIC_PROPERTY_ID
              ]

        const unit = feature.sublayers
          ? feature.sublayers?.[0]?.unit
          : dataview?.datasets?.[0]?.unit
        return (
          <div key={`${feature.title}-${index}`} className={styles.popupSection}>
            <Icon
              icon={isHeatmapFeature ? 'heatmap' : 'polygons'}
              className={styles.layerIcon}
              style={{ color: feature.sublayers?.[0]?.color }}
            />

            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && (
                <h3 className={styles.popupSectionTitle}>
                  {dataview ? getDatasetTitleByDataview(dataview) : feature.title}
                </h3>
              )}
              <div className={styles.row}>
                <span className={styles.rowText}>
                  <span>
                    {parseEnvironmentalValue(value)}{' '}
                    {unit && <span>{t(`common.${unit}`, unit)}</span>}
                  </span>
                </span>
                {dataview && isBathymetryDataview(dataview) && showFeaturesDetails && (
                  <IconButton
                    className={styles.bathymetryDisclaimer}
                    icon={'warning'}
                    size="small"
                    tooltip={t('common.bathymetry_disclaimer')}
                  />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

export default EnvironmentTooltipSection
