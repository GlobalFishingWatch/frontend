import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import { useSelector } from 'react-redux'
import { Button } from '@globalfishingwatch/ui-components'
import { selectLocationAreaId, selectLocationDatasetId } from 'routes/routes.selectors'
import { selectReportActivityFlatten } from 'features/reports/reports.selectors'
import { setDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/app.selectors'
import styles from './ReportDownload.module.css'

type ReportDownloadProps = {
  reportName: string
}

export default function ReportDownload(props: ReportDownloadProps) {
  const { reportName } = props
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { start, end } = useSelector(selectTimeRange)
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)?.toString()
  const reportActivityData = useSelector(selectReportActivityFlatten)

  const handleMoreOptionsClick = () => {
    dispatch(setDownloadActivityAreaKey({ datasetId, areaId }))
  }

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
        <Button type="secondary" onClick={handleMoreOptionsClick}>
          {t('download.moreOptions', 'More options')}
        </Button>
        {reportActivityData && (
          <CSVLink filename={`${reportName} - ${start},${end}.csv`} data={reportActivityData}>
            <Button>{t('download.title', 'Download')}</Button>
          </CSVLink>
        )}
      </div>
    </div>
  )
}
