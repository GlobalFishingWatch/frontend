import React, { Fragment } from 'react'
import { groupBy } from 'lodash'
import { TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'
import ContextLayersRow from './ContextLayersRow'

type UserPointsLayersProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function UserPointsTooltipSection({
  features,
  showFeaturesDetails = false,
}: UserPointsLayersProps) {
  const featuresByType = groupBy(features, 'layerId')
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => (
        <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
          <span
            className={styles.popupSectionColor}
            style={{ backgroundColor: featureByType[0].color }}
          />
          <div className={styles.popupSectionContent}>
            {showFeaturesDetails && (
              <h3 className={styles.popupSectionTitle}>{featureByType[0].title}</h3>
            )}
            {featureByType.map((feature, index) => {
              const { gfw_id } = feature.properties
              const label = feature.value ?? feature.title
              const id = `${feature.value}-${gfw_id}`
              return (
                <ContextLayersRow
                  id={id}
                  key={`${id}-${index}`}
                  label={label}
                  showFeaturesDetails={showFeaturesDetails}
                />
              )
            })}
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default UserPointsTooltipSection
