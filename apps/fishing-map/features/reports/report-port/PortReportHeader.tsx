import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import {
  selectPortReportCountry,
  selectPortReportName,
} from 'features/reports/reports.config.selectors'
import { selectReportPortId } from 'routes/routes.selectors'
import { formatInfoField } from 'utils/info'

import styles from './PortsReport.module.css'

const PortReportHeader = () => {
  const { t } = useTranslation()
  const portId = useSelector(selectReportPortId)
  const reportName = useSelector(selectPortReportName)
  const reportCountry = useSelector(selectPortReportCountry)
  return (
    <div className={styles.titleContainer}>
      <label className={styles.portLabel}>{t('event.port', 'Port')}</label>
      <h1 className={styles.title}>
        {formatInfoField(reportName || portId, 'shipname')} (
        {formatInfoField(reportCountry, 'flag')})
      </h1>
    </div>
  )
}

export default PortReportHeader
