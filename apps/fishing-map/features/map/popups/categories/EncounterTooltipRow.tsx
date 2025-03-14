import { useTranslation } from 'react-i18next'

import { Icon } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nDate from 'features/i18n/i18nDate'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { formatInfoField } from 'utils/info'

import type {
  ExtendedEventVessel,
  ExtendedFeatureSingleEvent,
  SliceExtendedClusterPickingObject,
} from '../../map.slice'

import styles from '../Popup.module.css'

const parseEncounterEvent = (
  event: ExtendedFeatureSingleEvent | undefined
): ExtendedFeatureSingleEvent | undefined => {
  if (!event) return event
  return {
    ...event,
    vessel: event.vessel,
    ...(event.encounter && {
      encounter: {
        ...event.encounter,
        vessel: event.encounter?.vessel,
      },
    }),
  }
}

type EncounterTooltipRowProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  showFeaturesDetails: boolean
  error?: string
}

function EncounterTooltipRow({ feature, showFeaturesDetails, error }: EncounterTooltipRowProps) {
  const { t } = useTranslation()

  const event = parseEncounterEvent(feature.event)

  const title = getDatasetLabel({ id: feature.datasetId! })

  return (
    <div className={styles.popupSection}>
      <Icon icon="encounters" className={styles.layerIcon} style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{title}</h3>}
        {error && <p className={styles.error}>{error}</p>}
        {showFeaturesDetails && (
          <div className={styles.row}>
            {event ? (
              <div className={styles.rowContainer}>
                <span className={styles.rowText}>
                  <I18nDate date={event.start as string} />
                </span>
                <div className={styles.flex}>
                  {event.vessel && (
                    <div className={styles.rowColum}>
                      <p className={styles.rowTitle}>
                        {t(`vessel.vesselTypes.${event.vessel.type}`, event.vessel.type)}
                      </p>
                      <div className={styles.centered}>
                        <span className={styles.rowText}>
                          <VesselLink vesselId={event.vessel.id} datasetId={event.vessel.dataset}>
                            {formatInfoField(event.vessel?.name, 'shipname')}
                          </VesselLink>
                        </span>
                        {(event.vessel as ExtendedEventVessel).dataset && (
                          <VesselPin
                            vesselToResolve={{ ...event.vessel, datasetId: event.vessel.dataset }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {event.encounter?.vessel && (
                    <div className={styles.row}>
                      <div className={styles.rowColum}>
                        <span className={styles.rowTitle}>
                          {t(
                            `vessel.vesselTypes.${event.encounter.vessel.type}`,
                            event.encounter.vessel.type
                          )}
                        </span>
                        <div className={styles.centered}>
                          <span className={styles.rowText}>
                            <VesselLink
                              vesselId={event.encounter.vessel?.id}
                              datasetId={event.encounter.vessel?.dataset}
                            >
                              {formatInfoField(event.encounter.vessel?.name, 'shipname')}
                            </VesselLink>
                          </span>
                          {(event.encounter?.vessel as ExtendedEventVessel).dataset && (
                            <VesselPin
                              vesselToResolve={{
                                ...event.encounter.vessel,
                                datasetId: event.encounter.vessel.dataset,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.row}>
                  {/* TODO: Add link to vessel portal in case we support it */}
                  {/* <VesselLink vesselId={event.vessel.id} datasetId={event.vessel.dataset}>
                    <Button target="_blank" size="small" className={styles.btnLarge}>
                      {t('common.seeMore', 'See more')}
                    </Button>
                  </VesselLink> */}
                </div>
              </div>
            ) : (
              t('event.noData', 'No data available')
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EncounterTooltipRow
