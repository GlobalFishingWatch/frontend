import { useTranslation } from 'react-i18next'
import { ReportType } from './Report'

type ReportTitleProps = {
  type: ReportType
  title: string
  description?: string
  infoLink?: string
}

export default function ReportTitle({ title, type }: ReportTitleProps) {
  const { t } = useTranslation()
  return (
    <div>
      <h1>{t(`analysis.reportTitle.${type}`, type)}</h1>
      <h2>{title}</h2>
    </div>
  )
}
