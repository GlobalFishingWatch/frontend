import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button } from '@globalfishingwatch/ui-components'
import { selectLocationAreaId, selectLocationDatasetId } from 'routes/routes.selectors'
import { setDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import styles from './ReportDownload.module.css'

export default function ReportDownload() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)?.toString()

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
          {t('download.downloadOptions', 'Dowload options')}
        </Button>
      </div>
    </div>
  )
}
