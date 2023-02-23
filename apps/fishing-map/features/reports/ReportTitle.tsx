import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { ReportType } from './Report'
import styles from './ReportTitle.module.css'

type ReportTitleProps = {
  type: ReportType
  title: string
  description?: string
  infoLink?: string
}

export default function ReportTitle({ title, type }: ReportTitleProps) {
  const { t } = useTranslation()
  return (
    <div className={styles.container}>
      <div>
        <label className={styles.type}>{t(`analysis.reportTitle.${type}`, type)}</label>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <IconButton
        icon="category-news"
        tooltip={t('analysis.print', 'Print / Save as PDF')}
        onClick={window.print}
      />
    </div>
  )
}
