import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { isDetectionsDataview, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { isActivityDataview } from 'features/workspace/activity/activity.utils'
import { t } from 'features/i18n/i18n'
import { getFlagsByIds } from 'utils/flags'
import {
  getSchemaFieldsSelectedInDataview,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectAnalysisTimeComparison, selectAnalysisTypeQuery } from 'features/app/app.selectors'
import { getDatasetNameTranslated } from 'features/i18n/utils'
import { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import { selectShowTimeComparison } from './analysis.selectors'

export const FIELDS = [
  ['geartype', 'layer.gearType_other', 'Gear types'],
  ['fleet', 'layer.fleet_other', 'Fleets'],
  ['origin', 'vessel.origin', 'Origin'],
  ['vessel_type', 'vessel.vesselType_other', 'Vessel types'],
]

const sortStrings = (a: string, b: string) => a.localeCompare(b)

const getSerializedDatasets = (dataview: UrlDataviewInstance) => {
  return dataview.config?.datasets?.slice().sort(sortStrings).join(', ')
}

const getSerializedFilterFields = (dataview: UrlDataviewInstance, filterKey: string): string => {
  return dataview.config?.filters?.[filterKey]?.slice().sort(sortStrings).join(', ')
}

const getCommonProperties = (dataviews?: UrlDataviewInstance[], showTimeComparison?: boolean) => {
  const commonProperties: string[] = []
  const titleChunks: { label: string; strong?: boolean }[] = []

  if (dataviews && dataviews?.length > 0) {
    const firstDataviewDatasets = getSerializedDatasets(dataviews[0])

    if (showTimeComparison) {
      titleChunks.push({ label: t('analysis.changeIn', 'Change in') })
    }

    if (dataviews?.every((dataview) => dataview.category === dataviews[0].category)) {
      const activityDataview = isActivityDataview(dataviews[0])
      const detectionsDataview = isDetectionsDataview(dataviews[0])
      if (activityDataview || detectionsDataview) {
        let mainLabel = ''
        if (dataviews?.every((dataview) => dataview.name === dataviews[0].name)) {
          commonProperties.push('dataset')
          mainLabel = dataviews[0].name
        } else {
          if (activityDataview) {
            mainLabel = t('common.activity', 'Activity')
          } else {
            mainLabel = t('common.detections', 'Detections')
          }
        }
        titleChunks.push({ label: mainLabel, strong: true })
      } else {
        commonProperties.push('dataset')
        titleChunks.push({ label: dataviews[0].name || '', strong: true })
      }
    }

    if (
      dataviews?.every((dataview) => {
        const datasets = getSerializedDatasets(dataview)
        return datasets === firstDataviewDatasets
      })
    ) {
      commonProperties.push('source')
      const datasets = dataviews[0].datasets?.filter((d) =>
        dataviews[0].config?.datasets?.includes(d.id)
      )
      if (datasets?.length) {
        titleChunks.push({
          label: ` (${datasets?.map((d) => getDatasetNameTranslated(d)).join(', ')})`,
        })
      }
    }

    const firstDataviewFlags = getSerializedFilterFields(dataviews[0], 'flag')
    if (
      dataviews?.every((dataview) => {
        const flags = getSerializedFilterFields(dataview, 'flag')
        return flags === firstDataviewFlags
      })
    ) {
      commonProperties.push('flag')
      const flags = getFlagsByIds(dataviews[0].config?.filters?.flag || [])
      if (firstDataviewFlags) {
        if (dataviews[0].config?.filterOperators?.flag === 'include') {
          titleChunks.push({ label: t('analysis.vesselFlags', 'by vessels flagged by') })
        } else {
          titleChunks.push({
            label: t('analysis.vesselFlagsExclude', 'by all vessels except the ones flagged by'),
          })
        }
        titleChunks.push({ label: `${flags?.map((d) => d.label).join(', ')}`, strong: true })
      }
    }

    // Collect common filters that are not 'flag'
    const firstDataviewGenericFilterKeys =
      dataviews[0].config && dataviews[0].config?.filters
        ? Object.keys(dataviews[0].config?.filters).filter((key) => key !== 'flag')
        : []

    const genericFilters: Record<string, string>[] = []
    firstDataviewGenericFilterKeys.forEach((filterKey) => {
      const firstDataviewGenericFilterFields = getSerializedFilterFields(dataviews[0], filterKey)
      if (
        dataviews?.every((dataview) => {
          const genericFilterFields = getSerializedFilterFields(dataview, filterKey)
          return genericFilterFields === firstDataviewGenericFilterFields
        })
      ) {
        const keyLabelField = FIELDS.find((field) => field[0] === filterKey)
        const keyLabel = keyLabelField
          ? t(keyLabelField[1], keyLabelField[2]).toLocaleLowerCase()
          : filterKey

        const valuesLabel = getSchemaFieldsSelectedInDataview(
          dataviews[0],
          filterKey as SupportedDatasetSchema
        )
          .map((f) => f.label.toLocaleLowerCase())
          .join(', ')
        genericFilters.push({
          keyLabel,
          valuesLabel,
        })
        commonProperties.push(filterKey)
      }
    })

    if (genericFilters.length) {
      titleChunks.push({ label: t('analysis.filteredBy', 'filtered by') })
      titleChunks.push({
        label: genericFilters
          .map((genericFilter) => `${genericFilter.keyLabel}: ${genericFilter.valuesLabel}`)
          .join('; '),
        strong: true,
      })
    }
  }

  return { titleChunks, commonProperties }
}

export type DescriptionChunks = {
  label: string
  strong?: boolean
}[]

export const useTimeCompareTimeDescription = (addPrefix = true) => {
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const analysisType = useSelector(selectAnalysisTypeQuery)
  if (!timeComparison) return undefined
  const startLabel = formatI18nDate(timeComparison.start, {
    format: DateTime.DATE_MED_WITH_WEEKDAY,
  })
  const compareStartLabel = formatI18nDate(timeComparison.compareStart, {
    format: DateTime.DATE_MED_WITH_WEEKDAY,
  })

  const durationTypeLabel =
    parseInt(timeComparison.duration as any) === 1
      ? t(`common.${timeComparison.durationType}_one`)
      : t(`common.${timeComparison.durationType}_other`)
  const durationLabel = [timeComparison.duration, durationTypeLabel].join(' ')

  let label =
    analysisType === 'periodComparison'
      ? t('analysis.periodComparisonRange', {
          compareStart: formatI18nDate(timeComparison.compareStart, {
            format: DateTime.DATE_MED_WITH_WEEKDAY,
          }),
          start: startLabel,
          duration: durationLabel,
          defaultValue:
            'in the {{duration}} following {{compareStart}} compared to baseline in the {{duration}} following {{start}}',
        })
      : t('analysis.beforeAfterRange', {
          compareStart: compareStartLabel,
          duration: durationLabel,
          defaultValue: 'between the {{duration}} before and after {{compareStart}}',
        })

  if (addPrefix) {
    label = [t('analysis.change', 'Change'), label].join(' ')
  }

  return label
}

const useDescription = (
  titleChunks: { label: string; strong?: boolean }[],
  analysisAreaName: string,
  graphData: AnalysisGraphProps | undefined
): DescriptionChunks => {
  const { start, end } = useTimerangeConnect()
  const analysisType = useSelector(selectAnalysisTypeQuery)
  const timeCompareTimeDescription = useTimeCompareTimeDescription(false)

  if (!titleChunks || !titleChunks.length) return []

  const descriptionChunks = [...titleChunks]
  if (analysisAreaName) {
    descriptionChunks.push({ label: t('common.in', 'in') })
    descriptionChunks.push({ label: analysisAreaName, strong: true })
  }
  if (
    analysisType === 'periodComparison' ||
    (analysisType === 'beforeAfter' && timeCompareTimeDescription)
  ) {
    descriptionChunks.push({
      label: timeCompareTimeDescription as string,
      strong: true,
    })
  } else if (start && end) {
    const dateFormat =
      graphData?.interval === 'hour'
        ? DateTime.DATETIME_MED_WITH_WEEKDAY
        : DateTime.DATE_MED_WITH_WEEKDAY
    descriptionChunks.push({
      label: t('common.dateRange', {
        start: formatI18nDate(start, { format: dateFormat }),
        end: formatI18nDate(end, { format: dateFormat }),
        defaultValue: 'between {{start}} and {{end}}',
      }),
      strong: true,
    })
  }
  return descriptionChunks
}

const useAnalysisDescription = (analysisAreaName: string, graphData?: AnalysisGraphProps) => {
  const dataviewsIds = useMemo(() => {
    return graphData ? graphData.sublayers.map((s) => s.id) : []
  }, [graphData])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const { titleChunks, commonProperties } = useMemo(() => {
    return getCommonProperties(dataviews, showTimeComparison)
  }, [dataviews, showTimeComparison])

  const description = useDescription(titleChunks, analysisAreaName, graphData)
  return { description, commonProperties }
}

export default useAnalysisDescription
