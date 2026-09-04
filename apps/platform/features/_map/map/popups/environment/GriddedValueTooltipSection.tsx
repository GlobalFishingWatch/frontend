import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { format } from 'd3-format'

import { DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { FourwingsHeatmapPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'

import { getDatasetTitleByDataview } from 'features/_map/datasets/datasets.utils'
import { isBathymetryDataview } from 'features/_map/dataviews/dataviews.utils'
import { selectAllDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'

import styles from '../Popup.module.css'

type GriddedValueTooltipSectionProps = {
  features: FourwingsHeatmapPickingObject[]
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

function GriddedValueTooltipSection({
  features,
  showFeaturesDetails = false,
}: GriddedValueTooltipSectionProps) {
  const { t } = useTranslation()

  // user gridded (HEATMAP_STATIC) layers land here too, and they are not in the environment category
  const dataviews = useSelector(selectAllDataviewInstancesResolved) as UrlDataviewInstance[]
  return (
    <Fragment>
      {features.map((feature, index) => {
        const dataview = dataviews.find((d) => d.id === feature.layerId)

        const isHeatmapFeature =
          feature.subcategory === DataviewType.HeatmapAnimated ||
          feature.subcategory === DataviewType.HeatmapStatic
        const value = feature.sublayers?.[0]?.value

        const unit = feature.sublayers?.[0]?.unit ?? dataview?.datasets?.[0]?.unit
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
                  {dataview
                    ? getDatasetTitleByDataview(dataview, { showPrivateIcon: false })
                    : feature.title}
                </h3>
              )}
              <div className={styles.row}>
                <span className={styles.rowText}>
                  <span>
                    {parseEnvironmentalValue(value)}{' '}
                    {unit && <span>{t((t: any) => t.common[unit], { defaultValue: unit })}</span>}
                  </span>
                </span>
                {dataview && isBathymetryDataview(dataview) && showFeaturesDetails && (
                  <IconButton
                    className={styles.bathymetryDisclaimer}
                    icon={'warning'}
                    size="small"
                    tooltip={t((t) => t.common.bathymetry_disclaimer)}
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

export default GriddedValueTooltipSection
