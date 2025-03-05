import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { groupBy } from 'es-toolkit'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Collapsable } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import VesselLink from 'features/vessel/VesselLink'
import { formatInfoField } from 'utils/info'

import { selectFetchVesselGroupReportMOUParams } from '../../report-vessel-group/vessel-group-report.selectors'
import { selectVGRData } from '../../report-vessel-group/vessel-group-report.slice'

import type {
  MOUInsightCountry,
  MOUInsightList,
  MouVesselByCategoryInsight,
  MOUVesselByList,
} from './vessel-group-report-insights.selectors'
import { selectVGRMOUVesselsGrouped } from './vessel-group-report-insights.selectors'
import VesselGroupReportInsightPlaceholder from './VGRInsightsPlaceholders'

import styles from './VGRInsights.module.css'

type ExpandedMOUInsights = `${MOUInsightCountry}-${MOUInsightList}`

const VesselGroupReportInsightMOU = ({ skip }: { skip?: boolean }) => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const [insightsExpanded, setInsightsExpanded] = useState<ExpandedMOUInsights[]>([])
  const vesselGroup = useSelector(selectVGRData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportMOUParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup || skip,
  })

  const onVesselClick = (e: MouseEvent, vesselId?: string) => {
    trackEvent({
      category: TrackCategory.VesselGroupReport,
      action: 'vessel_group_profile_insights_mou_go_to_vessel',
      label: vesselId,
    })
  }

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
              const name = formatInfoField(vessel.shipname, 'shipname')
              const flags = Array.from(new Set(insights.map((i) => i.insight.reference)))
              return (
                <li className={styles.row} key={vessel.id}>
                  <VesselLink
                    className={styles.link}
                    vesselId={vessel.id}
                    datasetId={vessel.dataset as string}
                    onClick={onVesselClick}
                    query={{
                      start: fetchVesselGroupParams.start,
                      end: fetchVesselGroupParams.end,
                      vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
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
          trackEvent({
            category: TrackCategory.VesselGroupReport,
            action: 'vessel_group_profile_insights_tab_expand_insights',
            label: `${country} ${list} expanded`,
          })
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
        <div className={styles.nested} key={list}>
          <VesselsInMOUByCategory
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
          title={t('vesselGroupReport.insights.MOULists', 'MOU Lists')}
          terminologyKey="insightsMOUList"
        />
      </div>
      {guestUser ? (
        <VesselIdentityFieldLogin />
      ) : skip || isLoading || !vesselGroup ? (
        <VesselGroupReportInsightPlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : (
        <div className={styles.insightContent}>
          <div className={styles.nested}>
            <label className={styles.row}>{t('vessel.insights.countries.paris', 'Paris')}</label>
            {hasVesselsInParisMOU ? (
              getVesselsInMOU(MOUVesselsGrouped.paris, 'paris')
            ) : (
              <p className={cx(styles.secondary, styles.nested, styles.row)}>
                {t('vesselGroupReport.insights.MOUListsEmpty', {
                  defaultValue:
                    'No vessels flying under a flag present on the {{country}} MOU black or grey lists',
                  country: t('vessel.insights.countries.paris', 'Paris'),
                })}
              </p>
            )}
            <label className={styles.row}>{t('vessel.insights.countries.tokyo', 'Tokyo')}</label>
            {hasVesselsInTokyoMOU ? (
              getVesselsInMOU(MOUVesselsGrouped.tokyo, 'tokyo')
            ) : (
              <p className={cx(styles.secondary, styles.nested, styles.row)}>
                {t('vesselGroupReport.insights.MOUListsEmpty', {
                  defaultValue:
                    'No vessels flying under a flag present on the {{country}} MOU black or grey lists',
                  country: t('vessel.insights.countries.tokyo', 'Tokyo'),
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
