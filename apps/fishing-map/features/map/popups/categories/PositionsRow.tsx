import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq } from 'es-toolkit'
import { DateTime } from 'luxon'

import type { DetectionThumbnail } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { FourwingsPositionsPickingObject } from '@globalfishingwatch/deck-layers'
import {
  getIsActivityPositionMatched,
  getIsDetectionsPositionMatched,
} from '@globalfishingwatch/deck-layers'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'

import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { selectAllDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import I18nDate from 'features/i18n/i18nDate'
import DetectionThumbnailImage from 'features/map/popups/categories/DetectionThumbnail'
import VesselPin from 'features/vessel/VesselPin'
import { formatInfoField, upperFirst } from 'utils/info'

import popupStyles from '../Popup.module.css'

type PositionsRowProps = {
  loading: boolean
  error: string
  feature: FourwingsPositionsPickingObject
  showFeaturesDetails: boolean
}

function DetectionThumbnails({
  thumbnails,
  scale,
}: {
  thumbnails: DetectionThumbnail[]
  scale?: number
}) {
  const detection = thumbnails.find((thumbnail) => thumbnail.name.endsWith('RGB.png'))
  if (!detection) {
    return null
  }
  return <DetectionThumbnailImage data={detection.data} scale={scale} />
}

function PositionsRow({ loading, error, feature, showFeaturesDetails }: PositionsRowProps) {
  const { t } = useTranslation()
  const allDatasets = useSelector(selectAllDatasets)
  const dataviewInstances = useSelector(selectAllDataviewInstancesResolved)
  const featureDataview = dataviewInstances?.find((instance) => instance.id === feature.layerId)
  const thumbnailsDatasetId = getRelatedDatasetByType(
    featureDataview?.datasets?.[0],
    DatasetTypes.Thumbnails
  )?.id
  const thumbnailsDataset = thumbnailsDatasetId
    ? allDatasets.find((dataset) => dataset.id === thumbnailsDatasetId)
    : undefined

  // TODO get the value based on the sublayer
  const color = feature.sublayers?.[0]?.color
  const angle = feature.properties.bearing ? feature.properties.bearing - 45 : 0
  const isPositionMatched =
    feature.category === 'activity'
      ? getIsActivityPositionMatched(feature)
      : getIsDetectionsPositionMatched(feature)
  const shipname = isPositionMatched
    ? (formatInfoField(feature.properties.shipname, 'shipname') as string)
    : upperFirst(t('vessel.unmatched'))
  const activityDatasets = uniq(
    feature.sublayers?.flatMap((sublayer) => sublayer.datasets || []) || []
  )
  const searchDatasets = allDatasets.flatMap((dataset) => {
    if (activityDatasets.includes(dataset.id)) {
      const relatedVesselDataset = getRelatedDatasetByType(dataset, DatasetTypes.Vessels)
      return relatedVesselDataset?.id || []
    }
    return []
  })

  return (
    <Fragment>
      <div className={cx(popupStyles.popupSection, popupStyles.smallPadding)}>
        <Icon
          icon={feature.properties.bearing ? 'vessel' : 'circle'}
          className={popupStyles.layerIcon}
          style={{ color, transform: `rotate(${angle}deg)` }}
        />
        <div className={popupStyles.popupSectionContent}>
          <div className={popupStyles.row}>
            <span className={cx(popupStyles.rowText, popupStyles.vesselTitle)}>
              {showFeaturesDetails && isPositionMatched && (
                <VesselPin
                  vesselToSearch={{
                    id: feature.properties.vessel_id || feature.properties.id,
                    name: feature.properties.shipname,
                    datasets: searchDatasets,
                  }}
                />
              )}
              <span>
                <span className={popupStyles.marginRight}>{shipname}</span>
                {feature.properties.stime && (
                  <span className={popupStyles.secondary}>
                    {' '}
                    <I18nDate
                      date={feature.properties.stime * 1000}
                      format={DateTime.DATETIME_MED}
                    />
                  </span>
                )}
              </span>
            </span>
          </div>
          {loading && (
            <div className={popupStyles.loading}>
              <Spinner size="small" />
            </div>
          )}
          {!loading && error && <p className={popupStyles.error}>{error}</p>}
          {!loading &&
            feature.category === 'detections' &&
            feature.properties.thumbnails?.length > 0 && (
              <DetectionThumbnails
                thumbnails={feature.properties.thumbnails}
                scale={thumbnailsDataset?.configuration?.scale}
              />
            )}
        </div>
      </div>
    </Fragment>
  )
}

export default PositionsRow
