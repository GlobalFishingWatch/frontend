import { Fragment } from 'react'
import { Icon } from '@globalfishingwatch/ui-components'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { toFixed } from 'utils/shared'
import styles from './Popup.module.css'

type ContextTooltipRowProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function parseEnvironmentalValue(value: any) {
  if (typeof value === 'number') {
    return toFixed(value, 2)
  }
  if (typeof value === 'string') {
    return toFixed(parseFloat(value), 2)
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
        return (
          <div key={`${feature.title}-${index}`} className={styles.popupSection}>
            <Icon
              icon={feature.type === GeneratorType.HeatmapAnimated ? 'heatmap' : 'polygons'}
              className={styles.layerIcon}
              style={{ color: feature.color }}
            />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
              <div className={styles.row}>
                <span className={styles.rowText}>
                  {parseEnvironmentalValue(feature.value)}{' '}
                  {/* TODO will need to not pick from temporalgrid once user polygons support units  */}
                  {feature.temporalgrid?.unit && <span>{feature.temporalgrid?.unit}</span>}
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
