import { Fragment } from 'react'
import { format } from 'd3-format'
import { Icon } from '@globalfishingwatch/ui-components'
import { GeneratorType, HEATMAP_STATIC_PROPERTY_ID } from '@globalfishingwatch/layer-composer'
import { TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'

type ContextTooltipRowProps = {
  features: TooltipEventFeature[]
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
  return (
    <Fragment>
      {features.map((feature, index) => {
        const isHeatmapFeature =
          feature.type === GeneratorType.HeatmapAnimated ||
          feature.type === GeneratorType.HeatmapStatic
        const value =
          feature.type === GeneratorType.HeatmapAnimated
            ? feature.value
            : feature.properties[HEATMAP_STATIC_PROPERTY_ID]
        return (
          <div key={`${feature.title}-${index}`} className={styles.popupSection}>
            <Icon
              icon={isHeatmapFeature ? 'heatmap' : 'polygons'}
              className={styles.layerIcon}
              style={{ color: feature.color }}
            />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
              <div className={styles.row}>
                <span className={styles.rowText}>
                  {parseEnvironmentalValue(value)}{' '}
                  {/* TODO will need to not pick from temporalgrid once user polygons support units  */}
                  {feature.temporalgrid?.unit && <span>{feature.temporalgrid?.unit}</span>}
                  {feature.unit && <span>{feature.unit}</span>}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

export default EnvironmentTooltipSection
