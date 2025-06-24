import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { groupBy, upperFirst } from 'es-toolkit'
import type { Point } from 'geojson'
import { DateTime } from 'luxon'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { VesselTrackPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectCustomUserDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import I18nDate, { formatLocalTimeDate } from 'features/i18n/i18nDate'
import { getUTCDateTime } from 'utils/dates'
import { getOffsetHours } from 'utils/events'
import { formatInfoField } from 'utils/info'

import styles from '../Popup.module.css'

type VesselTracksLayersProps = {
  features: VesselTrackPickingObject[]
  showFeaturesDetails: boolean
}

function VesselTracksTooltipSection({
  features,
  showFeaturesDetails = false,
}: VesselTracksLayersProps) {
  const { t } = useTranslation()
  const dataviews = useSelector(selectCustomUserDataviews) as UrlDataviewInstance[]
  const featuresByType = groupBy(features, (f) => f.layerId)
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => {
        const {
          color,
          datasetId,
          title,
          interactionType,
          course,
          id,
          speed,
          depth,
          geometry,
          timestamp,
        } = featureByType[0]
        const hoursOffset = getOffsetHours((geometry as Point)?.coordinates[0] as number)
        const startLocalTimeLabel = formatLocalTimeDate(
          getUTCDateTime(timestamp as number).plus({ hours: hoursOffset })
        )
        const dataview = dataviews.find((d) => d.id === title)
        const dataset = dataview?.datasets?.find((d) => d.id === datasetId)
        const rowTitle = dataset ? getDatasetLabel(dataset) : title
        if (showFeaturesDetails && interactionType === 'segment') {
          return null
        }
        return (
          <div key={`${title}-${index}`} className={styles.popupSection}>
            <Icon
              icon="vessel"
              className={styles.layerIcon}
              style={{ color, transform: `rotate(${-45 + course!}deg)` }}
            />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{rowTitle}</h3>}
              <div className={styles.row} key={id}>
                <div className={styles.rowText}>
                  <p>
                    {!showFeaturesDetails && formatInfoField(title, 'shipname')}{' '}
                    {interactionType === 'point' && timestamp && (
                      <span className={cx({ [styles.secondary]: !showFeaturesDetails })}>
                        <I18nDate date={timestamp} format={DateTime.DATETIME_MED} />
                        {` (${startLocalTimeLabel})`}
                      </span>
                    )}
                  </p>
                  {showFeaturesDetails && (
                    <Fragment>
                      <p key="speed">
                        {speed && (
                          <span>
                            {upperFirst(t('eventInfo.speed', 'Speed'))}: {speed.toFixed(2)}{' '}
                            {t('common.knots', 'knots')}
                          </span>
                        )}
                      </p>
                      <p key="depth">
                        {depth && (
                          <span>
                            {upperFirst(t('eventInfo.depth', 'Depth'))}: {depth}{' '}
                            {t('common.meters', 'meters')}
                          </span>
                        )}
                      </p>
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

export default VesselTracksTooltipSection
