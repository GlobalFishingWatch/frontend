import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { groupBy } from 'lodash'
import { useSelector } from 'react-redux'
import { Icon } from '@globalfishingwatch/ui-components'
import { EventTypes, IdentityVessel, SelfReportedInfo } from '@globalfishingwatch/api-types'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { getEventDescriptionComponent } from 'utils/events'
import { selectVisibleResources } from 'features/resources/resources.selectors'
import { getVesselProperty } from 'features/vessel/vessel.utils'
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
        return (resource.data as IdentityVessel).selfReportedInfo?.some(
          (identity: SelfReportedInfo) => vesselId.includes(identity.id)
        )
      })

      return vesselResource
        ? getVesselProperty(vesselResource.data as IdentityVessel, 'shipname')
        : ''
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
              const {
                start,
                end,
                type,
                vesselName,
                encounterVesselName,
                encounterVesselId,
                portName,
                portFlag,
              } = feature.properties
              const { description, DescriptionComponent } = getEventDescriptionComponent({
                start,
                end,
                type: type as EventTypes,
                mainVesselName: vesselName,
                encounterVesselName,
                encounterVesselId,
                portName,
                portFlag,
                className: styles.textContainer,
              })
              return (
                <div key={index} className={styles.row}>
                  {showFeaturesDetails ? DescriptionComponent : description}
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
