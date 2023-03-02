import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { IconButton } from '@globalfishingwatch/ui-components'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { Area } from 'features/areas/areas.slice'
import { selectReportAreaIds } from 'features/reports/reports.selectors'
import { selectDataviewInstancesByType } from 'features/dataviews/dataviews.slice'
import { getContextAreaLink } from 'features/dataviews/dataviews.utils'
import styles from './ReportTitle.module.css'

type ReportTitleProps = {
  area: Area
  description?: string
  infoLink?: string
}

export default function ReportTitle({ area }: ReportTitleProps) {
  const { t } = useTranslation()
  const { datasetId } = useSelector(selectReportAreaIds)
  const contextDataviews = useSelector(selectDataviewInstancesByType(GeneratorType.Context))
  const areaDataview = contextDataviews.find((dataview) => {
    return dataview.datasets.some((dataset) => dataset.id === datasetId)
  })
  const linkHref = getContextAreaLink(areaDataview?.config.layers[0]?.id, area?.id)

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>{area?.name}</h1>
      </div>
      <div>
        {linkHref && (
          <a target="_blank" rel="noopener noreferrer" href={linkHref}>
            <IconButton icon="external-link" tooltip={t('common.learnMore', 'Learn more')} />
          </a>
        )}
        <IconButton
          icon="category-news"
          tooltip={t('analysis.print', 'Print / Save as PDF')}
          onClick={window.print}
        />
      </div>
    </div>
  )
}
