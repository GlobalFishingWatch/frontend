import React, { Fragment } from 'react'
import { TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'

type UserContextLayersProps = {
  features: TooltipEventFeature[]
}

function TileClusterTooltipRow({ features }: UserContextLayersProps) {
  return (
    <Fragment>
      {features.map((feature, index) => {
        return (
          <div key={`${feature.title}-${index}`} className={styles.popupSection}>
            <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
            <div className={styles.popupSectionContent}>
              {<h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
              <div className={styles.row} key={`${feature.value}-${index}`}>
                <span className={styles.rowText}>
                  TODO: API blocked as needs the event id in the feature properties to fetch vessels
                  information'
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

export default TileClusterTooltipRow
