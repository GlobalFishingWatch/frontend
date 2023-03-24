import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { Area } from 'features/areas/areas.slice'
import { selectReportAreaDataview } from 'features/reports/reports.selectors'
import { getContextAreaLink } from 'features/dataviews/dataviews.utils'
import ReportTitlePlaceholder from 'features/reports/placeholders/ReportTitlePlaceholder'
import styles from './ReportTitle.module.css'

type ReportTitleProps = {
  area: Area
  description?: string
  infoLink?: string
}

export default function ReportTitle({ area }: ReportTitleProps) {
  const { t } = useTranslation()
  const areaDataview = useSelector(selectReportAreaDataview)
  const name =
    areaDataview?.config.type === GeneratorType.UserContext
      ? areaDataview?.datasets?.[0]?.name
      : area?.name
  const linkHref = getContextAreaLink(areaDataview?.config?.layers?.[0]?.id, area)
  return (
    <div className={styles.container}>
      {name ? (
        <Fragment>
          <h1 className={styles.title}>{name}</h1>
          <div className={styles.actions}>
            {linkHref && (
              <a target="_blank" rel="noopener noreferrer" href={linkHref}>
                <IconButton icon="info" tooltip={t('common.learnMore', 'Learn more')} />
              </a>
            )}
            <IconButton
              icon="print"
              tooltip={t('analysis.print', 'Print / Save as PDF')}
              onClick={window.print}
            />
          </div>
        </Fragment>
      ) : (
        <ReportTitlePlaceholder />
      )}
    </div>
  )
}
