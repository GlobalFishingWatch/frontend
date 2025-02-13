import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { usePortsReportAreaFootprintFitBounds } from 'features/reports/report-area/area-reports.hooks'
import {
  selectPortReportCountry,
  selectPortReportName,
} from 'features/reports/reports.config.selectors'
import { useMigrateWorkspaceToast } from 'features/workspace/workspace-migration.hooks'
import { selectReportPortId } from 'routes/routes.selectors'
import { formatInfoField } from 'utils/info'

import EventsReport from '../tabs/events/EventsReport'

import styles from './PortsReport.module.css'

function PortsReport() {
  useMigrateWorkspaceToast()
  usePortsReportAreaFootprintFitBounds()
  const { t } = useTranslation()
  const portId = useSelector(selectReportPortId)
  const reportName = useSelector(selectPortReportName)
  const reportCountry = useSelector(selectPortReportCountry)

  return (
    <Fragment>
      <div className={styles.titleContainer}>
        <label className={styles.portLabel}>{t('event.port', 'Port')}</label>
        <h1 className={styles.title}>
          {formatInfoField(reportName || portId, 'shipname')} (
          {formatInfoField(reportCountry, 'flag')})
        </h1>
      </div>
      <EventsReport />
    </Fragment>
  )
}

export default PortsReport
