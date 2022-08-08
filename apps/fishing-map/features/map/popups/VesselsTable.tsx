import { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { IconButton, Modal, Tooltip } from '@globalfishingwatch/ui-components'
import { DatasetTypes, DataviewInstance } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getDetectionsTimestamps } from 'utils/info'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  getPresenceVesselDataviewInstance,
  getVesselDataviewInstance,
  getVesselInWorkspace,
} from 'features/dataviews/dataviews.utils'
import { getDatasetLabel, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import I18nNumber from 'features/i18n/i18nNumber'
import {
  ActivityProperty,
  ExtendedFeatureVessel,
  MAX_TOOLTIP_LIST,
  MAX_VESSELS_LOAD,
} from 'features/map/map.slice'
import { getEventLabel } from 'utils/analytics'
import { isGFWUser } from 'features/user/user.slice'
import { PRESENCE_DATASET_ID, PRESENCE_TRACKS_DATASET_ID } from 'features/datasets/datasets.slice'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { t } from 'features/i18n/i18n'
import I18nDate, { formatI18nDate } from 'features/i18n/i18nDate'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { TimeRangeDates } from 'features/map/controls/MapInfo'
import GFWOnly from 'features/user/GFWOnly'
import DatasetLabel from 'features/datasets/DatasetLabel'
import {
  SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION,
  TooltipEventFeature,
} from '../map.hooks'
import styles from './VesselsTable.module.css'

export const getVesselTableTitle = (feature: TooltipEventFeature) => {
  let title = feature.title
  if (feature.temporalgrid && feature.temporalgrid.interval === '10days') {
    title = [
      title,
      t('common.dateRange', {
        start: formatI18nDate(feature.temporalgrid.visibleStartDate),
        end: formatI18nDate(feature.temporalgrid.visibleEndDate),
        defaultValue: 'between {{start}} and {{end}}',
      }),
    ].join(' ')
  }
  return title
}

export const VesselDetectionTimestamps = ({ vessel }: { vessel: ExtendedFeatureVessel }) => {
  const { setTimerange } = useTimerangeConnect()
  const detectionsTimestamps = getDetectionsTimestamps(vessel)
  const hasDetectionsTimestamps = detectionsTimestamps && detectionsTimestamps.length > 0
  const hasMultipleDetectionsTimestamps = hasDetectionsTimestamps && detectionsTimestamps.length > 1

  const start = hasDetectionsTimestamps
    ? DateTime.fromISO(detectionsTimestamps[0], { zone: 'utc' }).startOf('day').toISO()
    : ''

  const end = hasDetectionsTimestamps
    ? DateTime.fromISO(detectionsTimestamps[detectionsTimestamps.length - 1], {
        zone: 'utc',
      })
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
            end: DateTime.fromISO(start, { zone: 'utc' }).endOf('day').toISO(),
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
  showFullList,
  vesselProperty = 'hours',
}: {
  feature: TooltipEventFeature
  showFullList?: boolean
  vesselProperty?: ActivityProperty
}) {
  const { t } = useTranslation()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const gfwUser = useSelector(isGFWUser)
  const vesselsInWorkspace = useSelector(selectActiveTrackDataviews)

  const [modalOpen, setModalOpen] = useState(false)

  const onModalClose = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const interactionAllowed = [...SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION].includes(
    feature.temporalgrid?.sublayerInteractionType || ''
  )

  const title = getVesselTableTitle(feature)
  const vessels = showFullList
    ? feature.vesselsInfo?.vessels?.slice(0, MAX_VESSELS_LOAD)
    : feature.vesselsInfo?.vessels?.slice(0, MAX_TOOLTIP_LIST)

  const hasPinColumn =
    showFullList ||
    (interactionAllowed &&
      feature?.vesselsInfo?.vessels?.some((vessel) => {
        const hasDatasets = vessel.infoDataset !== undefined || vessel.trackDataset !== undefined
        return hasDatasets
      }))

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
      vessel.dataset?.id.includes(PRESENCE_DATASET_ID) &&
      vessel.trackDataset?.id.includes(PRESENCE_TRACKS_DATASET_ID)
    ) {
      vesselDataviewInstance = getPresenceVesselDataviewInstance(vessel, {
        trackDatasetId: vessel.trackDataset?.id,
        infoDatasetId: vessel.infoDataset?.id,
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
        trackDatasetId: vessel.trackDataset?.id,
        infoDatasetId: vessel.infoDataset?.id,
        ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
      })
    }

    upsertDataviewInstance(vesselDataviewInstance)

    uaEvent({
      category: 'Tracks',
      action: 'Click in vessel from grid cell panel',
      label: getEventLabel([vessel.dataset.id, vessel.id]),
    })
  }
  const vesselsLoaded = Math.min(MAX_VESSELS_LOAD, feature.vesselsInfo?.numVessels)

  return (
    <Fragment>
      {vessels?.length > 0 && (
        <table className={cx(styles.vesselsTable, { [styles.fullWidth]: showFullList })}>
          <thead>
            <tr>
              <th colSpan={hasPinColumn ? 2 : 1}>{t('common.vessel_other', 'Vessels')}</th>
              <th>{t('vessel.flag_short', 'iso3')}</th>
              <th>{t('vessel.gearType_short', 'gear')}</th>
              {/* Disabled for detections to allocate some space for timestamps interaction */}
              {vesselProperty !== 'detections' && <th>{t('vessel.source_short', 'source')}</th>}
              <th className={vesselProperty !== 'detections' ? styles.vesselsTableHeaderRight : ''}>
                {feature.temporalgrid?.unit === 'hours' && t('common.hour_other', 'hours')}
                {feature.temporalgrid?.unit === 'days' && t('common.days_other', 'days')}
                {feature.temporalgrid?.unit === 'detections' &&
                  t('common.detection_other', 'detections')}
              </th>
            </tr>
          </thead>
          <tbody>
            {vessels.map((vessel, i) => {
              const vesselName = formatInfoField(vessel.shipname, 'name')

              const vesselGearType = `${t(
                `vessel.gearTypes.${vessel.geartype}` as any,
                vessel.geartype ?? EMPTY_FIELD_PLACEHOLDER
              )}`

              const hasDatasets =
                vessel.infoDataset !== undefined || vessel.trackDataset !== undefined

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
                          color: vesselInWorkspace ? vesselInWorkspace.config.color : '',
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
                  <td className={styles.columnSpace}>{vesselGearType}</td>
                  {vesselProperty !== 'detections' && (
                    <td className={styles.columnSpace}>
                      <Tooltip content={getDatasetLabel(vessel.infoDataset)}>
                        <DatasetLabel dataset={vessel.infoDataset} />
                      </Tooltip>
                    </td>
                  )}
                  <td
                    className={cx(styles.columnSpace, {
                      [styles.vesselsTableHour]: vesselProperty !== 'detections',
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
      {feature.vesselsInfo && !showFullList && (
        <Fragment>
          {feature.vesselsInfo.overflow && (
            <button
              className={styles.vesselsMore}
              disabled={!gfwUser}
              onClick={() => setModalOpen(true)}
            >
              + {feature.vesselsInfo.overflowNumber} {t('common.more', 'more')}
            </button>
          )}
        </Fragment>
      )}
      {gfwUser && !showFullList && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title={
            <Fragment>
              {title}
              <GFWOnly />
            </Fragment>
          }
          isOpen={modalOpen}
          onClose={onModalClose}
        >
          {feature.vesselsInfo && (
            <div className={styles.modalContainer}>
              <VesselsTable feature={feature} showFullList={true} vesselProperty={vesselProperty} />
              {vesselsLoaded !== feature.vesselsInfo.numVessels && (
                <button className={styles.vesselsDisplayed}>
                  {vesselsLoaded} displayed out of {feature.vesselsInfo.numVessels}
                </button>
              )}
            </div>
          )}
        </Modal>
      )}
    </Fragment>
  )
}

export default VesselsTable
