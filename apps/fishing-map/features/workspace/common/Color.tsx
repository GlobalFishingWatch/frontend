import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconButton,
  ColorBar,
  ColorBarOption,
  FillColorBarOptions,
  LineColorBarOptions,
} from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import ExpandedContainer from '../shared/ExpandedContainer'

type ColorProps = {
  open: boolean
  dataview: UrlDataviewInstance
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
    dataview,
    onToggleClick,
    onColorClick,
    onClickOutside,
    className,
    disabled,
  } = props
  const { t } = useTranslation()
  return (
    <ExpandedContainer
      visible={open && !disabled}
      onClickOutside={onClickOutside}
      component={
        <ColorBar
          colorBarOptions={colorType === 'line' ? LineColorBarOptions : FillColorBarOptions}
          selectedColor={dataview.config?.color}
          onColorClick={onColorClick}
        />
      }
    >
      <IconButton
        icon={open ? 'color-picker' : 'color-picker-filled'}
        size="small"
        style={open || disabled ? {} : { color: dataview.config?.color }}
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
