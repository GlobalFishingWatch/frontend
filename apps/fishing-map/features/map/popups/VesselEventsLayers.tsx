import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { groupBy } from 'lodash'
import { DateTime } from 'luxon'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { MAX_TOOLTIP_LIST } from '../map.slice'
import styles from './Popup.module.css'

type VesselEventsTooltipRowProps = {
  features: TooltipEventFeature[]
}

function VesselEventsTooltipSection({ features }: VesselEventsTooltipRowProps) {
  const { t } = useTranslation()
  const overflows = features?.length > MAX_TOOLTIP_LIST
  const maxFeatures = overflows ? features.slice(0, MAX_TOOLTIP_LIST) : features
  const featuresByType = groupBy(maxFeatures, 'layerId')
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => (
        <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
          <span
            className={styles.popupSectionColor}
            style={{ backgroundColor: featureByType[0].color }}
          />
          <div className={styles.popupSectionContent}>
            {featureByType.map((feature, index) => {
              const duration = DateTime.fromISO(feature.properties.end)
                .diff(DateTime.fromISO(feature.properties.start), ['hours', 'minutes', 'seconds'])
                .toObject()
              const encounterVesselName =
                feature.properties.encounterVesselName ||
                t('event.encounterAnotherVessel', 'another vessel')
              return (
                <Fragment key={index}>
                  <div className={styles.row}>
                    <span className={styles.rowText}>
                      {formatI18nDate(feature.properties.start, { format: DateTime.DATETIME_FULL })}{' '}
                    </span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.rowText}>
                      {t(`event.${feature.properties.type}Action` as any)}{' '}
                      {feature.properties.type === 'encounter' &&
                        `${encounterVesselName} ${t('event.during', 'during')} `}
                      {duration.hours !== undefined &&
                        duration.hours > 0 &&
                        `${duration.hours} ${t('common.hour', {
                          count: duration.hours,
                        })} `}
                      {duration.minutes &&
                        `${duration.minutes} ${t('common.minute', { count: duration.minutes })}`}
                    </span>
                  </div>
                </Fragment>
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
