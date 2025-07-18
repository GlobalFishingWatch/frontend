import { Fragment, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type {
  ApiEvent,
  DataviewInstanceOrigin,
  IdentityVessel,
  SelfReportedInfo,
} from '@globalfishingwatch/api-types'
import { DatasetTypes, EventTypes } from '@globalfishingwatch/api-types'
import type { VesselEventPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'

import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectVisibleResources } from 'features/resources/resources.selectors'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import VesselLink from 'features/vessel/VesselLink'
import type { VesselPinOnClickCb } from 'features/vessel/VesselPin'
import VesselPin from 'features/vessel/VesselPin'
import { selectIsAnyVesselLocation } from 'routes/routes.selectors'
import { getEventDescription, getTimeLabels } from 'utils/events'
import { formatInfoField } from 'utils/info'

import { MAX_TOOLTIP_LIST } from '../../map.slice'

import styles from '../Popup.module.css'

function EventDescription({
  event,
  className = '',
  vesselOrigin,
  onVesselPinClick,
}: {
  event: ApiEvent | VesselEventPickingObject
  className?: string
  vesselOrigin?: DataviewInstanceOrigin
  onVesselPinClick?: VesselPinOnClickCb
}) {
  const dataviews = useSelector(selectVesselsDataviews)
  const vesselDataview = dataviews.find(
    (dataview) => dataview.id === (event as VesselEventPickingObject).layerId
  )
  const vesselId = (event as VesselEventPickingObject).vesselId
  const vesselInfoDataset = vesselDataview?.datasets?.find((d) => d.type === DatasetTypes.Vessels)

  const { start, end, type, encounter } = event
  const encounterVesselName = encounter?.vessel?.name
  const encounterVesselId = encounter?.vessel?.id

  const LinkComponent =
    vesselId && vesselInfoDataset ? (
      <VesselLink
        vesselId={vesselId}
        datasetId={vesselInfoDataset.id}
        eventId={event.id ? event.id.split('.')[0] : undefined}
        eventType={type}
      >
        <IconButton icon="arrow-right" size="tiny" />
      </VesselLink>
    ) : null

  if (type === EventTypes.Encounter && encounterVesselName && encounterVesselId) {
    const time = getTimeLabels({ start, end })
    return (
      <Fragment>
        <p className={className}>
          <Trans
            i18nKey="event.encounterActionWithVesselsPin"
            defaults="had an encounter with <pin></pin>{{encounterVessel}} starting at {{start}} for {{duration}}"
            values={{
              encounterVessel: formatInfoField(encounterVesselName, 'shipname'),
              ...time,
            }}
            components={{
              pin: (
                <VesselPin
                  vesselToResolve={{ id: encounterVesselId, datasetId: DEFAULT_VESSEL_IDENTITY_ID }}
                  size="tiny"
                  onClick={onVesselPinClick}
                  origin={vesselOrigin}
                  style={{ top: '4px' }}
                />
              ),
            }}
          ></Trans>
        </p>
        {LinkComponent}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <p className={className}>{getEventDescription(event)?.description}</p>
      {LinkComponent}
    </Fragment>
  )
}

type VesselEventsTooltipRowProps = {
  features: VesselEventPickingObject[]
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
    return groupBy(maxFeatures, (f) => f.vesselId)
  }, [overflows, features])

  const resources = useSelector(selectVisibleResources)
  const isAnyVesselLocation = useSelector(selectIsAnyVesselLocation)

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
              return (
                <div key={index} className={styles.row}>
                  {showFeaturesDetails ? (
                    <EventDescription
                      event={feature}
                      vesselOrigin={isAnyVesselLocation ? 'vesselProfile' : undefined}
                    />
                  ) : (
                    getEventDescription(feature)?.description
                  )}
                </div>
              )
            })}
            {overflows && (
              <div className={styles.vesselsMore}>
                + {features.length - MAX_TOOLTIP_LIST} {t('common.more')}
              </div>
            )}
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default VesselEventsTooltipSection
