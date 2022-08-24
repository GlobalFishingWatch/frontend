import { useState } from 'react'
import cx from 'classnames'
import { Tooltip, ColorBarOption, IconButton, Slider } from '@globalfishingwatch/ui-components'
import { ColorRampId } from '@globalfishingwatch/layer-composer'
import { useLayerPanelDataviewSort } from 'features/layers/layers-sort.hook'
import { DatasetLayer, FourwingsLayerConfig, useLayersConfig } from 'features/layers/layers.hooks'
import Remove from 'features/layers/common/Remove'
import Color from 'features/layers/common/Color'
import { FourwingsAPIDataset } from 'features/datasets/datasets.types'
import HistogramRangeFilter from 'features/layers/HistogramRangeFilter'
import LayerSwitch from './common/LayerSwitch'
import Title from './common/Title'
import styles from './Layers.module.css'

type LayerPanelProps = {
  layer: DatasetLayer<FourwingsAPIDataset, FourwingsLayerConfig>
  onToggle?: () => void
}

function GeoTemporalLayer({ layer, onToggle }: LayerPanelProps): React.ReactElement {
  const [colorOpen, setColorOpen] = useState(false)
  const { updateLayer } = useLayersConfig()

  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(layer.id)

  const layerActive = layer?.config?.visible ?? true

  const changeColor = (color: ColorBarOption) => {
    updateLayer({
      id: layer.id,
      config: {
        color: color.value,
        colorRamp: color.id as ColorRampId,
      },
    })
    setColorOpen(false)
  }
  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
  }

  const title = layer.dataset?.name

  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      layer={layer}
      onToggle={onToggle}
    />
  )

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: colorOpen,
        'print-hidden': !layerActive,
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch
          active={layerActive}
          className={styles.switch}
          layer={layer}
          onToggle={onToggle}
        />
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          {layerActive && (
            <Color
              layer={layer}
              colorType="fill"
              open={colorOpen}
              onColorClick={changeColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
          )}
          <Remove layer={layer} />
          {items.length > 1 && (
            <IconButton
              size="small"
              ref={setActivatorNodeRef}
              {...listeners}
              icon="drag"
              className={styles.dragger}
            />
          )}
        </div>
      </div>
      <div className={cx(styles.filters, { [styles.active]: layerActive })}>
        <HistogramRangeFilter layer={layer} />
      </div>
      <div className={styles.properties}>
        <div className={styles.legendContainer}>
          <div className={styles.legend} id={`legend_${layer.id}`}></div>
        </div>
      </div>
    </div>
  )
}

export default GeoTemporalLayer
