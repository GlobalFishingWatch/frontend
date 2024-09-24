import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Collapsable } from '@globalfishingwatch/ui-components'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import { formatInfoField } from 'utils/info'
import VesselLink from 'features/vessel/VesselLink'
import { selectVGRData } from '../vessel-group-report.slice'
import { selectFetchVesselGroupReportMOUParams } from '../vessel-group-report.selectors'
import styles from './VGRInsights.module.css'
import VesselGroupReportInsightPlaceholder from './VGRInsightsPlaceholders'
import {
  MOUInsightCountry,
  MOUInsightList,
  MouVesselByCategoryInsight,
  MOUVesselByList,
  selectVGRMOUVesselsGrouped,
} from './vessel-group-report-insights.selectors'

type ExpandedMOUInsights = `${MOUInsightCountry}-${MOUInsightList}`

const VesselGroupReportInsightMOU = () => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const [insightsExpanded, setInsightsExpanded] = useState<ExpandedMOUInsights[]>([])
  const vesselGroup = useSelector(selectVGRData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportMOUParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup,
  })

  const MOUVesselsGrouped = useSelector(selectVGRMOUVesselsGrouped) || {}

  const hasVesselsInParisMOU = MOUVesselsGrouped?.paris
    ? Object.values(MOUVesselsGrouped?.paris).some((vessels) => vessels.length > 0)
    : false
  const hasVesselsInTokyoMOU = MOUVesselsGrouped?.tokyo
    ? Object.values(MOUVesselsGrouped?.tokyo).some((vessels) => vessels.length > 0)
    : false

  const VesselsInMOUByCategory = ({
    insights,
    onToggle,
    expanded,
    label,
  }: {
    insights: MouVesselByCategoryInsight[]
    onToggle: (isOpen: boolean) => void
    expanded: boolean
    label: string
  }) => {
    const insightsByVessel = groupBy(insights, (i) => i.vessel.id)
    return (
      <Collapsable
        open={expanded}
        className={styles.collapsable}
        labelClassName={cx(styles.collapsableLabel, styles.row)}
        label={label}
        onToggle={onToggle}
      >
        {Object.keys(insightsByVessel)?.length > 0 && (
          <ul className={styles.nested}>
            {Object.values(insightsByVessel).map((insights) => {
              const vessel = insights[0].vessel
              const name = formatInfoField(vessel.shipname, 'name')
              const flags = Array.from(new Set(insights.map((i) => i.insight.reference)))
              return (
                <li className={styles.row}>
                  <VesselLink
                    className={styles.link}
                    vesselId={vessel.id}
                    datasetId={vessel.dataset as string}
                    query={{
                      start: fetchVesselGroupParams.start,
                      end: fetchVesselGroupParams.end,
                    }}
                  >
                    {name}
                  </VesselLink>{' '}
                  ({flags.map((f) => formatInfoField(f, 'flag')).join(',')})
                </li>
              )
            })}
          </ul>
        )}
      </Collapsable>
    )
  }

  const getVesselsInMOU = (vessels: MOUVesselByList, country: MOUInsightCountry) => {
    const onToggle = (isOpen: boolean, list: MOUInsightList) => {
      setInsightsExpanded((expandedInsights) => {
        const expandedInsight = `${country}-${list}` as ExpandedMOUInsights
        if (isOpen && expandedInsights.includes(expandedInsight)) {
          return expandedInsights
        }
        return isOpen
          ? [...expandedInsights, expandedInsight]
          : expandedInsights.filter((insight) => insight !== expandedInsight)
      })
    }
    return (['black', 'grey'] as MOUInsightList[]).map((list) => {
      const vesselInsights = vessels[list]
      if (!vesselInsights || vesselInsights.length === 0) {
        return null
      }
      const uniqVessels = Array.from(new Set(vesselInsights.map((v) => v.vessel.id)))
      return (
        <div className={styles.nested}>
          <VesselsInMOUByCategory
            key={list}
            insights={vesselInsights}
            expanded={insightsExpanded.includes(`${country}-${list}`)}
            onToggle={(isOpen) => onToggle(isOpen, list)}
            label={t(`vesselGroupReport.insights.MOUListsCount`, {
              vessels: uniqVessels.length,
              list: t(`insights.lists.${list}`, list),
              defaultValue: `{{vessels}} vessels operated under a flag present on the {{list}} list`,
            })}
          />
        </div>
      )
    })
  }

  return (
    <div id="vessel-group-mou" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t('vesselGroupReport.insights.MOULists', 'MOU Lists')}</label>
        <DataTerminology
          size="tiny"
          type="default"
          title={t('vesselGroupReport.insights.MOULists', 'MOU Lists')}
          terminologyKey="insightsMOUList"
        />
      </div>
      {guestUser ? (
        <VesselIdentityFieldLogin />
      ) : isLoading || !vesselGroup ? (
        <VesselGroupReportInsightPlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : (
        <div className={styles.insightContent}>
          <div className={styles.nested}>
            <label className={styles.row}>{t('insights.countries.paris', 'Paris')}</label>
            {hasVesselsInParisMOU ? (
              getVesselsInMOU(MOUVesselsGrouped.paris, 'paris')
            ) : (
              <p className={cx(styles.secondary, styles.nested, styles.row)}>
                {t('vesselGroupReport.insights.MOUListsEmpty', {
                  defaultValue:
                    'No vessels flying under a flag present on the {{country}} MOU black or grey lists',
                  country: t('insights.countries.paris', 'Paris'),
                })}
              </p>
            )}
            <label className={styles.row}>{t('insights.countries.tokyo', 'Tokyo')}</label>
            {hasVesselsInTokyoMOU ? (
              getVesselsInMOU(MOUVesselsGrouped.tokyo, 'tokyo')
            ) : (
              <p className={cx(styles.secondary, styles.nested, styles.row)}>
                {t('vesselGroupReport.insights.MOUListsEmpty', {
                  defaultValue:
                    'No vessels flying under a flag present on the {{country}} MOU black or grey lists',
                  country: t('insights.countries.tokyo', 'Tokyo'),
                })}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VesselGroupReportInsightMOU