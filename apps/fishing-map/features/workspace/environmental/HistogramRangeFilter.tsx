import { useCallback } from 'react'
import { BarChart, Bar, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { SliderRange, SliderRangeValues } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { getEnvironmentalDatasetRange } from '@globalfishingwatch/datasets-client'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useDataviewHistogram } from 'features/workspace/environmental/histogram.hooks'
import { getEventLabel } from 'utils/analytics'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import styles from './HistogramRangeFilter.module.css'

type HistogramRangeFilterProps = {
  dataview: UrlDataviewInstance
}

function HistogramRangeFilter({ dataview }: HistogramRangeFilterProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const histogram = useDataviewHistogram(dataview)
  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings) as Dataset
  const layerRange = getEnvironmentalDatasetRange(dataset)
  const minSliderValue = dataview.config?.minVisibleValue ?? layerRange.min
  const maxSliderValue = dataview.config?.maxVisibleValue ?? layerRange.max
  const sliderConfig = {
    steps: [layerRange.min, layerRange.max],
    min: minSliderValue,
    max: maxSliderValue,
  }

  const onSliderChange = useCallback(
    (rangeSelected: SliderRangeValues) => {
      if (rangeSelected[0] === layerRange.min && rangeSelected[1] === layerRange.max) {
        // onClean(id)
      } else {
        upsertDataviewInstance({
          id: dataview.id,
          config: {
            minVisibleValue: rangeSelected[0],
            maxVisibleValue: rangeSelected[1],
          },
        })
      }
      trackEvent({
        category: TrackCategory.EnvironmentalData,
        action: `Filter environmental layer`,
        label: getEventLabel([dataview.name as string, ...rangeSelected.map((r) => r.toString())]),
      })
    },
    [layerRange?.min, layerRange?.max, dataview.name, dataview.id, upsertDataviewInstance]
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
        thumbsSize="small"
      />
    </div>
  )
}

export default HistogramRangeFilter
