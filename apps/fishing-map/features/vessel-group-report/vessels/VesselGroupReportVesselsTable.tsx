import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Fragment } from 'react'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { useLocationConnect } from 'routes/routes.hook'
import { getDatasetsReportNotSupported } from 'features/datasets/datasets.utils'
import ReportVesselsTableFooter from 'features/area-report/vessels/ReportVesselsTableFooter'
import { selectActiveReportDataviews } from 'features/app/selectors/app.reports.selector'
import { selectUserData } from 'features/user/selectors/user.selectors'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { EMPTY_API_VALUES } from 'features/area-report/reports.config'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { GLOBAL_VESSELS_DATASET_ID } from 'data/workspaces'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import styles from './VesselGroupReportVesselsTable.module.css'
import { selectVesselGroupReportVesselsPaginated } from './vessel-group-report-vessels.selectors'

export default function VesselGroupReportVesselsTable() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vessels = useSelector(selectVesselGroupReportVesselsPaginated)
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveReportDataviews)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )

  const onFilterClick = (reportVesselFilter: any) => {
    dispatchQueryParams({ reportVesselFilter, reportVesselPage: 0 })
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
          </div>
          <div className={styles.header}>{t('vessel.mmsi', 'mmsi')}</div>
          <div className={styles.header}>{t('layer.flagState_one', 'Flag state')}</div>
          <div className={styles.header}>{t('vessel.vessel_type', 'Vessel Type')}</div>
          {vessels?.map((vessel, i) => {
            const isLastRow = i === vessels.length - 1
            const vesselFlag = getVesselProperty(vessel, 'flag')
            const flag = t(`flags:${vesselFlag}` as any, EMPTY_FIELD_PLACEHOLDER)
            const flagInteractionEnabled = !EMPTY_API_VALUES.includes(vesselFlag)
            const vesselType = getVesselProperty(vessel, 'shiptypes')?.[0]
            const type = t(`vessel.vesselTypes.${vesselType?.toLowerCase()}` as any, vesselType)
            const typeInteractionEnabled = type !== EMPTY_FIELD_PLACEHOLDER
            const hasDatasets = vessel.dataset?.includes(GLOBAL_VESSELS_DATASET_ID)
            //   ? vessel.infoDataset !== undefined && vessel.trackDataset !== undefined
            //   : vessel.infoDataset !== undefined || vessel.trackDataset !== undefined
            const pinTrackDisabled = !hasDatasets || workspaceStatus !== AsyncReducerStatus.Finished
            const vesselId = getVesselProperty(vessel, 'id')
            return (
              <Fragment key={vesselId}>
                <div className={cx({ [styles.border]: !isLastRow }, styles.icon)}>
                  <VesselPin
                    vesselToResolve={{
                      id: vesselId,
                      datasetId: vessel.dataset,
                    }}
                    disabled={pinTrackDisabled}
                  />
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  {workspaceStatus === AsyncReducerStatus.Finished ? (
                    <VesselLink
                      className={styles.link}
                      vesselId={vesselId}
                      datasetId={vessel.dataset}
                    >
                      {formatInfoField(getVesselProperty(vessel, 'shipname'), 'name')}
                    </VesselLink>
                  ) : (
                    formatInfoField(getVesselProperty(vessel, 'shipname'), 'name')
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
      <ReportVesselsTableFooter reportName={'TODO'} />
    </Fragment>
  )
}
