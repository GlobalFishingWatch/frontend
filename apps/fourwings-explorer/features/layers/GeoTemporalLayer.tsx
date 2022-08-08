import { useState } from 'react'
import cx from 'classnames'
import { Tooltip, ColorBarOption, IconButton } from '@globalfishingwatch/ui-components'
import { useLayerPanelDataviewSort } from 'features/layers/layers-sort.hook'
import { DatasetLayer, useMapLayersConfig } from 'features/layers/layers.hooks'
import Remove from 'features/layers/common/Remove'
import Color from 'features/layers/common/Color'
import LayerSwitch from './common/LayerSwitch'
import Title from './common/Title'
import styles from './Layers.module.css'

type LayerPanelProps = {
  layer: DatasetLayer
  onToggle?: () => void
}

function GeoTemporalLayer({ layer, onToggle }: LayerPanelProps): React.ReactElement {
  const [colorOpen, setColorOpen] = useState(false)
  const { updateMapLayer } = useMapLayersConfig()

  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(layer.id)

  const layerActive = layer?.config?.visible ?? true

  const changeColor = (color: ColorBarOption) => {
    updateMapLayer({
      id: layer.id,
      config: {
        color: color.value,
        colorRamp: color.id,
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

  const title = layer.label

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
    </div>
  )
}

export default GeoTemporalLayer
