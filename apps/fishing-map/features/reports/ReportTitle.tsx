import { useTranslation } from 'react-i18next'
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
      <label className={styles.type}>{t(`analysis.reportTitle.${type}`, type)}</label>
      <h1 className={styles.title}>{title}</h1>
    </div>
  )
}
