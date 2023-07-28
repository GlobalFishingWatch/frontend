import { Fragment } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import {
  DatasetSubCategory,
  DatasetTypes,
  DataviewInstance,
  Resource,
  ResourceStatus,
} from '@globalfishingwatch/api-types'
import { resolveEndpoint, setResource } from '@globalfishingwatch/dataviews-client'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getDetectionsTimestamps } from 'utils/info'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  getPresenceVesselDataviewInstance,
  getVesselDataviewInstance,
  getVesselDataviewInstanceDatasetConfig,
  getVesselInWorkspace,
} from 'features/dataviews/dataviews.utils'
import { getDatasetLabel, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import I18nNumber from 'features/i18n/i18nNumber'
import { ActivityProperty, ExtendedFeatureVessel, MAX_TOOLTIP_LIST } from 'features/map/map.slice'
import { getEventLabel } from 'utils/analytics'
import { isGFWUser } from 'features/user/user.slice'
import { PRESENCE_DATASET_ID, PRESENCE_TRACKS_DATASET_ID } from 'features/datasets/datasets.slice'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { t } from 'features/i18n/i18n'
import I18nDate from 'features/i18n/i18nDate'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { TimeRangeDates } from 'features/map/controls/MapInfo'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { getUTCDateTime } from 'utils/dates'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { GLOBAL_VESSELS_DATASET_ID } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION,
  TooltipEventFeature,
} from '../map.hooks'
import styles from './VesselsTable.module.css'

export const getVesselTableTitle = (feature: TooltipEventFeature) => {
  let title = feature.title
  return title
}

export const VesselDetectionTimestamps = ({ vessel }: { vessel: ExtendedFeatureVessel }) => {
  const { setTimerange } = useTimerangeConnect()
  const detectionsTimestamps = getDetectionsTimestamps(vessel)
  const hasDetectionsTimestamps = detectionsTimestamps && detectionsTimestamps.length > 0
  const hasMultipleDetectionsTimestamps = hasDetectionsTimestamps && detectionsTimestamps.length > 1

  const start = hasDetectionsTimestamps
    ? getUTCDateTime(detectionsTimestamps[0]).startOf('day').toISO()
    : ''

  const end = hasDetectionsTimestamps
    ? getUTCDateTime(detectionsTimestamps[detectionsTimestamps.length - 1])
        .endOf('day')
        .toISO()
    : ''

  if (!hasDetectionsTimestamps) return null

  return hasMultipleDetectionsTimestamps ? (
    <Tooltip content={t('timebar.fitOnThisDates', 'Fit time range to these dates')}>
      <button
        className={styles.timestampBtn}
        onClick={() => {
          setTimerange({
            start,
            end,
          })
        }}
      >
        (<TimeRangeDates start={start} end={end} format={DateTime.DATE_MED} />)
      </button>
    </Tooltip>
  ) : (
    <Tooltip content={t('timebar.focusOnThisDay', 'Focus time range on this day')}>
      <button
        className={styles.timestampBtn}
        onClick={() => {
          setTimerange({
            start,
            end: getUTCDateTime(start).endOf('day').toISO(),
          })
        }}
      >
        (<I18nDate date={start} />)
      </button>
    </Tooltip>
  )
}

function VesselsTable({
  feature,
  vesselProperty = 'hours',
  activityType = DatasetSubCategory.Fishing,
}: {
  feature: TooltipEventFeature
  vesselProperty?: ActivityProperty
  activityType?: DatasetSubCategory
}) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const gfwUser = useSelector(isGFWUser)
  const vesselsInWorkspace = useSelector(selectActiveTrackDataviews)

  const interactionAllowed = [...SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION].includes(
    feature.temporalgrid?.sublayerInteractionType || ''
  )

  const vessels = feature.vesselsInfo?.vessels?.slice(0, MAX_TOOLTIP_LIST)
  console.log('🚀 ~ vessels:', vessels)

  const hasPinColumn =
    interactionAllowed &&
    feature?.vesselsInfo?.vessels?.some((vessel) => {
      const hasDatasets = vessel.infoDataset !== undefined || vessel.trackDataset !== undefined
      return hasDatasets
    })

  const populateVesselInfoResource = (
    vessel: ExtendedFeatureVessel,
    vesselDataviewInstance: DataviewInstance
  ) => {
    const infoDatasetConfig = getVesselDataviewInstanceDatasetConfig(
      vessel?.id,
      vesselDataviewInstance.config || {}
    )?.find((dc) => dc.datasetId === vessel.infoDataset?.id)
    if (vessel.infoDataset && infoDatasetConfig) {
      const url = resolveEndpoint(vessel.infoDataset, infoDatasetConfig)
      if (url) {
        const resource: Resource = {
          url,
          dataset: vessel.infoDataset,
          datasetConfig: infoDatasetConfig,
          dataviewId: vesselDataviewInstance.dataviewId as string,
          data: vessel,
          status: ResourceStatus.Finished,
        }
        dispatch(setResource(resource))
      }
    }
  }
  const onVesselClick = (
    ev: React.MouseEvent<Element, MouseEvent>,
    vessel: ExtendedFeatureVessel
  ) => {
    const vesselInWorkspace = getVesselInWorkspace(vesselsInWorkspace, vessel.id)
    if (vesselInWorkspace) {
      deleteDataviewInstance(vesselInWorkspace.id)
      return
    }

    let vesselDataviewInstance: DataviewInstance | undefined
    if (
      gfwUser &&
      vessel.dataset?.id?.includes(PRESENCE_DATASET_ID) &&
      vessel.trackDataset?.id?.includes(PRESENCE_TRACKS_DATASET_ID)
    ) {
      vesselDataviewInstance = getPresenceVesselDataviewInstance(vessel, {
        info: vessel.infoDataset?.id,
        track: vessel.trackDataset?.id,
      })
    } else {
      const vesselEventsDatasets = getRelatedDatasetsByType(
        vessel.infoDataset || vessel.dataset,
        DatasetTypes.Events
      )
      const eventsDatasetsId =
        vesselEventsDatasets && vesselEventsDatasets?.length
          ? vesselEventsDatasets.map((d) => d.id)
          : []

      vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        info: vessel.infoDataset?.id,
        track: vessel.trackDataset?.id,
        ...(eventsDatasetsId.length > 0 && { events: eventsDatasetsId }),
      })
    }

    upsertDataviewInstance(vesselDataviewInstance)
    populateVesselInfoResource(vessel, vesselDataviewInstance)

    trackEvent({
      category: TrackCategory.Tracks,
      action: 'Click in vessel from grid cell panel',
      label: getEventLabel([vessel.dataset.id, vessel.id]),
    })
  }
  const isHoursProperty = vesselProperty !== 'detections'
  const isPresenceActivity = activityType === DatasetSubCategory.Presence
  return (
    <Fragment>
      {vessels!?.length > 0 && (
        <table className={cx(styles.vesselsTable)}>
          <thead>
            <tr>
              <th colSpan={hasPinColumn ? 2 : 1}>{t('common.vessel_other', 'Vessels')}</th>
              <th>{t('vessel.flag', 'flag')}</th>
              <th>
                {isPresenceActivity ? t('vessel.type', 'Type') : t('vessel.gearType_short', 'Gear')}
              </th>
              {/* Disabled for detections to allocate some space for timestamps interaction */}
              {vesselProperty !== 'detections' && <th>{t('vessel.source_short', 'source')}</th>}
              <th className={isHoursProperty ? styles.vesselsTableHeaderRight : ''}>
                {feature.temporalgrid?.unit === 'hours' && t('common.hour_other', 'hours')}
                {feature.temporalgrid?.unit === 'days' && t('common.days_other', 'days')}
                {feature.temporalgrid?.unit === 'detections' &&
                  t('common.detection_other', 'detections')}
              </th>
            </tr>
          </thead>
          <tbody>
            {vessels?.map((vessel, i) => {
              const vesselName = formatInfoField(vessel.shipname, 'name')

              const vesselType = isPresenceActivity
                ? `${t(
                    `vessel.vesselTypes.${vessel.shiptype?.toLowerCase()}` as any,
                    vessel.shiptype ?? EMPTY_FIELD_PLACEHOLDER
                  )}`
                : `${t(
                    `vessel.gearTypes.${vessel.geartype?.toLowerCase()}` as any,
                    vessel.geartype ?? EMPTY_FIELD_PLACEHOLDER
                  )}`

              // Temporary workaround for public-global-all-vessels dataset as we
              // don't want to show the pin only for that dataset for guest users
              const hasDatasets = vessel.infoDataset?.id?.includes(GLOBAL_VESSELS_DATASET_ID)
                ? vessel.infoDataset !== undefined && vessel.trackDataset !== undefined
                : vessel.infoDataset !== undefined || vessel.trackDataset !== undefined

              const vesselInWorkspace = getVesselInWorkspace(vesselsInWorkspace, vessel.id)

              const pinTrackDisabled = !interactionAllowed || !hasDatasets
              const detectionsTimestamps = getDetectionsTimestamps(vessel)
              return (
                <tr key={i}>
                  {!pinTrackDisabled && (
                    <td className={styles.icon}>
                      <IconButton
                        icon={vesselInWorkspace ? 'pin-filled' : 'pin'}
                        style={{
                          color: vesselInWorkspace ? vesselInWorkspace.config?.color : '',
                        }}
                        tooltip={
                          vesselInWorkspace
                            ? t(
                                'search.vesselAlreadyInWorkspace',
                                'This vessel is already in your workspace'
                              )
                            : t('search.seeVessel', 'See vessel')
                        }
                        onClick={(e) => onVesselClick(e, vessel)}
                        size="small"
                      />
                    </td>
                  )}
                  <td colSpan={hasPinColumn && pinTrackDisabled ? 2 : 1}>{vesselName}</td>
                  <td className={styles.columnSpace}>
                    <Tooltip content={t(`flags:${vessel.flag as string}` as any)}>
                      <span>{vessel.flag || EMPTY_FIELD_PLACEHOLDER}</span>
                    </Tooltip>
                  </td>

                  <td className={styles.columnSpace}>{vesselType}</td>
                  {isHoursProperty && (
                    <td className={styles.columnSpace}>
                      <Tooltip content={getDatasetLabel(vessel.infoDataset)}>
                        <DatasetLabel dataset={vessel.infoDataset} />
                      </Tooltip>
                    </td>
                  )}
                  <td
                    className={cx(styles.columnSpace, {
                      [styles.vesselsTableHour]: isHoursProperty,
                      [styles.largeColumn]: detectionsTimestamps?.length > 1,
                    })}
                  >
                    <I18nNumber number={vessel[vesselProperty]} />{' '}
                    {detectionsTimestamps?.length > 0 && (
                      <VesselDetectionTimestamps vessel={vessel} />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {feature.vesselsInfo && feature.vesselsInfo.overflow && (
        <p className={styles.vesselsMore}>
          + {feature.vesselsInfo.overflowNumber} {t('common.more', 'more')}
        </p>
      )}
    </Fragment>
  )
}

export default VesselsTable
