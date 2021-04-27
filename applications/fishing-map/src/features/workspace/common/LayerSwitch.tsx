import { useTranslation } from 'react-i18next'
import { Switch } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

type LayerSwitchProps = {
  active: boolean
  dataview: UrlDataviewInstance
  onClick: (e: any) => void
  className: string
  disabled?: boolean
}

const LayerSwitch = ({ active, dataview, onClick, className, disabled }: LayerSwitchProps) => {
  const { t } = useTranslation()
  return (
    <Switch
      disabled={disabled}
      active={active}
      onClick={onClick}
      tooltip={t('layer.toggleVisibility', 'Toggle layer visibility')}
      tooltipPlacement="top"
      className={className}
      color={dataview.config?.color}
    />
  )
}

export default LayerSwitch
