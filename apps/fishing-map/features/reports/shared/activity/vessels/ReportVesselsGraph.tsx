import React, { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { CategoricalChartFunc } from 'recharts/types/chart/generateCategoricalChart'

import {
  getResponsiveVisualizationItemValue,
  ResponsiveBarChart,
} from '@globalfishingwatch/responsive-visualizations'
import { Tooltip as GFWTooltip } from '@globalfishingwatch/ui-components'

import {
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_VESSELS_GRAPH_GEARTYPE,
  REPORT_VESSELS_GRAPH_VESSELTYPE,
} from 'data/config'
import { selectReportVesselGraph } from 'features/app/selectors/app.reports.selector'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import { EMPTY_API_VALUES, OTHERS_CATEGORY_LABEL } from 'features/reports/areas/area-reports.config'
import type { ReportVesselGraph } from 'features/reports/areas/area-reports.types'
import {
  REPORT_GRAPH_LABEL_KEY,
  selectReportVesselsGraphDataGrouped,
  selectReportVesselsGraphDataKeys,
  selectReportVesselsGraphDataOthers,
  selectReportVesselsGraphIndividualData,
} from 'features/reports/shared/activity/vessels/report-activity-vessels.selectors'
import { cleanFlagState } from 'features/reports/shared/activity/vessels/report-activity-vessels.utils'
import { ReportBarGraphPlaceholder } from 'features/reports/shared/placeholders/ReportBarGraphPlaceholder'
import VesselGraphLink from 'features/reports/shared/VesselGraphLink'
import VesselGroupReportVesselsIndividualTooltip from 'features/reports/vessel-groups/vessels/VesselGroupReportVesselsIndividualTooltip'
import { useLocationConnect } from 'routes/routes.hook'
import { getVesselGearTypeLabel } from 'utils/info'

import styles from './ReportVesselsGraph.module.css'

const MAX_OTHER_TOOLTIP_ITEMS = 10

type ReportGraphTooltipProps = {
  active: boolean
  payload: {
    name: string
    dataKey: string
    label: number
    value: number
    payload: any
    color: string
    unit: string
  }[]
  label: string
  type: ReportVesselGraph
}

const FILTER_PROPERTIES = {
  [REPORT_VESSELS_GRAPH_FLAG]: 'flag',
  [REPORT_VESSELS_GRAPH_GEARTYPE]: 'gear',
  [REPORT_VESSELS_GRAPH_VESSELTYPE]: 'type',
}

const ReportGraphTooltip = (props: any) => {
  const { active, payload, label, type } = props as ReportGraphTooltipProps
  const { t } = useTranslation()

  let translatedLabel = ''
  if (EMPTY_API_VALUES.includes(label)) translatedLabel = t('common.unknown', 'Unknown')
  else if (type === 'geartype') {
    translatedLabel = getVesselGearTypeLabel({ geartypes: label })
  } else {
    translatedLabel = t(`flags:${label}` as any, label)
  }
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{translatedLabel}</p>
        <ul>
          {payload
            .map(({ value, color }, index) => {
              return value !== 0 ? (
                <li key={index} className={styles.tooltipValue}>
                  <span className={styles.tooltipValueDot} style={{ color }}></span>
                  <I18nNumber number={value} /> {t('common.vessel', { count: value }).toLowerCase()}
                </li>
              ) : null
            })
            .reverse()}
        </ul>
      </div>
    )
  }

  return null
}

const CustomTick = (props: any) => {
  const { x, y, payload, width, visibleTicksCount, getTickLabel } = props
  const { t } = useTranslation()
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  const othersData = useSelector(selectReportVesselsGraphDataOthers)
  const { dispatchQueryParams } = useLocationConnect()
  const isOtherCategory = payload.value === OTHERS_CATEGORY_LABEL
  const isCategoryInteractive = !EMPTY_API_VALUES.includes(payload.value)

  const onLabelClick = () => {
    if (isCategoryInteractive) {
      const vesselFilter = isOtherCategory
        ? cleanFlagState(
            (
              othersData?.flatMap((d) =>
                EMPTY_API_VALUES.includes(d.name as string) ? [] : getTickLabel(d.name as string)
              ) || []
            ).join('|')
          )
        : getTickLabel(payload.value)
      dispatchQueryParams({
        reportVesselFilter: `${FILTER_PROPERTIES[selectedReportVesselGraph]}:${vesselFilter}`,
        reportVesselPage: 0,
      })
    }
  }

  const tooltip = isOtherCategory ? (
    <ul>
      {othersData
        ?.slice(0, MAX_OTHER_TOOLTIP_ITEMS)
        .map(({ name, value }) => (
          <li
            key={`${name}-${value}`}
          >{`${getTickLabel(name)}: ${getResponsiveVisualizationItemValue(value)}`}</li>
        ))}
      {othersData && othersData.length > MAX_OTHER_TOOLTIP_ITEMS && (
        <li>
          + {othersData.length - MAX_OTHER_TOOLTIP_ITEMS} {t('analysis.others', 'Others')}
        </li>
      )}
    </ul>
  ) : (
    ''
  )
  const label = isOtherCategory ? t('analysis.others', 'Others') : getTickLabel(payload.value)
  const labelChunks = label.split(' ')
  const labelChunksClean = [labelChunks[0]]
  labelChunks.slice(1).forEach((chunk: any) => {
    const currentChunk = labelChunksClean[labelChunksClean.length - 1]
    if (currentChunk.length + chunk.length >= width / visibleTicksCount / 8) {
      labelChunksClean.push(chunk)
    } else {
      labelChunksClean[labelChunksClean.length - 1] = currentChunk + ' ' + chunk
    }
  })

  return (
    <GFWTooltip content={tooltip} placement="bottom">
      <text
        className={cx({ [styles.axisLabel]: isCategoryInteractive })}
        transform={`translate(${x},${y - 3})`}
        onClick={onLabelClick}
      >
        {labelChunksClean.map((chunk) => (
          <Fragment key={chunk}>
            <tspan textAnchor="middle" x="0" dy={12}>
              {chunk}{' '}
            </tspan>
            {isOtherCategory && (
              <Fragment>
                <tspan>&nbsp;</tspan>
                <tspan className={styles.info}>i</tspan>
              </Fragment>
            )}
          </Fragment>
        ))}
      </text>
    </GFWTooltip>
  )
}

export default function ReportVesselsGraph() {
  const valueKeys = useSelector(selectReportVesselsGraphDataKeys)
  const data = useSelector(selectReportVesselsGraphDataGrouped)
  const individualData = useSelector(selectReportVesselsGraphIndividualData)
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  const othersData = useSelector(selectReportVesselsGraphDataOthers)
  const { dispatchQueryParams } = useLocationConnect()

  const { t } = useTranslation()

  const getTickLabel = (label: string) => {
    if (EMPTY_API_VALUES.includes(label)) return t('analysis.unknown', 'Unknown')
    switch (selectedReportVesselGraph) {
      case 'geartype':
        return getVesselGearTypeLabel({ geartypes: label })
      case 'vesselType':
        return `${t(`vessel.vesselTypes.${label?.toLowerCase()}` as any, label)}`
      case 'flag':
        return t(`flags:${label}` as any, label)
      default:
        return label
    }
  }
  // TODO: add this interaction
  const onLabelClick: CategoricalChartFunc = (e) => {
    const { payload } = e.activePayload?.[0] || {}
    if (!payload) return
    if (payload && !EMPTY_API_VALUES.includes(payload.name)) {
      const vesselFilter =
        payload.name === OTHERS_CATEGORY_LABEL
          ? cleanFlagState(
              (
                othersData?.flatMap((d) =>
                  EMPTY_API_VALUES.includes(d.name as string) ? [] : getTickLabel(d.name as string)
                ) || []
              ).join('|')
            )
          : getTickLabel(payload.name)
      dispatchQueryParams({
        reportVesselFilter: `${FILTER_PROPERTIES[selectedReportVesselGraph]}:${vesselFilter}`,
        reportVesselPage: 0,
      })
    }
  }

  // const getIndividualData = useCallback(async () => {
  //   return individualData
  // }, [individualData])

  const getAggregatedData = useCallback(async () => {
    return data as any[]
  }, [data])

  if (!data) {
    return (
      <div className={styles.graph} data-test="activity-report-vessels-graph">
        <ReportBarGraphPlaceholder animate={false} />
      </div>
    )
  }

  return (
    <Fragment>
      <div className={styles.graph} data-test="activity-report-vessels-graph">
        <ResponsiveBarChart
          // getIndividualData={getIndividualData}
          getAggregatedData={getAggregatedData}
          // onAggregatedItemClick={onBarClick}
          // onIndividualItemClick={onPointClick}
          aggregatedValueKey={valueKeys}
          barValueFormatter={(value: any) => {
            return formatI18nNumber(value).toString()
          }}
          barLabel={<CustomTick getTickLabel={getTickLabel} />}
          labelKey={REPORT_GRAPH_LABEL_KEY}
          individualTooltip={<VesselGroupReportVesselsIndividualTooltip />}
          individualItem={<VesselGraphLink />}
          aggregatedTooltip={<ReportGraphTooltip type={selectedReportVesselGraph} />}
        />
      </div>
    </Fragment>
  )
}
