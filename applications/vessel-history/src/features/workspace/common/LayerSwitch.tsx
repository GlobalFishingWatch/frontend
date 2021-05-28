import { Switch } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

type LayerSwitchProps = {
  active: boolean
  dataview: UrlDataviewInstance
  className?: string
  disabled?: boolean
  onToggle?: (active: boolean) => void
}

const LayerSwitch = ({ active, dataview, className, disabled, onToggle }: LayerSwitchProps) => {
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
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
      className={className}
      color={dataview.config?.color}
    />
  )
}

export default LayerSwitch
