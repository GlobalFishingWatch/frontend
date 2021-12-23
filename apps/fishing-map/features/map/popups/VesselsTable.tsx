import React, { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { IconButton, Modal, Tooltip } from '@globalfishingwatch/ui-components'
import { DatasetTypes, DataviewInstance } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  getPresenceVesselDataviewInstance,
  getVesselDataviewInstance,
  getVesselInWorkspace,
} from 'features/dataviews/dataviews.utils'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
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
import { formatI18nDate } from 'features/i18n/i18nDate'
import {
  SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION,
  SUBLAYER_INTERACTION_TYPES_WITH_VIIRS_INTERACTION,
  TooltipEventFeature,
} from '../map.hooks'
import { useMapContext } from '../map-context.hooks'
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
  const { eventManager } = useMapContext()

  const [modalOpen, setModalOpen] = useState(false)

  const onModalClose = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const interactionAllowed = [
    ...SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION,
    ...SUBLAYER_INTERACTION_TYPES_WITH_VIIRS_INTERACTION,
  ].includes(feature.temporalgrid?.sublayerInteractionType || '')

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
    eventManager.once('click', (e: any) => e.stopPropagation(), ev.target)

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
      const vesselEventsDatasets = getRelatedDatasetsByType(vessel.dataset, DatasetTypes.Events)
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
  return (
    <Fragment>
      <table className={cx(styles.vesselsTable, { [styles.fullWidth]: showFullList })}>
        <thead>
          <tr>
            <th colSpan={hasPinColumn ? 2 : 1}>{t('common.vessel_other', 'Vessels')}</th>
            <th>{t('vessel.flag_short', 'iso3')}</th>
            <th>{t('vessel.gearType_short', 'gear')}</th>
            <th>{t('vessel.source_short', 'source')}</th>
            <th className={styles.vesselsTableHeaderRight}>
              {feature.temporalgrid?.unit === 'hours' && t('common.hour_other', 'hours')}
              {feature.temporalgrid?.unit === 'days' && t('common.days_other', 'days')}
              {feature.temporalgrid?.unit === 'detections' &&
                t('common.detection_other', 'detections')}
            </th>
          </tr>
        </thead>
        <tbody>
          {vessels?.length > 0 &&
            vessels.map((vessel, i) => {
              const vesselName =
                vessel.shipname !== undefined
                  ? formatInfoField(vessel.shipname, 'name')
                  : t('vessel.notMatched', 'No data matched')

              const vesselGearType = `${t(
                `vessel.gearTypes.${vessel.geartype}` as any,
                EMPTY_FIELD_PLACEHOLDER
              )}`

              const hasDatasets =
                vessel.infoDataset !== undefined || vessel.trackDataset !== undefined

              const vesselInWorkspace = getVesselInWorkspace(vessels, vessel.id)

              const pinTrackDisabled = !interactionAllowed || !hasDatasets
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
                  <td className={styles.columnSpace}>{vessel.dataset && vessel.dataset.name}</td>
                  <td className={cx(styles.vesselsTableHour, styles.columnSpace)}>
                    <I18nNumber number={vessel[vesselProperty]} />
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
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
      {gfwUser && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title={title}
          isOpen={modalOpen}
          onClose={onModalClose}
        >
          {feature.vesselsInfo && (
            <div className={styles.modalContainer}>
              <VesselsTable feature={feature} showFullList={true} vesselProperty={vesselProperty} />
              <div className={styles.vesselsMore}>
                {Math.min(MAX_VESSELS_LOAD, feature.vesselsInfo.numVessels)} displayed out of{' '}
                {feature.vesselsInfo.numVessels}
              </div>
            </div>
          )}
        </Modal>
      )}
    </Fragment>
  )
}

export default VesselsTable
