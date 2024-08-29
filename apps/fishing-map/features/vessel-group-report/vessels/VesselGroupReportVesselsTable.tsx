import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Fragment } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { VesselType } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, getVesselShipNameLabel, getVesselShipTypeLabel } from 'utils/info'
import { useLocationConnect } from 'routes/routes.hook'
import { getDatasetsReportNotSupported } from 'features/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/app/selectors/app.reports.selector'
import { selectUserData } from 'features/user/selectors/user.selectors'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { EMPTY_API_VALUES } from 'features/area-report/reports.config'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  VesselGroupReportVesselsOrderDirection,
  VesselGroupReportVesselsOrderProperty,
} from 'types'
import {
  selectVesselGroupReportVesselsOrderDirection,
  selectVesselGroupReportVesselsOrderProperty,
} from 'features/vessel-group-report/vessel-group.config.selectors'
import styles from './VesselGroupReportVesselsTable.module.css'
import { selectVesselGroupReportVesselsPaginated } from './vessel-group-report-vessels.selectors'
import VesselGroupReportVesselsTableFooter from './VesselGroupReportVesselsTableFooter'

export default function VesselGroupReportVesselsTable() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vessels = useSelector(selectVesselGroupReportVesselsPaginated)
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveReportDataviews)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const orderProperty = useSelector(selectVesselGroupReportVesselsOrderProperty)
  const orderDirection = useSelector(selectVesselGroupReportVesselsOrderDirection)
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )

  const onFilterClick = (reportVesselFilter: any) => {
    dispatchQueryParams({ reportVesselFilter, vesselGroupReportVesselPage: 0 })
  }

  const onPinClick = () => {
    dispatchQueryParams({ viewOnlyVesselGroup: false })
  }

  const handleSortClick = (
    property: VesselGroupReportVesselsOrderProperty,
    direction: VesselGroupReportVesselsOrderDirection
  ) => {
    dispatchQueryParams({
      vesselGroupReportVesselsOrderProperty: property,
      vesselGroupReportVesselsOrderDirection: direction,
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
              <Fragment>
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
            {t('vessel.vessel_type', 'Vessel Type')}
            <IconButton
              size="tiny"
              icon={orderDirection === 'asc' ? 'sort-asc' : 'sort-desc'}
              onClick={() => handleSortClick('shiptype', orderDirection === 'asc' ? 'desc' : 'asc')}
              className={cx(styles.sortIcon, { [styles.active]: orderProperty === 'shiptype' })}
            />
          </div>
          {vessels?.map((vessel, i) => {
            const isLastRow = i === vessels.length - 1
            const vesselFlag = getVesselProperty(vessel, 'flag')
            const flag = t(`flags:${vesselFlag}` as any, EMPTY_FIELD_PLACEHOLDER)
            const flagInteractionEnabled = !EMPTY_API_VALUES.includes(vesselFlag)
            const type = getVesselShipTypeLabel({
              shiptypes: getVesselProperty(vessel, 'shiptypes'),
            })
            const typeInteractionEnabled = type !== (EMPTY_FIELD_PLACEHOLDER as VesselType)
            //   ? vessel.infoDataset !== undefined && vessel.trackDataset !== undefined
            //   : vessel.infoDataset !== undefined || vessel.trackDataset !== undefined
            const pinTrackDisabled = workspaceStatus !== AsyncReducerStatus.Finished
            const vesselId = getVesselProperty(vessel, 'id')
            return (
              <Fragment key={vesselId}>
                <div className={cx({ [styles.border]: !isLastRow }, styles.icon)}>
                  <VesselPin vessel={vessel} disabled={pinTrackDisabled} onClick={onPinClick} />
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  {workspaceStatus === AsyncReducerStatus.Finished ? (
                    <VesselLink
                      className={styles.link}
                      vesselId={vesselId}
                      datasetId={vessel.dataset}
                    >
                      {getVesselShipNameLabel(vessel)}
                    </VesselLink>
                  ) : (
                    getVesselShipNameLabel(vessel)
                  )}
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  <span>{getVesselProperty(vessel, 'ssvid') || EMPTY_FIELD_PLACEHOLDER}</span>
                </div>
                <div
                  className={cx({
                    [styles.border]: !isLastRow,
                    [styles.pointer]: flagInteractionEnabled,
                  })}
                  title={
                    flagInteractionEnabled
                      ? `${t('analysis.clickToFilterBy', `Click to filter by:`)} ${flag}`
                      : undefined
                  }
                  onClick={flagInteractionEnabled ? () => onFilterClick(`flag:${flag}`) : undefined}
                >
                  <span>{flag}</span>
                </div>
                <div
                  className={cx({
                    [styles.border]: !isLastRow,
                    [styles.pointer]: typeInteractionEnabled,
                  })}
                  title={
                    typeInteractionEnabled
                      ? `${t('analysis.clickToFilterBy', `Click to filter by:`)} ${type}`
                      : undefined
                  }
                  onClick={
                    typeInteractionEnabled ? () => onFilterClick(`${'type'}:${type}`) : undefined
                  }
                >
                  {type}
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
      {/* TODO */}
      <VesselGroupReportVesselsTableFooter reportName={'TODO'} />
    </Fragment>
  )
}
