import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Collapsable } from '@globalfishingwatch/ui-components'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import { formatInfoField } from 'utils/info'
import { selectVesselGroupReportData } from '../vessel-group-report.slice'
import { selectFetchVesselGroupReportMOUParams } from '../vessel-group-report.selectors'
import styles from './VesselGroupReportInsight.module.css'
import VesselGroupReportInsightPlaceholder from './VesselGroupReportInsightsPlaceholders'
import {
  MOUInsightCountry,
  MOUInsightList,
  MouVesselByCategoryInsight,
  MOUVesselByList,
  selectVesselGroupReportMOUVesselsGrouped,
} from './vessel-group-report-insights.selectors'

type ExpandedMOUInsights = `${MOUInsightCountry}-${MOUInsightList}`

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
      labelClassName={styles.collapsableLabel}
      label={label}
      onToggle={onToggle}
    >
      {Object.keys(insightsByVessel)?.length > 0 && (
        <ul>
          {Object.values(insightsByVessel).map((insights) => {
            const name = formatInfoField(insights[0].vessel.shipname, 'name')
            const flags = Array.from(new Set(insights.map((i) => i.insight.reference)))
            return (
              <li>
                {name} ({flags.map((f) => formatInfoField(f, 'flag')).join(',')})
              </li>
            )
          })}
        </ul>
      )}
    </Collapsable>
  )
}

const VesselGroupReportInsightMOU = () => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const [insightsExpanded, setInsightsExpanded] = useState<ExpandedMOUInsights[]>([])
  const vesselGroup = useSelector(selectVesselGroupReportData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportMOUParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup,
  })

  const MOUVesselsGrouped = useSelector(selectVesselGroupReportMOUVesselsGrouped) || {}

  const hasVesselsInParisMOU = MOUVesselsGrouped?.paris
    ? Object.values(MOUVesselsGrouped?.paris).some((vessels) => vessels.length > 0)
    : false
  const hasVesselsInTokyoMOU = MOUVesselsGrouped?.tokyo
    ? Object.values(MOUVesselsGrouped?.tokyo).some((vessels) => vessels.length > 0)
    : false

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
        <Fragment>
          <label>{t('insights.countries.paris', 'Paris')}</label>
          {hasVesselsInParisMOU ? (
            getVesselsInMOU(MOUVesselsGrouped.paris, 'paris')
          ) : (
            <p>
              {t('vesselGroupReport.insights.MOUListsEmpty', {
                defaultValue:
                  'No vessels flying under a flag present on the {{country}} MOU black or grey lists',
                country: t('insights.countries.paris', 'Paris'),
              })}
            </p>
          )}
          <label>{t('insights.countries.tokyo', 'Tokyo')}</label>
          {hasVesselsInTokyoMOU ? (
            getVesselsInMOU(MOUVesselsGrouped.tokyo, 'tokyo')
          ) : (
            <p>
              {t('vesselGroupReport.insights.MOUListsEmpty', {
                defaultValue:
                  'No vessels flying under a flag present on the {{country}} MOU black or grey lists',
                country: t('insights.countries.tokyo', 'Tokyo'),
              })}
            </p>
          )}
        </Fragment>
      )}
    </div>
  )
}

export default VesselGroupReportInsightMOU
