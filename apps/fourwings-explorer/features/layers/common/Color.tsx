import { useTranslation } from 'react-i18next'
import {
  IconButton,
  ColorBar,
  ColorBarOption,
  FillColorBarOptions,
  LineColorBarOptions,
} from '@globalfishingwatch/ui-components'
import { DatasetLayer } from 'features/layers/layers.hooks'
import ExpandedContainer from './ExpandedContainer'

type ColorProps = {
  open: boolean
  layer: DatasetLayer
  colorType?: 'fill' | 'line'
  onColorClick: (color: ColorBarOption) => void
  onToggleClick: (e: any) => void
  onClickOutside: () => void
  className?: string
  disabled?: boolean
}

const Color = (props: ColorProps) => {
  const {
    open,
    colorType = 'line',
    layer,
    onToggleClick,
    onColorClick,
    onClickOutside,
    className,
    disabled,
  } = props
  const { t } = useTranslation()
  const color = layer.config?.color
  return (
    <ExpandedContainer
      visible={open && !disabled}
      onClickOutside={onClickOutside}
      component={
        <ColorBar
          colorBarOptions={colorType === 'line' ? LineColorBarOptions : FillColorBarOptions}
          selectedColor={color}
          onColorClick={onColorClick}
        />
      }
    >
      <IconButton
        icon={open ? 'color-picker' : 'color-picker-filled'}
        size="small"
        style={open || disabled ? {} : { color }}
        tooltip={t('layer.color_change', 'Change color')}
        tooltipPlacement="top"
        onClick={onToggleClick}
        className={className}
        disabled={disabled}
      />
    </ExpandedContainer>
  )
}

export default Color
