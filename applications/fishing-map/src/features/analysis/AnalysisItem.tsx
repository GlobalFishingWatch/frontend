import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { getFlagsByIds } from 'utils/flags'
import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { isFishingDataview, isPresenceDataview } from 'features/workspace/activity/activity.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  getSchemaFieldsSelectedInDataview,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import AnalysisLayerPanel from './AnalysisLayerPanel'
import AnalysisItemGraph, { AnalysisGraphProps } from './AnalysisItemGraph'
import styles from './AnalysisItem.module.css'

const FIELDS = [
  ['geartype', 'layer.gearType_plural', 'Gear types'],
  ['fleet', 'layer.fleet_plural', 'Fleets'],
  ['origin', 'vessel.origin', 'Origin'],
  ['vessel_type', 'vessel.vesselType_plural', 'Vessel types'],
]

const sortStrings = (a: string, b: string) => a.localeCompare(b)

const getSerializedDatasets = (dataview: UrlDataviewInstance) => {
  return dataview.config?.datasets?.slice().sort(sortStrings).join(', ')
}

const getSerializedFilterFields = (dataview: UrlDataviewInstance, filterKey: string): string => {
  return dataview.config?.filters?.[filterKey]?.slice().sort(sortStrings).join(', ')
}

const getCommonProperties = (dataviews?: UrlDataviewInstance[]) => {
  const commonProperties: string[] = []
  let title = ''

  if (dataviews && dataviews?.length > 0) {
    const firstDataviewDatasets = getSerializedDatasets(dataviews[0])

    if (dataviews?.every((dataview) => dataview.name === dataviews[0].name)) {
      commonProperties.push('dataset')
      const fishingDataview = isFishingDataview(dataviews[0])
      const presenceDataview = isPresenceDataview(dataviews[0])
      if (fishingDataview || presenceDataview) {
        title = presenceDataview
          ? t(`common.presence`, 'Vessel presence')
          : t(`common.apparentFishing`, 'Apparent Fishing Effort')
      } else {
        title += dataviews[0].name
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
        title += ` (${datasets?.map((d) => d.name).join(', ')})`
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
      if (firstDataviewFlags)
        title += ` ${t('analysis.vesselFlags', 'by vessels flagged by')} ${flags
          ?.map((d) => d.label)
          .join(', ')}`
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
      title += ' '
      title += t('analysis.filteredBy', 'filtered by')
      title += ' '
      title += genericFilters
        .map((genericFilter) => `${genericFilter.keyLabel}: ${genericFilter.valuesLabel}`)
        .join('; ')
    }
  }

  return { title, commonProperties }
}

function AnalysisItem({
  graphData,
  hasAnalysisLayers,
  analysisAreaName,
}: {
  graphData: AnalysisGraphProps
  hasAnalysisLayers: boolean
  analysisAreaName: string
}) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const dataviewsIds = useMemo(() => {
    return graphData.sublayers.map((s) => s.id)
  }, [graphData])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))
  const { title, commonProperties } = useMemo(() => {
    return getCommonProperties(dataviews)
  }, [dataviews])

  let description = analysisAreaName
    ? `${title} ${t('common.in', 'in')} ${analysisAreaName}`
    : title
  if (start && end) {
    description = `${description} ${t('common.dateRange', {
      start: formatI18nDate(start),
      end: formatI18nDate(end),
      defaultValue: 'between {{start}} and {{end}}',
    })}.`
  }
  return (
    <div className={styles.container}>
      {hasAnalysisLayers ? (
        <Fragment>
          <h3 className={styles.commonTitle}>{description}</h3>
          <div className={styles.layerPanels}>
            {dataviews?.map((dataview, index) => (
              <AnalysisLayerPanel
                key={dataview.id}
                dataview={dataview}
                index={index}
                hiddenProperties={commonProperties}
                availableFields={FIELDS}
              />
            ))}
          </div>
        </Fragment>
      ) : (
        <p className={styles.placeholder}>
          {t('analysis.empty', 'Your selected datasets will appear here')}
        </p>
      )}
      {start && end && <AnalysisItemGraph graphData={graphData} start={start} end={end} />}
    </div>
  )
}

export default AnalysisItem
