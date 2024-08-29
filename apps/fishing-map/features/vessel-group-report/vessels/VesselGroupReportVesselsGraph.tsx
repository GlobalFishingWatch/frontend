import React, { Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import { useTranslation } from 'react-i18next'
import { VesselGroupReportVesselsSubsection } from 'types'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import { ReportVesselsGraphPlaceholder } from 'features/area-report/placeholders/ReportVesselsPlaceholder'
import { EMPTY_API_VALUES, OTHERS_CATEGORY_LABEL } from 'features/area-report/reports.config'
import { getVesselGearType, getVesselShipType } from 'utils/info'
import { selectVesselGroupReportVesselsSubsection } from 'features/vessel-group-report/vessel.config.selectors'
import { selectVesselGroupReportVesselsGraphDataGrouped } from 'features/vessel-group-report/vessels/vessel-group-report-vessels.selectors'
import styles from './VesselGroupReportVesselsGraph.module.css'

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
  type: VesselGroupReportVesselsSubsection
}

const ReportGraphTooltip = (props: any) => {
  const { active, payload, label, type } = props as ReportGraphTooltipProps
  const { t } = useTranslation()

  let translatedLabel = ''
  if (EMPTY_API_VALUES.includes(label)) translatedLabel = t('common.unknown', 'Unknown')
  else if (type === 'geartypes') {
    translatedLabel = getVesselGearType({ geartypes: label })
  } else if (type === 'shiptypes') {
    translatedLabel = getVesselShipType({ shiptypes: label })
  } else if (type === 'source') {
    translatedLabel = t(`common.sourceOptions.${label}` as any, label)
  } else {
    translatedLabel = t(`flags:${label}` as any, label)
  }
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{translatedLabel}</p>
        <ul>
          {payload
            .map(({ value }, index) => {
              return value !== 0 ? (
                <li key={index} className={styles.tooltipValue}>
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
  const subsection = useSelector(selectVesselGroupReportVesselsSubsection)
  // const othersData = useSelector(selectReportVesselsGraphDataOthers)
  // const { dispatchQueryParams } = useLocationConnect()
  const isOtherCategory = payload.value === OTHERS_CATEGORY_LABEL
  const isCategoryInteractive = !EMPTY_API_VALUES.includes(payload.value)

  const getTickLabel = (label: string) => {
    if (EMPTY_API_VALUES.includes(label)) return t('analysis.unknown', 'Unknown')
    switch (subsection) {
      case 'geartypes':
        return getVesselGearType({ geartypes: label })
      case 'shiptypes':
        return `${t(`vessel.vesselTypes.${label?.toLowerCase()}` as any, label)}`
      case 'flag':
        return t(`flags:${label}` as any, label)
      case 'source':
        return t(`common.sourceOptions.${label}` as any, label)
      default:
        return label
    }
  }

  // const filterProperties = {
  //   [REPORT_VESSELS_GRAPH_FLAG]: 'flag',
  //   [REPORT_VESSELS_GRAPH_GEARTYPE]: 'gear',
  //   [REPORT_VESSELS_GRAPH_VESSELTYPE]: 'type',
  // }

  // const onLabelClick = () => {
  //   if (isCategoryInteractive) {
  //     const vesselFilter = isOtherCategory
  //       ? cleanFlagState(
  //           othersData!
  //             ?.flatMap((d) => (EMPTY_API_VALUES.includes(d.name) ? [] : getTickLabel(d.name)))
  //             .join('|')
  //         )
  //       : getTickLabel(payload.value)
  //     dispatchQueryParams({
  //       reportVesselFilter: `${filterProperties[selectedReportVesselGraph]}:${vesselFilter}`,
  //       reportVesselPage: 0,
  //     })
  //   }
  // }

  // const tooltip = isOtherCategory ? (
  //   <ul>
  //     {othersData!?.slice(0, MAX_OTHER_TOOLTIP_ITEMS).map(({ name, value }) => (
  //       <li key={`${name}-${value}`}>{`${getTickLabel(name)}: ${value}`}</li>
  //     ))}
  //     {othersData!?.length > MAX_OTHER_TOOLTIP_ITEMS && (
  //       <li>
  //         + {othersData!?.length - MAX_OTHER_TOOLTIP_ITEMS} {t('analysis.others', 'Others')}
  //       </li>
  //     )}
  //   </ul>
  // ) : (
  //   ''
  // )
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
    <text
      className={cx({ [styles.axisLabel]: isCategoryInteractive })}
      transform={`translate(${x},${y - 3})`}
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
  )
}

export default function ReportVesselsGraph() {
  const { t } = useTranslation()
  // const dataviews = useSelector(selectDataviewInstancesByCategory(DataviewCategory.VesselGroups))
  const data = useSelector(selectVesselGroupReportVesselsGraphDataGrouped)
  const selectedReportVesselGraph = useSelector(selectVesselGroupReportVesselsSubsection)
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
              <Bar dataKey="value" fill={'#007bff'}>
                <LabelList
                  position="top"
                  valueAccessor={(entry: any) => formatI18nNumber(entry.value)}
                />
              </Bar>
              <XAxis
                dataKey="name"
                interval="equidistantPreserveStart"
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
