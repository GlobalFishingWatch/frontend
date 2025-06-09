import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { groupBy, upperFirst } from 'es-toolkit'
import { DateTime } from 'luxon'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { VesselTrackPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectCustomUserDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import I18nDate from 'features/i18n/i18nDate'
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
        const { color, datasetId, title } = featureByType[0]
        const dataview = dataviews.find((d) => d.id === title)
        const dataset = dataview?.datasets?.find((d) => d.id === datasetId)
        const rowTitle = dataset ? getDatasetLabel(dataset) : title
        return (
          <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
            <Icon
              icon="vessel"
              className={styles.layerIcon}
              style={{ color, transform: `rotate(${-45 + featureByType[0].course!}deg)` }}
            />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{rowTitle}</h3>}
              {featureByType.map((feature) => {
                return (
                  <div className={styles.row} key={feature.id}>
                    <div className={styles.rowText}>
                      <p>
                        {!showFeaturesDetails && formatInfoField(feature.title, 'shipname')}{' '}
                        {feature.timestamp && (
                          <span className={cx({ [styles.secondary]: !showFeaturesDetails })}>
                            <I18nDate date={feature.timestamp} format={DateTime.DATETIME_MED} />
                          </span>
                        )}
                      </p>
                      {showFeaturesDetails && (
                        <Fragment>
                          <p key="speed">
                            {feature.speed && (
                              <span>
                                {upperFirst(t('eventInfo.speed', 'Speed'))}:{' '}
                                {feature.speed.toFixed(2)} {t('common.knots', 'knots')}
                              </span>
                            )}
                          </p>
                          <p key="depth">
                            {feature.depth && (
                              <span>
                                {upperFirst(t('eventInfo.depth', 'Depth'))}: {feature.depth}{' '}
                                {t('common.meters', 'meters')}
                              </span>
                            )}
                          </p>
                        </Fragment>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

export default VesselTracksTooltipSection
