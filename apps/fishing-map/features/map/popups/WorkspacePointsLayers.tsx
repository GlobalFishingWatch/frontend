import { Fragment } from 'react'
import { Icon } from '@globalfishingwatch/ui-components'
import { TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'
import ContextLayersRow from './ContextLayersRow'

type WorkspacePointsLayersProps = {
  features: TooltipEventFeature[]
}

function WorkspacePointsTooltipSection({ features }: WorkspacePointsLayersProps) {
  return (
    <Fragment>
      {features.map((feature, index) => {
        const { gfw_id } = feature.properties
        const label = feature.value ?? feature.title
        const id = `${feature.value}-${gfw_id}`
        return (
          <div key={`${feature.title}-${index}`} className={styles.popupSection}>
            <Icon icon="user" className={styles.layerIcon} style={{ color: feature.color }} />
            <div className={styles.popupSectionContent}>
              <ContextLayersRow
                id={id}
                key={`${id}-${index}`}
                label={label}
                showFeaturesDetails={false}
              />
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

export default WorkspacePointsTooltipSection
