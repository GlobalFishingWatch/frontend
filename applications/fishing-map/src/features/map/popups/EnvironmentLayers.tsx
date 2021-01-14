import React, { Fragment } from 'react'
import { TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'

type ContextTooltipRowProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: ContextTooltipRowProps) {
  return (
    <Fragment>
      {features.map((feature, index) => (
        <div key={`${feature.title}-${index}`} className={styles.popupSection}>
          <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
          <div className={styles.popupSectionContent}>
            {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
            <div className={styles.row}>
              <span className={styles.rowText}>
                {feature.value} {feature.unit && <span>{feature.unit}</span>}
              </span>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default ContextTooltipSection
