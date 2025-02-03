import React, { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type {
  ResponsiveVisualizationData,
  ResponsiveVisualizationInteractionCallback,
} from '@globalfishingwatch/responsive-visualizations'
import { ResponsiveBarChart } from '@globalfishingwatch/responsive-visualizations'

import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import { EMPTY_API_VALUES, OTHERS_CATEGORY_LABEL } from 'features/reports/reports.config'
import type { ReportState, ReportVesselsSubCategory } from 'features/reports/reports.types'
import ReportVesselsIndividualTooltip from 'features/reports/shared/vessels/ReportVesselsIndividualTooltip'
import VesselGraphLink from 'features/reports/shared/vessels/VesselGraphLink'
import { REPORT_GRAPH_LABEL_KEY } from 'features/reports/tabs/activity/vessels/report-activity-vessels.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { formatInfoField } from 'utils/info'

import styles from './ReportVesselsGraph.module.css'

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
  type: ReportVesselsSubCategory | 'geartype'
}

const FILTER_PROPERTIES: Record<ReportVesselsSubCategory | 'geartype' | 'shiptype', string> = {
  flag: 'flag',
  shiptype: 'type',
  shiptypes: 'type',
  geartypes: 'gear',
  geartype: 'gear',
  source: 'source',
  // TODO:CVP this comes from activity graph component, ensure it works
  // [REPORT_VESSELS_GRAPH_FLAG]: 'flag',
  // [REPORT_VESSELS_GRAPH_GEARTYPE]: 'gear',
  // [REPORT_VESSELS_GRAPH_VESSELTYPE]: 'type',
}

const ReportBarTooltip = (props: any) => {
  const { active, payload, label, type } = props as ReportGraphTooltipProps
  const { t } = useTranslation()

  let parsedLabel = label
  if (EMPTY_API_VALUES.includes(label)) parsedLabel = t('common.unknown', 'Unknown')
  else if (type === 'flag') {
    parsedLabel = formatInfoField(label, 'flag') as string
  } else if (type === 'geartype') {
    parsedLabel = formatInfoField(label, 'geartypes') as string
  }
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{parsedLabel}</p>
        <ul>
          {payload
            .map(({ value, color }, index) => {
              return value !== 0 ? (
                <li key={index} className={styles.tooltipValue}>
                  {/* TODO:CVP review if this apply for every table */}
                  {/* <span className={styles.tooltipValueDot} style={{ color }}></span> */}
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
// TODO:CVP merge this with reports/tabs/activity/vessels/ReportVesselsGraph.tsx
const ReportGraphTick = (props: any) => {
  const { x, y, payload, width, visibleTicksCount, property, filterQueryParam, pageQueryParam } =
    props

  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const isOtherCategory = payload.value === OTHERS_CATEGORY_LABEL
  const isCategoryInteractive = !EMPTY_API_VALUES.includes(payload.value)

  const getTickLabel = (label: string) => {
    if (EMPTY_API_VALUES.includes(label)) return t('analysis.unknown', 'Unknown')
    switch (property) {
      case 'flag':
        return formatInfoField(label, 'flag') as string
      case 'geartype':
        return formatInfoField(label, 'geartypes') as string
      default:
        return label
    }
  }

  const onLabelClick = () => {
    if (payload.value !== OTHERS_CATEGORY_LABEL) {
      dispatchQueryParams({
        [filterQueryParam]: `${FILTER_PROPERTIES[property as ReportVesselsSubCategory]}:${
          payload.value
        }`,
        [pageQueryParam]: 0,
      })
    }
  }

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
  )
}

type ReportVesselsGraphProps = {
  data: ResponsiveVisualizationData<'aggregated'>
  individualData?: ResponsiveVisualizationData<'individual'>
  color?: string
  property: ReportVesselsSubCategory
  filterQueryParam?: keyof Pick<ReportState, 'reportVesselFilter'>
  pageQueryParam?: keyof Pick<ReportState, 'reportVesselPage'>
}

export default function ReportVesselsGraph({
  data,
  individualData,
  color = COLOR_PRIMARY_BLUE,
  property,
  filterQueryParam = 'reportVesselFilter',
  pageQueryParam = 'reportVesselPage',
}: ReportVesselsGraphProps) {
  const { dispatchQueryParams } = useLocationConnect()

  const onBarClick: ResponsiveVisualizationInteractionCallback = (payload: any) => {
    const propertyParam = FILTER_PROPERTIES[property as ReportVesselsSubCategory]
    if (payload && propertyParam && payload?.name !== OTHERS_CATEGORY_LABEL) {
      dispatchQueryParams({
        [filterQueryParam]: `${propertyParam}:${payload.name}`,
        [pageQueryParam]: 0,
      })
    }
  }

  const getAggregatedData = useCallback(async () => {
    return data
  }, [data])

  // const getIndividualData = useCallback(async () => {
  //   return individualData
  // }, [individualData])

  return (
    <div className={styles.graph} data-test="report-vessels-graph">
      <ResponsiveBarChart
        color={color}
        // getIndividualData={getIndividualData}
        getAggregatedData={getAggregatedData}
        onAggregatedItemClick={onBarClick}
        barValueFormatter={(value: any) => {
          return formatI18nNumber(value).toString()
        }}
        barLabel={
          <ReportGraphTick
            property={property}
            filterQueryParam={filterQueryParam}
            pageQueryParam={pageQueryParam}
          />
        }
        labelKey={REPORT_GRAPH_LABEL_KEY}
        individualTooltip={<ReportVesselsIndividualTooltip />}
        individualItem={<VesselGraphLink />}
        aggregatedTooltip={<ReportBarTooltip type={property} />}
      />
    </div>
  )
}
