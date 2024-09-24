import React, { Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import { useTranslation } from 'react-i18next'
import { Tooltip as GFWTooltip } from '@globalfishingwatch/ui-components'
import { selectReportVesselGraph } from 'features/app/selectors/app.reports.selector'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import { useLocationConnect } from 'routes/routes.hook'
import { ReportVesselsGraphPlaceholder } from 'features/reports/areas/placeholders/ReportVesselsPlaceholder'
import {
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_VESSELS_GRAPH_GEARTYPE,
  REPORT_VESSELS_GRAPH_VESSELTYPE,
} from 'data/config'
import { EMPTY_API_VALUES, OTHERS_CATEGORY_LABEL } from 'features/reports/areas/reports.config'
import { getVesselGearTypeLabel } from 'utils/info'
import { ReportVesselGraph } from 'features/reports/areas/reports.types'
import {
  selectReportVesselsGraphDataGrouped,
  selectReportVesselsGraphDataOthers,
} from 'features/reports/activity/vessels/report-activity-vessels.selectors'
import { cleanFlagState } from 'features/reports/activity/vessels/report-activity-vessels.utils'
import { selectReportDataviewsWithPermissions } from 'features/reports/areas/reports.selectors'
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
  const { x, y, payload, width, visibleTicksCount } = props
  const { t } = useTranslation()
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  const othersData = useSelector(selectReportVesselsGraphDataOthers)
  const { dispatchQueryParams } = useLocationConnect()
  const isOtherCategory = payload.value === OTHERS_CATEGORY_LABEL
  const isCategoryInteractive = !EMPTY_API_VALUES.includes(payload.value)

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

  const filterProperties = {
    [REPORT_VESSELS_GRAPH_FLAG]: 'flag',
    [REPORT_VESSELS_GRAPH_GEARTYPE]: 'gear',
    [REPORT_VESSELS_GRAPH_VESSELTYPE]: 'type',
  }

  const onLabelClick = () => {
    if (isCategoryInteractive) {
      const vesselFilter = isOtherCategory
        ? cleanFlagState(
            othersData!
              ?.flatMap((d) => (EMPTY_API_VALUES.includes(d.name) ? [] : getTickLabel(d.name)))
              .join('|')
          )
        : getTickLabel(payload.value)
      dispatchQueryParams({
        reportVesselFilter: `${filterProperties[selectedReportVesselGraph]}:${vesselFilter}`,
        reportVesselPage: 0,
      })
    }
  }

  const tooltip = isOtherCategory ? (
    <ul>
      {othersData!?.slice(0, MAX_OTHER_TOOLTIP_ITEMS).map(({ name, value }) => (
        <li key={`${name}-${value}`}>{`${getTickLabel(name)}: ${value}`}</li>
      ))}
      {othersData!?.length > MAX_OTHER_TOOLTIP_ITEMS && (
        <li>
          + {othersData!?.length - MAX_OTHER_TOOLTIP_ITEMS} {t('analysis.others', 'Others')}
        </li>
      )}
    </ul>
  ) : (
    ''
  )
  const label = isOtherCategory ? t('analysis.others', 'Others') : getTickLabel(payload.value)
  const labelChunks = label.split(' ')
  let labelChunksClean = [labelChunks[0]]
  labelChunks.slice(1).forEach((chunk: any) => {
    let currentChunk = labelChunksClean[labelChunksClean.length - 1]
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
  const { t } = useTranslation()
  const dataviews = useSelector(selectReportDataviewsWithPermissions)
  const data = useSelector(selectReportVesselsGraphDataGrouped)
  const selectedReportVesselGraph = useSelector(selectReportVesselGraph)
  return (
    <Fragment>
      <div className={styles.graph} data-test="report-vessels-graph">
        {data ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 15,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              {data && (
                <Tooltip content={<ReportGraphTooltip type={selectedReportVesselGraph} />} />
              )}
              {dataviews.map((dataview, index) => {
                return (
                  <Bar
                    key={dataview.id}
                    dataKey={dataview.id}
                    stackId="a"
                    fill={dataview.config?.color}
                  >
                    {index === dataviews.length - 1 && (
                      <LabelList
                        position="top"
                        valueAccessor={(entry: any) => formatI18nNumber(entry.value[1])}
                      />
                    )}
                  </Bar>
                )
              })}
              <XAxis
                dataKey="name"
                interval="preserveStart"
                tickLine={false}
                minTickGap={-1000}
                tick={<CustomTick />}
                tickMargin={0}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ReportVesselsGraphPlaceholder animate={false}>
            {t('analysis.noVesselDataFiltered', 'There are no vessels matching your filter')}
          </ReportVesselsGraphPlaceholder>
        )}
      </div>
    </Fragment>
  )
}
