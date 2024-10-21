import { Fragment } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { Tooltip } from '@globalfishingwatch/ui-components'
import {
  DatasetSubCategory,
  DataviewCategory,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import {
  EMPTY_FIELD_PLACEHOLDER,
  formatInfoField,
  getDetectionsTimestamps,
  getVesselGearTypeLabel,
  getVesselOtherNamesLabel,
  getVesselShipTypeLabel,
} from 'utils/info'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nNumber from 'features/i18n/i18nNumber'
import {
  ActivityProperty,
  ExtendedFeatureVessel,
  MAX_TOOLTIP_LIST,
  SliceExtendedFourwingsDeckSublayer,
} from 'features/map/map.slice'
import { t } from 'features/i18n/i18n'
import I18nDate from 'features/i18n/i18nDate'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { TimeRangeDates } from 'features/map/controls/MapInfo'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { getUTCDateTime } from 'utils/dates'
import { GLOBAL_VESSELS_DATASET_ID } from 'data/workspaces'
import { getOtherVesselNames, getVesselProperty } from 'features/vessel/vessel.utils'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { getVesselIdentityTooltipSummary } from 'features/workspace/vessels/VesselLayerPanel'
import { SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION } from 'features/map/map-interactions.hooks'
import styles from './VesselsTable.module.css'

export const getVesselsInfoConfig = (vessels: ExtendedFeatureVessel[]) => {
  if (!vessels?.length) return {}
  return {
    numVessels: vessels.length,
    overflow: vessels.length > MAX_TOOLTIP_LIST,
    overflowNumber: Math.max(vessels.length - MAX_TOOLTIP_LIST, 0),
    overflowLoad: vessels.length > MAX_TOOLTIP_LIST,
    overflowLoadNumber: Math.max(vessels.length - MAX_TOOLTIP_LIST, 0),
  }
}

export const VesselDetectionTimestamps = ({ vessel }: { vessel: ExtendedFeatureVessel }) => {
  const { setTimerange } = useTimerangeConnect()
  const detectionsTimestamps = getDetectionsTimestamps(vessel)
  const hasDetectionsTimestamps = detectionsTimestamps && detectionsTimestamps.length > 0
  const hasMultipleDetectionsTimestamps = hasDetectionsTimestamps && detectionsTimestamps.length > 1

  const start = hasDetectionsTimestamps
    ? (getUTCDateTime(detectionsTimestamps[0]).startOf('day').toISO() as string)
    : ''

  const end = hasDetectionsTimestamps
    ? (getUTCDateTime(detectionsTimestamps[detectionsTimestamps.length - 1])
        .endOf('day')
        .toISO() as string)
    : ''

  if (!hasDetectionsTimestamps) return null

  return hasMultipleDetectionsTimestamps ? (
    <Tooltip content={t('timebar.fitOnThisDates', 'Fit time range to these dates') as string}>
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
            end: getUTCDateTime(start).endOf('day').toISO() as string,
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
  testId = 'vessels-table',
  showValue = true,
}: {
  feature: SliceExtendedFourwingsDeckSublayer & { category: DataviewCategory }
  vesselProperty?: ActivityProperty
  activityType?: `${DatasetSubCategory}`
  testId?: string
  showValue?: boolean
}) {
  const { t } = useTranslation()

  const interactionAllowed = [...SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION].includes(
    feature?.category || ''
  )

  // TODO: consider showing more than 5 vessels when oly one layer is active
  const featureVessels = showValue
    ? feature?.vessels
    : feature?.vessels?.toSorted((a, b) => {
        const getVesselPropertyParams = {
          identitySource: VesselIdentitySourceEnum.SelfReported,
        }
        const aName = formatInfoField(
          getVesselProperty(a, 'shipname', getVesselPropertyParams),
          'shipname'
        )
        const bName = formatInfoField(
          getVesselProperty(b, 'shipname', getVesselPropertyParams),
          'shipname'
        )
        if (aName < bName) return -1
        if (aName > bName) return 1
        return 0
      })

  const vessels = featureVessels?.slice(0, MAX_TOOLTIP_LIST)
  const vesselsInfo = getVesselsInfoConfig(feature.vessels || [])

  const hasPinColumn =
    interactionAllowed &&
    feature?.vessels?.some((vessel) => {
      const hasDatasets = vessel.infoDataset !== undefined || vessel.trackDataset !== undefined
      return hasDatasets
    })

  const isHoursProperty = vesselProperty !== 'detections' && vesselProperty !== 'events'
  const isPresenceActivity = activityType === DatasetSubCategory.Presence
  return (
    <Fragment>
      {vessels!?.length > 0 && (
        <table className={cx(styles.vesselsTable)} data-test={testId}>
          <thead>
            <tr>
              <th colSpan={hasPinColumn ? 2 : 1}>{t('common.vessel_other', 'Vessels')}</th>
              <th>{t('vessel.flag', 'flag')}</th>
              <th>
                {isPresenceActivity ? t('vessel.type', 'Type') : t('vessel.gearType_short', 'Gear')}
              </th>
              {/* Disabled for detections to allocate some space for timestamps interaction */}
              {isHoursProperty && <th>{t('vessel.source_short', 'source')}</th>}
              {showValue && (
                <th className={isHoursProperty ? styles.vesselsTableHeaderRight : ''}>
                  {feature?.unit === 'hours' && t('common.hour_other', 'hours')}
                  {feature?.unit === 'days' && t('common.days_other', 'days')}
                  {feature?.unit === 'detections' && t('common.detection_other', 'detections')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {vessels?.map((vessel, i) => {
              const getVesselPropertyParams = {
                identitySource: VesselIdentitySourceEnum.SelfReported,
              }
              const vesselName = formatInfoField(
                getVesselProperty(vessel, 'shipname', getVesselPropertyParams),
                'shipname'
              )

              const otherVesselsLabel = vessel
                ? getVesselOtherNamesLabel(getOtherVesselNames(vessel))
                : ''
              const vesselFlag = getVesselProperty(vessel, 'flag', getVesselPropertyParams)

              const vesselType = isPresenceActivity
                ? getVesselShipTypeLabel({
                    shiptypes: getVesselProperty(vessel, 'shiptypes', getVesselPropertyParams),
                  })
                : getVesselGearTypeLabel({
                    geartypes: getVesselProperty(vessel, 'geartypes', getVesselPropertyParams),
                  })

              // Temporary workaround for public-global-all-vessels dataset as we
              // don't want to show the pin only for that dataset for guest users
              const hasDatasets = vessel.infoDataset?.id?.includes(GLOBAL_VESSELS_DATASET_ID)
                ? vessel.infoDataset !== undefined && vessel.trackDataset !== undefined
                : vessel.infoDataset !== undefined || vessel.trackDataset !== undefined

              const pinTrackDisabled = !interactionAllowed || !hasDatasets
              const detectionsTimestamps = getDetectionsTimestamps(vessel)

              const identitiesSummary = vessel ? getVesselIdentityTooltipSummary(vessel) : ''
              return (
                <tr key={vessel.id} data-test={`${testId}-item-${i}`}>
                  {!pinTrackDisabled && (
                    <td className={styles.icon}>
                      <VesselPin vessel={vessel} />
                    </td>
                  )}
                  <td colSpan={hasPinColumn && pinTrackDisabled ? 2 : 1} data-test="vessel-name">
                    {vesselName !== EMPTY_FIELD_PLACEHOLDER ? (
                      <Fragment>
                        <VesselLink
                          className={styles.link}
                          vesselId={vessel.id}
                          datasetId={vessel.infoDataset?.id}
                          tooltip={identitiesSummary}
                          query={{
                            vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
                            vesselSelfReportedId: vessel.id,
                          }}
                        >
                          {vesselName}
                        </VesselLink>
                        {otherVesselsLabel && (
                          <span className={styles.secondary}>{otherVesselsLabel}</span>
                        )}
                      </Fragment>
                    ) : (
                      vesselName
                    )}
                  </td>
                  <td className={styles.columnSpace}>
                    <Tooltip content={t(`flags:${vesselFlag}` as any)}>
                      <span>{vesselFlag || EMPTY_FIELD_PLACEHOLDER}</span>
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
                  {showValue && (
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
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {vesselsInfo && vesselsInfo.overflow && (
        <p className={styles.vesselsMore}>
          + {vesselsInfo.overflowNumber} {t('common.more', 'more')}
        </p>
      )}
    </Fragment>
  )
}

export default VesselsTable
