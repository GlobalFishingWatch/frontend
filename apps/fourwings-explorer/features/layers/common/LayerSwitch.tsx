import { Switch } from '@globalfishingwatch/ui-components'
import { DatasetLayer, useMapLayersConfig } from 'features/layers/layers.hooks'

type LayerSwitchProps = {
  active: boolean
  layer: DatasetLayer
  className: string
  disabled?: boolean
  onToggle?: (active: boolean) => void
  color?: string
}

const LayerSwitch = ({ active, layer, className, disabled, onToggle, color }: LayerSwitchProps) => {
  const { updateMapLayer } = useMapLayersConfig()
  const layerActive = layer?.config?.visible ?? true
  const onToggleLayerActive = () => {
    updateMapLayer({
      id: layer.id,
      config: {
        visible: !layerActive,
      },
    })
    if (onToggle) {
      onToggle(!layerActive)
    }
  }
  return (
    <Switch
      disabled={disabled}
      active={active}
      onClick={onToggleLayerActive}
      tooltip="Toggle layer visibility"
      tooltipPlacement="top"
      className={className}
      color={color || layer.config?.color}
    />
  )
}

export default LayerSwitch
