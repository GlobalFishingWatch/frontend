import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq } from 'es-toolkit'

import type { DetectionThumbnail } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import type { FourwingsPositionsPickingObject } from '@globalfishingwatch/deck-layers'
import {
  getIsActivityPositionMatched,
  getIsDetectionsPositionMatched,
} from '@globalfishingwatch/deck-layers'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'

import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { selectAllDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { FAKE_VESSEL_NAME, selectDebugOptions } from 'features/debug/debug.slice'
import I18nDate from 'features/i18n/i18nDate'
import DetectionThumbnailImage from 'features/map/popups/categories/DetectionThumbnail'
import VesselLink from 'features/vessel/VesselLink'
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
  return <DetectionThumbnailImage id={detection.name} data={detection.data} scale={scale} />
}

function PositionsRow({ loading, error, feature, showFeaturesDetails }: PositionsRowProps) {
  const { t } = useTranslation()
  const allDatasets = useSelector(selectAllDatasets)
  const hideVesselNames = useSelector(selectDebugOptions)?.hideVesselNames
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
  const angle = feature.properties.bearing !== undefined ? feature.properties.bearing - 45 : 0
  const isPositionMatched =
    feature.category === 'activity'
      ? getIsActivityPositionMatched(feature)
      : getIsDetectionsPositionMatched(feature)

  const shipname = isPositionMatched
    ? (formatInfoField(feature.properties.shipname, 'shipname') as string)
    : upperFirst(t((t) => t.vessel.unmatched))
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

  const vesselId = feature.properties.vessel_id || feature.properties.id

  return (
    <Fragment>
      <Icon
        icon={feature.properties.bearing !== undefined ? 'vessel' : 'circle'}
        className={popupStyles.layerIcon}
        style={{ color, transform: `rotate(${angle}deg)` }}
      />
      <div className={popupStyles.popupSectionContent}>
        <div className={popupStyles.row}>
          <span className={cx(popupStyles.rowText, popupStyles.vesselTitle)}>
            {showFeaturesDetails && isPositionMatched && (
              <VesselPin
                vesselToSearch={{
                  id: vesselId,
                  name: feature.properties.shipname,
                  datasets: searchDatasets,
                }}
              />
            )}
            <span>
              <span className={popupStyles.marginRight}>
                {isPositionMatched ? (
                  <VesselLink vesselId={vesselId}>
                    {hideVesselNames ? FAKE_VESSEL_NAME : shipname}
                  </VesselLink>
                ) : (
                  <span>{hideVesselNames ? FAKE_VESSEL_NAME : shipname}</span>
                )}
              </span>
              {feature.properties.stime && (
                <span className={popupStyles.secondary}>
                  {' '}
                  <I18nDate date={feature.properties.stime * 1000} />
                </span>
              )}
            </span>
          </span>
        </div>
        {loading && (
          <div className={cx(popupStyles.loading, popupStyles.thumbnailLoading)}>
            <Spinner size="small" />
          </div>
        )}
        {!loading && error && <p className={popupStyles.error}>{error}</p>}
        {!loading &&
          feature.category === 'detections' &&
          feature.properties.thumbnails?.length > 0 && (
            <DetectionThumbnails
              thumbnails={feature.properties.thumbnails}
              scale={getDatasetConfiguration(thumbnailsDataset, 'thumbnailsV1')?.scale}
            />
          )}
      </div>
    </Fragment>
  )
}

export default PositionsRow
