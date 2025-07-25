import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import {
  selectReportAreaIds,
  selectReportAreaName,
} from 'features/reports/report-area/area-reports.selectors'

import styles from './ReportDownload.module.css'

export default function ReportDownload() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { datasetId, areaId } = useSelector(selectReportAreaIds)
  const areaName = useSelector(selectReportAreaName)

  const handleMoreOptionsClick = () => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: 'Download report',
      label: areaId?.toString(),
    })
    dispatch(setDownloadActivityAreaKey({ datasetId, areaId, areaName }))
  }

  return (
    <div className={styles.container}>
      <label>{t('download.dataDownload')}</label>
      <p className={styles.description}>{t('download.descriptionReport')}</p>
      <div className={styles.actionsRow}>
        <Button type="secondary" onClick={handleMoreOptionsClick}>
          {t('download.downloadOptions')}
        </Button>
      </div>
    </div>
  )
}
