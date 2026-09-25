import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart } from 'recharts'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { SliderRangeValues } from '@globalfishingwatch/ui-components'
import { SliderRange } from '@globalfishingwatch/ui-components'

import {
  useDataviewHistogram,
  useDataviewValuesRange,
} from 'features/_map/workspace/environmental/histogram.hooks'
import HistogramRangeFilterPlaceholder from 'features/_map/workspace/environmental/HistogramRangeFilterPlaceholder'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getEventLabel } from 'utils/analytics'

import styles from './HistogramRangeFilter.module.css'

type HistogramRangeFilterProps = {
  dataview: UrlDataviewInstance
  onSelect: (args: {
    minVisibleValue: number | undefined
    maxVisibleValue: number | undefined
  }) => void
}

function HistogramRangeFilter({ dataview, onSelect }: HistogramRangeFilterProps) {
  const { t } = useTranslation()
  const layerRange = useDataviewValuesRange(dataview)
  const { histogram, loading } = useDataviewHistogram(dataview, layerRange)
  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings) as Dataset
  const isEnvironmental = dataview.category === DataviewCategory.Environment

  const onSliderChange = useCallback(
    (rangeSelected: SliderRangeValues) => {
      onSelect({
        minVisibleValue: rangeSelected[0] === layerRange?.min ? undefined : rangeSelected[0],
        maxVisibleValue: rangeSelected[1] === layerRange?.max ? undefined : rangeSelected[1],
      })
      trackEvent({
        category: isEnvironmental ? TrackCategory.EnvironmentalData : TrackCategory.ActivityData,
        action: `Filter ${dataview.category} layer by value`,
        label: getEventLabel([dataview.name as string, ...rangeSelected.map((r) => r.toString())]),
      })
    },
    [layerRange?.min, layerRange?.max, dataview.name, dataview.category, isEnvironmental, onSelect]
  )

  if (loading || (!layerRange && !histogram)) {
    return <HistogramRangeFilterPlaceholder />
  }

  if (!layerRange) {
    return null
  }

  const minSliderValue = dataview.config?.minVisibleValue ?? layerRange.min
  const maxSliderValue = dataview.config?.maxVisibleValue ?? layerRange.max
  const sliderConfig = {
    steps: [layerRange.min, layerRange.max],
    min: layerRange.min,
    max: layerRange.max,
  }

  return (
    <div className={styles.container}>
      <div className={styles.histogram}>
        <BarChart responsive width="100%" height={40} data={histogram}>
          <Bar dataKey="data" fill="#C7D8DC" />
        </BarChart>
      </div>
      <SliderRange
        key={`${layerRange.min}-${layerRange.max}`}
        className={styles.slider}
        labelClassName={styles.sliderLabel}
        initialRange={[minSliderValue, maxSliderValue]}
        label={`${t((t) => t.layer.filterValues).toUpperCase()}${dataset?.unit ? ` (${dataset?.unit})` : ''}`}
        config={sliderConfig}
        onChange={onSliderChange}
        histogram={false}
        thumbsSize="mini"
        showInputs
      />
    </div>
  )
}

export default HistogramRangeFilter
