import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Link from 'redux-first-router-link'

import type { DataviewCategory } from '@globalfishingwatch/api-types'
import { DatasetSubCategory, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'

import {
  DEFAULT_WORKSPACE_CATEGORY,
  DEFAULT_WORKSPACE_ID,
  GLOBAL_VESSELS_DATASET_ID,
} from 'data/workspaces'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nNumber from 'features/i18n/i18nNumber'
import type {
  ActivityProperty,
  ExtendedFeatureVessel,
  SliceExtendedFourwingsDeckSublayer,
} from 'features/map/map.slice'
import { MAX_TOOLTIP_LIST } from 'features/map/map.slice'
import { SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION } from 'features/map/map-interactions.hooks'
import VesselDetectionTimestamps from 'features/map/popups/categories/VesselDetectionTimestamps'
import { getOtherVesselNames, getVesselProperty } from 'features/vessel/vessel.utils'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { getVesselIdentityTooltipSummary } from 'features/workspace/vessels/VesselLayerPanel'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { WORKSPACE_SEARCH } from 'routes/routes'
import {
  EMPTY_FIELD_PLACEHOLDER,
  formatInfoField,
  getDetectionsTimestamps,
  getVesselGearTypeLabel,
  getVesselOtherNamesLabel,
  getVesselShipTypeLabel,
} from 'utils/info'

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

function VesselsTable({
  feature,
  vesselProperty = 'hours',
  activityType = DatasetSubCategory.Fishing,
  testId = 'vessels-table',
  showValue = true,
  linkToSkylight = false,
}: {
  feature: SliceExtendedFourwingsDeckSublayer & { category: DataviewCategory }
  vesselProperty?: ActivityProperty
  activityType?: `${DatasetSubCategory}`
  testId?: string
  showValue?: boolean
  linkToSkylight?: boolean
}) {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const workspace = useSelector(selectWorkspace)

  const interactionAllowed = [...SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION].includes(
    feature?.category || ''
  )

  // TODO: consider showing more than 5 vessels when oly one layer is active
  const vessels = feature?.vessels?.slice(0, MAX_TOOLTIP_LIST)
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
      {vessels && vessels.length > 0 && (
        <table className={cx(styles.vesselsTable)} data-test={testId}>
          <thead>
            <tr>
              <th colSpan={hasPinColumn ? 2 : 1}>{t('common.vessel_other')}</th>
              <th>{t('vessel.flag')}</th>
              {!linkToSkylight && (
                <th>{isPresenceActivity ? t('vessel.type') : t('vessel.gearType_short')}</th>
              )}
              {/* Disabled for detections to allocate some space for timestamps interaction */}
              {isHoursProperty && <th>{t('vessel.source_short')}</th>}
              {showValue && (
                <th className={isHoursProperty ? styles.vesselsTableHeaderRight : ''}>
                  {feature?.unit === 'hours' && t('common.hour_other')}
                  {feature?.unit === 'days' && t('common.days_other')}
                  {feature?.unit === 'detections' && t('common.detection_other')}
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
                <tr key={vessel.id + i} data-test={`${testId}-item-${i}`}>
                  {!pinTrackDisabled && (
                    <td className={styles.icon}>
                      <VesselPin vessel={vessel} />
                    </td>
                  )}
                  <td colSpan={hasPinColumn && pinTrackDisabled ? 2 : 1} data-test="vessel-name">
                    {vesselName !== EMPTY_FIELD_PLACEHOLDER ? (
                      <Fragment>
                        {linkToSkylight ? (
                          <span className={styles.skylightLink}>
                            {vesselName}
                            <Link
                              className={styles.link}
                              to={{
                                type: WORKSPACE_SEARCH,
                                payload: {
                                  category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
                                  workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
                                },
                                query: {
                                  searchOption: 'advanced',
                                  query: vesselName,
                                  ssvid: vessel.id,
                                  flag: [(vessel as any).flag],
                                },
                              }}
                            >
                              <IconButton
                                icon="search"
                                size="tiny"
                                tooltip={t('vessel.skylightSearch')}
                              />
                            </Link>
                            <a
                              href={`https://sc-production.skylight.earth/vesseldetails/${vessel.id}?startTime=${start}&endTime=${end}&timesliderStart=${start}&timesliderEnd=${end}`}
                              target="_blank"
                              className={styles.link}
                            >
                              <IconButton
                                icon="external-link"
                                size="tiny"
                                tooltip={t('vessel.skylightLink')}
                              />
                            </a>
                          </span>
                        ) : (
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
                        )}
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

                  {!linkToSkylight && <td className={styles.columnSpace}>{vesselType}</td>}
                  {isHoursProperty && (
                    <td className={styles.columnSpace}>
                      <Tooltip content={getDatasetLabel(vessel.infoDataset)}>
                        <DatasetLabel dataset={vessel.infoDataset} />
                      </Tooltip>
                    </td>
                  )}
                  {showValue && vessel[vesselProperty] && (
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
          + {vesselsInfo.overflowNumber} {t('common.more')}
        </p>
      )}
    </Fragment>
  )
}

export default VesselsTable
