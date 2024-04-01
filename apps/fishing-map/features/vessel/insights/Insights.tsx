import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { useMemo } from 'react'
import { Icon } from '@globalfishingwatch/ui-components'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { selectVesselSelfReportedId } from 'features/vessel/vessel.config.selectors'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import InsightWrapper from './InsightWrapper'
import { INSIGHTS_NON_FISHING, INSIGHTS_FISHING, MIN_INSIGHTS_YEAR } from './insights.config'
import styles from './Insights.module.css'

const Insights = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)

  const vessel = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselSelfReportedId)
  const shiptypes = getVesselProperty(vessel, 'shiptypes', {
    identityId,
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })
  const isFishingVessel = shiptypes?.includes('FISHING')

  const insightsByVesselType = useMemo(
    () => (isFishingVessel ? INSIGHTS_FISHING : INSIGHTS_NON_FISHING),
    [isFishingVessel]
  )

  return (
    <div className={styles.container}>
      <h2 className="print-only">{t('vessel.sectionInsights', 'Insights')}</h2>
      <p className={styles.title}>
        {t('vessel.insights.sectionTitle', {
          defaultValue: 'Vessel insights between {{start}} and {{end}}',
          start: formatI18nDate(start),
          end: formatI18nDate(end),
        })}
        <DataTerminology
          size="tiny"
          type="default"
          title={t('vessel.sectionInsights', 'Insights')}
          terminologyKey="insights"
        />
      </p>
      {DateTime.fromISO(start).year < MIN_INSIGHTS_YEAR && (
        <div className={styles.disclaimer}>
          <Icon icon="warning" type="warning" />
          {t(
            'vessel.insights.disclaimerTimeRangeBeforeMinYear',
            'Due to varying quality of data sources, insights are more reliable for activities after Jan 1, 2017. Adjust the start/end date of your timebar, where relevant.'
          )}
        </div>
      )}
      {insightsByVesselType.map((insight) => (
        <InsightWrapper insight={insight} key={insight} />
      ))}
    </div>
  )
}

export default Insights
