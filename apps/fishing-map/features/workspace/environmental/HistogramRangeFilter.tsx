import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, ResponsiveContainer } from 'recharts'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getEnvironmentalDatasetRange } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { SliderRangeValues } from '@globalfishingwatch/ui-components'
import { SliderRange } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useDataviewHistogram } from 'features/workspace/environmental/histogram.hooks'
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
  const histogram = useDataviewHistogram(dataview)
  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings) as Dataset
  const layerRange = getEnvironmentalDatasetRange(dataset)
  const minSliderValue = dataview.config?.minVisibleValue ?? layerRange.min
  const maxSliderValue = dataview.config?.maxVisibleValue ?? layerRange.max
  const sliderConfig = {
    steps: [layerRange.min, layerRange.max],
    min: layerRange.min,
    max: layerRange.max,
  }

  const onSliderChange = useCallback(
    (rangeSelected: SliderRangeValues) => {
      if (rangeSelected[0] === layerRange.min && rangeSelected[1] === layerRange.max) {
        onSelect({
          minVisibleValue: undefined,
          maxVisibleValue: undefined,
        })
      } else {
        onSelect({
          minVisibleValue: rangeSelected[0],
          maxVisibleValue: rangeSelected[1],
        })
      }
      trackEvent({
        category: TrackCategory.EnvironmentalData,
        action: `Filter environmental layer`,
        label: getEventLabel([dataview.name as string, ...rangeSelected.map((r) => r.toString())]),
      })
    },
    [layerRange?.min, layerRange?.max, dataview?.name, onSelect]
  )

  return (
    <div className={styles.container}>
      <div className={styles.histogram}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={150} height={40} data={histogram}>
            <Bar dataKey="data" fill="#C7D8DC" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <SliderRange
        className={styles.slider}
        initialRange={[minSliderValue, maxSliderValue]}
        label={t('layer.filterValues', 'Filter values')}
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
