import { useTranslation } from 'react-i18next'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import {
  ColorBar,
  FillColorBarOptions,
  IconButton,
  LineColorBarOptions,
} from '@globalfishingwatch/ui-components'

import ExpandedContainer from './ExpandedContainer'

type LayerPropertiesOption = 'color' | 'thickness'

type LayerPropertiesProps = {
  open: boolean
  dataview: UrlDataviewInstance
  colorType?: 'fill' | 'line'
  onColorClick: (color: ColorBarOption) => void
  onToggleClick: (e: any) => void
  onClickOutside: () => void
  className?: string
  disabled?: boolean
  properties?: LayerPropertiesOption[]
}

const LayerProperties = (props: LayerPropertiesProps) => {
  const {
    open,
    colorType = 'line',
    dataview,
    onToggleClick,
    onColorClick,
    onClickOutside,
    className,
    disabled,
    properties = ['color'],
  } = props
  const { t } = useTranslation()
  const isOnlyColor = properties.length === 1 && properties[0] === 'color'
  return (
    <ExpandedContainer
      visible={open && !disabled}
      onClickOutside={onClickOutside}
      component={
        <div>
          {!isOnlyColor && <label>{t('layer.color', 'Color')}</label>}
          <ColorBar
            colorBarOptions={colorType === 'line' ? LineColorBarOptions : FillColorBarOptions}
            selectedColor={dataview.config?.color}
            onColorClick={onColorClick}
          />
        </div>
      }
    >
      <IconButton
        icon={open ? 'color-picker' : 'color-picker-filled'}
        size="small"
        style={open || disabled ? {} : { color: dataview.config?.color }}
        tooltip={
          isOnlyColor
            ? t('layer.color_change', 'Change color')
            : t('layer.properties_change', 'Change properties')
        }
        tooltipPlacement="top"
        onClick={onToggleClick}
        className={className}
        disabled={disabled}
      />
    </ExpandedContainer>
  )
}

export default LayerProperties
