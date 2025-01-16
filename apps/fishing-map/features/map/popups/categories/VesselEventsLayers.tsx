import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type { IdentityVessel, SelfReportedInfo } from '@globalfishingwatch/api-types'
import type { VesselEventPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { selectVisibleResources } from 'features/resources/resources.selectors'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { useLocationConnect } from 'routes/routes.hook'
import { selectIsAnyVesselLocation } from 'routes/routes.selectors'
import { getEventDescriptionComponent } from 'utils/events'
import { formatInfoField } from 'utils/info'

import { MAX_TOOLTIP_LIST } from '../../map.slice'

import styles from '../Popup.module.css'

type VesselEventsTooltipRowProps = {
  features: VesselEventPickingObject[]
  showFeaturesDetails?: boolean
}

function VesselEventsTooltipSection({
  features,
  showFeaturesDetails,
}: VesselEventsTooltipRowProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const isAnyVesselLocation = useSelector(selectIsAnyVesselLocation)
  const overflows = features?.length > MAX_TOOLTIP_LIST
  const featuresByType = useMemo(() => {
    const maxFeatures = overflows ? features.slice(0, MAX_TOOLTIP_LIST) : features
    return groupBy(maxFeatures, (f) => f.vesselId)
  }, [overflows, features])

  const resources = useSelector(selectVisibleResources)

  const vesselNamesByType = useMemo(() => {
    return Object.values(featuresByType).map((features) => {
      const vesselId = features[0]?.vesselId
      const vesselResource = Object.values(resources).find((resource) => {
        return (resource.data as IdentityVessel)?.selfReportedInfo?.some(
          (identity: SelfReportedInfo) => vesselId?.includes(identity.id)
        )
      })

      return vesselResource
        ? getVesselProperty(vesselResource.data as IdentityVessel, 'shipname')
        : ''
    })
  }, [resources, featuresByType])

  const onVesselPinClick = () => {
    if (isAnyVesselLocation) {
      dispatchQueryParams({ viewOnlyVessel: false })
    }
  }

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
              <h3 className={styles.popupSectionTitle}>
                {formatInfoField(vesselNamesByType[index], 'shipname')}
              </h3>
            )}
            {featureByType.map((feature, index) => {
              const { description, DescriptionComponent } = getEventDescriptionComponent(
                feature,
                '',
                onVesselPinClick
              )
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
