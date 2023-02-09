import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import { useSelector } from 'react-redux'
import { Button } from '@globalfishingwatch/ui-components'
import { selectUrlTimeRange } from 'routes/routes.selectors'
import { selectReportActivityFlatten } from 'features/reports/reports.selectors'
import styles from './ReportDownload.module.css'

type ReportDownloadProps = {
  reportName: string
}

export default function ReportDownload(props: ReportDownloadProps) {
  const { reportName } = props
  const { t } = useTranslation()
  const { start, end } = useSelector(selectUrlTimeRange)
  const reportActivityData = useSelector(selectReportActivityFlatten)

  return (
    <div className={styles.container}>
      <label>{t('download.dataDownload', 'Data download')}</label>
      <p className={styles.description}>
        {t(
          'download.descriptionReport',
          'You can download a list of the activity or a heat map bitmap for this area in different formats'
        )}
      </p>
      <div className={styles.actionsRow}>
        <Button type="secondary">{t('download.moreOptions', 'More options')}</Button>
        <CSVLink filename={`${reportName}-${start}-${end}.csv`} data={reportActivityData}>
          <Button>{t('download.title', 'Download')}</Button>
        </CSVLink>
      </div>
    </div>
  )
}
