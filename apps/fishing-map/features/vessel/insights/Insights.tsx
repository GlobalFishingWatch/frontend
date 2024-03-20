import { useTranslation } from 'react-i18next'
import InsightWrapper from './InsightWrapper'
import { INSIGHTS } from './insights.config'
import styles from './Insights.module.css'

const Insights = () => {
  const { t } = useTranslation()

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
