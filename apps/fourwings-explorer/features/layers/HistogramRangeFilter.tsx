import { useCallback } from 'react'
import { BarChart, Bar, ResponsiveContainer } from 'recharts'
import { SliderRange } from '@globalfishingwatch/ui-components'
import type { FourwingsAPIDataset } from 'features/datasets/datasets.types'
import type { DatasetLayer, FourwingsLayerConfig} from 'features/layers/layers.hooks';
import { useLayersConfig } from 'features/layers/layers.hooks'
import { useLayerHistogram } from 'features/map/histogram.hooks'
import styles from './HistogramRangeFilter.module.css'

type HistogramRangeFilterProps = {
  layer: DatasetLayer<FourwingsAPIDataset, FourwingsLayerConfig>
}

export const getLayerDatasetRange = (layer) => {
  const { max, min, scale = 1, offset = 0 } = layer.dataset?.configuration

  // Using Math.max to ensure we don't show negative values as 4wings doesn't support them yet
  const cleanMin = Math.max(0, Math.floor(min * scale + offset))
  const cleanMax = Math.ceil(max * scale + offset)
  return {
    min: cleanMin,
    max: cleanMax,
  }
}

function HistogramRangeFilter({ layer }: HistogramRangeFilterProps) {
  const { updateLayer } = useLayersConfig()
  const histogram = useLayerHistogram(layer)
  const { max, min } = layer.dataset?.configuration
  const showRange = max !== undefined && min !== undefined
  const layerRange = getLayerDatasetRange(layer)
  const minSliderValue = layer.config?.minVisibleValue ?? layerRange.min
  const maxSliderValue = layer.config?.maxVisibleValue ?? layerRange.max
  const sliderConfig = {
    steps: [layerRange.min, layerRange.max],
    min: minSliderValue,
    max: maxSliderValue,
  }

  const onSliderChange = useCallback(
    (rangeSelected) => {
      if (rangeSelected[0] === min && rangeSelected[1] === max) {
        // onClean(id)
      } else {
        updateLayer({
          id: layer.id,
          config: {
            minVisibleValue: rangeSelected[0],
            maxVisibleValue: rangeSelected[1],
          },
        })
      }
    },
    [layer.id, max, min, updateLayer]
  )

  if (!showRange) return null

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
        label="filter values"
        config={sliderConfig}
        onChange={onSliderChange}
        histogram={false}
      />
    </div>
  )
}

export default HistogramRangeFilter
