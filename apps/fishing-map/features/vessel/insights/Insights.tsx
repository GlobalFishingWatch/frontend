import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Spinner } from '@globalfishingwatch/ui-components'
import { selectVesselEventsResourcesLoading } from 'features/vessel/vessel.selectors'
import styles from './Insights.module.css'
import InsightWrapper from './InsightWrapper'

const INSIGHTS = ['COVERAGE']

const Insights = () => {
  const { t } = useTranslation()
  const eventsLoading = useSelector(selectVesselEventsResourcesLoading)

  if (eventsLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className="print-only">{t('vessel.sectionInsights', 'Insights')}</h2>
      {INSIGHTS.map((insight) => (
        <InsightWrapper insight={insight} key={insight} />
      ))}
    </div>
  )
}

export default Insights
