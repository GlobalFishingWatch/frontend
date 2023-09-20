import { useTranslation } from 'react-i18next'
import { Switch } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDataviewInstancesConnect } from '../workspace.hook'

type LayerSwitchProps = {
  active: boolean
  dataview: UrlDataviewInstance
  className: string
  disabled?: boolean
  onToggle?: (active: boolean) => void
  color?: string
  testId?: string
}

const LayerSwitch = ({
  active,
  dataview,
  className,
  disabled,
  onToggle,
  color,
  testId,
}: LayerSwitchProps) => {
  const { t } = useTranslation()
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
      tooltip={disabled ? '' : t('layer.toggleVisibility', 'Toggle layer visibility')}
      tooltipPlacement="top"
      className={className}
      testId={testId}
      color={color || dataview.config?.color}
    />
  )
}

export default LayerSwitch
