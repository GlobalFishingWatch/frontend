import { Fragment, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'
import cx from 'classnames'
import { uniq } from 'es-toolkit'
import { DateTime } from 'luxon'

import type { DetectionThumbnail } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import {
  getDatasetConfiguration,
  getRelatedDatasetByType,
} from '@globalfishingwatch/datasets-client'
import type { FourwingsPositionsPickingObject } from '@globalfishingwatch/deck-layers'
import {
  getIsActivityPositionMatched,
  getIsDetectionsPositionMatched,
  getPositionBearing,
} from '@globalfishingwatch/deck-layers'
import { Icon, IconButton, Spinner } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/map/workspaces'
import { selectAllDatasets } from 'features/_map/datasets/datasets.slice'
import { isRealTimeDataview } from 'features/_map/dataviews/dataviews.utils'
import { selectAllDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'
import type { PositionRealTimeVessel } from 'features/_map/map/map.slice'
import { selectWorkspace } from 'features/_map/workspace/workspace.selectors'
import VesselLink from 'features/_vessels/vessel/VesselLink'
import VesselPin from 'features/_vessels/vessel/VesselPin'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { FAKE_VESSEL_NAME, selectDebugOptions } from 'features/debug/debug.slice'
import I18nDate from 'features/i18n/i18nDate'
import { ROUTE_PATHS } from 'router/routes.utils'
import { formatInfoField, upperFirst } from 'utils/info'

import popupStyles from '../Popup.module.css'

const DetectionThumbnailImage = lazy(
  () => import('features/_map/map/popups/categories/DetectionThumbnail')
)

type PositionsRowProps = {
  loading: boolean
  error: string
  feature: FourwingsPositionsPickingObject
  showFeaturesDetails: boolean
}

function DetectionThumbnails({
  thumbnails,
  scale,
  datasetId,
}: {
  thumbnails: DetectionThumbnail[]
  scale?: number
  datasetId?: string
}) {
  const detection = thumbnails.find((thumbnail) => thumbnail.name.endsWith('RGB.png'))
  if (!detection) {
    return null
  }
  return (
    <DetectionThumbnailImage
      id={detection.name}
      data={detection.data}
      scale={scale}
      datasetId={datasetId}
    />
  )
}

function PositionsRow({ loading, error, feature, showFeaturesDetails }: PositionsRowProps) {
  const { t } = useTranslation()
  const allDatasets = useSelector(selectAllDatasets)
  const workspace = useSelector(selectWorkspace)
  const hideVesselNames = useSelector(selectDebugOptions)?.hideVesselNames
  const dataviewInstances = useSelector(selectAllDataviewInstancesResolved)
  const featureDataview = dataviewInstances?.find((instance) => instance.id === feature.layerId)
  const thumbnailsDatasetId = getRelatedDatasetByType(
    featureDataview?.datasets?.[0],
    DatasetTypes.Thumbnails
  )?.id
  const isRealTime = featureDataview ? isRealTimeDataview(featureDataview) : false
  const isPositionThumbnail = feature.category === 'detections' && thumbnailsDatasetId !== undefined
  const thumbnailsDataset = thumbnailsDatasetId
    ? allDatasets.find((dataset) => dataset.id === thumbnailsDatasetId)
    : undefined

  // TODO get the value based on the sublayer
  const color = feature.sublayers?.[0]?.color
  const bearing = getPositionBearing(feature)
  const angle = bearing !== undefined ? bearing - 45 : 0
  const isPositionMatched =
    feature.category === 'activity'
      ? getIsActivityPositionMatched(feature)
      : getIsDetectionsPositionMatched(feature)

  // Realtime tiles only have the MMSI, the vessel identity is resolved by the interaction thunk
  const realTimeVessel = feature.properties.realTimeVessel as PositionRealTimeVessel | undefined
  const realTimeIdentity = realTimeVessel?.identity

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
  const datasetId = feature.sublayers?.[0]?.datasets?.[0]
  // No realtime identity means there was no match or several vessels sharing the MMSI, so we can't pick one for the user
  // this adds a link to the advanced search to allow the user to pick one manually
  const showRealTimeSearchLink = isRealTime && !loading && !realTimeIdentity

  const renderShipname = () => {
    if (hideVesselNames) {
      return FAKE_VESSEL_NAME
    }
    if (isRealTime) {
      const mmsi = (
        <span>
          {t((t) => t.vessel.mmsi)}: {feature.properties.id}
        </span>
      )
      if (realTimeIdentity) {
        return (
          <span>
            <VesselLink
              vesselId={realTimeIdentity.id}
              identity={realTimeIdentity}
              datasetId={realTimeIdentity.dataset}
              className={popupStyles.marginRight}
            >
              {formatInfoField(realTimeIdentity.shipname, 'shipname') as string}
            </VesselLink>
            ({mmsi})
          </span>
        )
      }
      return mmsi
    } else if (isPositionMatched) {
      return (
        <VesselLink vesselId={vesselId} className={popupStyles.marginRight}>
          {formatInfoField(feature.properties.shipname, 'shipname') as string}
        </VesselLink>
      )
    }
    return (
      <span className={popupStyles.marginRight}>{upperFirst(t((t) => t.vessel.unmatched))}</span>
    )
  }

  const renderVesselPin = () => {
    if (!showFeaturesDetails) {
      return null
    }
    if (isRealTime) {
      if (loading) {
        return <Spinner size="tiny" className={popupStyles.marginRight} />
      }
      return realTimeVessel ? <VesselPin vessel={realTimeVessel.vessel} /> : null
    }
    if (isPositionMatched && !isRealTime) {
      return (
        <VesselPin
          vesselToSearch={{
            id: vesselId,
            name: feature.properties.shipname,
            datasets: searchDatasets,
          }}
        />
      )
    }
    return null
  }

  const renderSearchLink = () => {
    if (!showFeaturesDetails || !showRealTimeSearchLink) {
      return null
    }
    return (
      <Link
        to={ROUTE_PATHS.WORKSPACE_SEARCH}
        params={{
          category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
          workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
        }}
        search={{ searchOption: 'advanced', ssvid: feature.properties.id }}
      >
        <IconButton
          icon="search"
          size="tiny"
          tooltip={t((t) => t.vessel.skylightSearch)}
          onClick={() => {
            trackEvent({
              category: TrackCategory.MapInteraction,
              action: 'click_realtime_search_from_popup',
            })
          }}
        />
      </Link>
    )
  }

  return (
    <Fragment>
      <Icon
        icon={bearing !== undefined ? 'vessel' : 'circle'}
        className={popupStyles.layerIcon}
        style={{ color, transform: `rotate(${angle}deg)` }}
      />
      <div className={popupStyles.popupSectionContent}>
        <div className={cx(popupStyles.rowCenter, { [popupStyles.rowColumn]: isRealTime })}>
          <span className={cx(popupStyles.rowText, popupStyles.vesselTitle)}>
            {renderSearchLink()}
            {renderVesselPin()}
            {renderShipname()}
          </span>
          {feature.properties.stime && (
            <span className={popupStyles.secondary}>
              <I18nDate
                date={feature.properties.stime * 1000}
                {...(isRealTime && {
                  format: DateTime.DATETIME_MED_WITH_SECONDS,
                  showUTCLabel: true,
                })}
              />
            </span>
          )}
        </div>
        {loading && isPositionThumbnail && (
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
              datasetId={datasetId}
            />
          )}
      </div>
    </Fragment>
  )
}

export default PositionsRow
