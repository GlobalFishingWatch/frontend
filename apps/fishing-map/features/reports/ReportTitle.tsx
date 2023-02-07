import { useTranslation } from 'react-i18next'
import { ReportType } from './Report'

type ReportTitleProps = {
  type: ReportType
  title: string
  description?: string
  infoLink?: string
}

export default function ReportTitle(props: ReportTitleProps) {
  const { t } = useTranslation()
  return (
    <div>
      <h1>{t(`reports.title.${props.type}`)}</h1>
      <h2>{props.title}</h2>
    </div>
  )
}
