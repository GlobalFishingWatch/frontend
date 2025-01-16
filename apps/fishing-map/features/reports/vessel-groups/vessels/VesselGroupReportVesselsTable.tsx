import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { getDatasetsReportNotSupported } from 'features/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { EMPTY_API_VALUES } from 'features/reports/areas/area-reports.config'
import styles from 'features/reports/shared/events/EventsReportVesselsTable.module.css'
import {
  selectVGRVesselsOrderDirection,
  selectVGRVesselsOrderProperty,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import VesselLink from 'features/vessel/VesselLink'
import type { VesselPinClickProps } from 'features/vessel/VesselPin'
import VesselPin from 'features/vessel/VesselPin'
import type {
  VGRVesselsOrderDirection,
  VGRVesselsOrderProperty,
} from 'features/vessel-groups/vessel-groups.types'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import { selectVGRVesselsPaginated } from './vessel-group-report-vessels.selectors'
import VesselGroupReportVesselsTableFooter from './VesselGroupReportVesselsTableFooter'

export default function VesselGroupReportVesselsTable() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vessels = useSelector(selectVGRVesselsPaginated)
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveReportDataviews)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const orderProperty = useSelector(selectVGRVesselsOrderProperty)
  const orderDirection = useSelector(selectVGRVesselsOrderDirection)
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )

  const onFilterClick = (vGRVesselFilter: any) => {
    dispatchQueryParams({ vGRVesselFilter, vGRVesselPage: 0 })
  }

  const handleSortClick = (
    property: VGRVesselsOrderProperty,
    direction: VGRVesselsOrderDirection
  ) => {
    dispatchQueryParams({
      vGRVesselsOrderProperty: property,
      vGRVesselsOrderDirection: direction,
    })
  }

  const onPinClick = ({ vesselInWorkspace, vesselId }: VesselPinClickProps) => {
    if (!vesselInWorkspace) {
      dispatchQueryParams({ viewOnlyVesselGroup: false })
    }
    trackEvent({
      category: TrackCategory.VesselGroupReport,
      action: `vessel_group_profile_pin_vessel`,
      label: vesselId,
    })
  }

  return (
    <Fragment>
      <div className={styles.tableContainer} data-test="report-vessels-table">
        {datasetsDownloadNotSupported.length > 0 && (
          <p className={styles.error}>
            {t(
              'analysis.datasetsNotAllowed',
              'Vessels are not included from the following sources:'
            )}{' '}
            {datasetsDownloadNotSupported.map((dataset, index) => (
              <Fragment key={dataset}>
                <DatasetLabel key={dataset} dataset={{ id: dataset }} />
                {index < datasetsDownloadNotSupported.length - 1 && ', '}
              </Fragment>
            ))}
          </p>
        )}
        <div className={styles.vesselsTable}>
          <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
            {t('common.name', 'Name')}
            <IconButton
              size="tiny"
              icon={orderDirection === 'asc' ? 'sort-asc' : 'sort-desc'}
              onClick={() => handleSortClick('shipname', orderDirection === 'asc' ? 'desc' : 'asc')}
              className={cx(styles.sortIcon, { [styles.active]: orderProperty === 'shipname' })}
            />
          </div>
          <div className={styles.header}>{t('vessel.mmsi', 'mmsi')}</div>
          <div className={styles.header}>
            {t('layer.flagState_one', 'Flag state')}
            <IconButton
              size="tiny"
              icon={orderDirection === 'asc' ? 'sort-asc' : 'sort-desc'}
              onClick={() => handleSortClick('flag', orderDirection === 'asc' ? 'desc' : 'asc')}
              className={cx(styles.sortIcon, { [styles.active]: orderProperty === 'flag' })}
            />
          </div>
          <div className={styles.header}>
            {t('vessel.gearType', 'Gear Type')}
            <IconButton
              size="tiny"
              icon={orderDirection === 'asc' ? 'sort-asc' : 'sort-desc'}
              onClick={() => handleSortClick('shiptype', orderDirection === 'asc' ? 'desc' : 'asc')}
              className={cx(styles.sortIcon, { [styles.active]: orderProperty === 'shiptype' })}
            />
          </div>
          {vessels?.map((vessel, i) => {
            const { shipName, flagTranslated, flagTranslatedClean, identity, geartype } = vessel
            const { id, flag, ssvid } = getSearchIdentityResolved(identity!)
            const isLastRow = i === vessels.length - 1
            const flagInteractionEnabled = !EMPTY_API_VALUES.includes(flagTranslated)
            const gearTypeInteractionEnabled = geartype !== EMPTY_FIELD_PLACEHOLDER
            const workspaceReady = workspaceStatus === AsyncReducerStatus.Finished
            return (
              <Fragment key={id}>
                <div className={cx({ [styles.border]: !isLastRow }, styles.icon)}>
                  <VesselPin
                    vessel={vessel.identity}
                    disabled={!workspaceReady}
                    onClick={onPinClick}
                  />
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  {workspaceReady ? (
                    <VesselLink
                      className={styles.link}
                      vesselId={id}
                      datasetId={vessel.dataset}
                      query={{ vesselIdentitySource: VesselIdentitySourceEnum.SelfReported }}
                    >
                      {shipName}
                    </VesselLink>
                  ) : (
                    shipName
                  )}
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  <span>{ssvid || EMPTY_FIELD_PLACEHOLDER}</span>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  className={cx({
                    [styles.border]: !isLastRow,
                    [styles.pointer]: flagInteractionEnabled,
                  })}
                  title={
                    flagInteractionEnabled
                      ? `${t('analysis.clickToFilterBy', `Click to filter by:`)} ${flag}`
                      : undefined
                  }
                  onClick={
                    flagInteractionEnabled
                      ? () => onFilterClick(`flag:${flagTranslatedClean}`)
                      : undefined
                  }
                >
                  <span>{flagTranslated}</span>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  className={cx({
                    [styles.border]: !isLastRow,
                    [styles.pointer]: gearTypeInteractionEnabled,
                  })}
                  title={
                    gearTypeInteractionEnabled
                      ? `${t('analysis.clickToFilterBy', `Click to filter by:`)} ${geartype}`
                      : undefined
                  }
                  onClick={
                    gearTypeInteractionEnabled
                      ? () => onFilterClick(`${'gear'}:${geartype}`)
                      : undefined
                  }
                >
                  {geartype}
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
      <VesselGroupReportVesselsTableFooter />
    </Fragment>
  )
}
