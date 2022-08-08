import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { groupBy } from 'lodash'
import { useSelector } from 'react-redux'
import { Icon } from '@globalfishingwatch/ui-components'
import { EventTypes } from '@globalfishingwatch/api-types'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { getEventDescription } from 'utils/events'
import { selectVisibleResources } from 'features/resources/resources.selectors'
import { formatInfoField } from 'utils/info'
import { MAX_TOOLTIP_LIST } from '../map.slice'
import styles from './Popup.module.css'

type VesselEventsTooltipRowProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails?: boolean
}

function VesselEventsTooltipSection({
  features,
  showFeaturesDetails,
}: VesselEventsTooltipRowProps) {
  const { t } = useTranslation()
  const overflows = features?.length > MAX_TOOLTIP_LIST
  const featuresByType = useMemo(() => {
    const maxFeatures = overflows ? features.slice(0, MAX_TOOLTIP_LIST) : features
    return groupBy(maxFeatures, 'properties.vesselId')
  }, [overflows, features])

  const resources = useSelector(selectVisibleResources)

  const vesselNamesByType = useMemo(() => {
    return Object.values(featuresByType).map((features) => {
      const vesselId = features[0].properties.vesselId
      const vesselResource = Object.values(resources).find((resource) => {
        return (resource.data as any)?.id === vesselId
      })
      return vesselResource ? formatInfoField((vesselResource as any).data.shipname, 'name') : ''
    })
  }, [resources, featuresByType])

  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => (
        <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
          <Icon
            icon="vessel"
            className={styles.layerIcon}
            style={{ color: featureByType[0].color }}
          />
          <div className={styles.popupSectionContent}>
            {vesselNamesByType[index] && showFeaturesDetails && (
              <h3 className={styles.popupSectionTitle}>{vesselNamesByType[index]}</h3>
            )}
            {featureByType.map((feature, index) => {
              const { description } = getEventDescription({
                start: feature.properties.start,
                end: feature.properties.end,
                type: feature.properties.type as EventTypes,
                encounterVesselName: feature.properties.encounterVesselName,
              })
              return (
                <div key={index} className={styles.row}>
                  {description}
                </div>
              )
            })}

            {overflows && (
              <div className={styles.vesselsMore}>
                + {features.length - MAX_TOOLTIP_LIST} {t('common.more', 'more')}
              </div>
            )}
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default VesselEventsTooltipSection
