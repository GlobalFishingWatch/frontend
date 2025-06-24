import { useTranslation } from 'react-i18next'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ColorBarOption, ThicknessSelectorOption } from '@globalfishingwatch/ui-components'
import {
  ColorBar,
  FillColorBarOptions,
  IconButton,
  LineColorBarOptions,
  ThicknessSelector,
} from '@globalfishingwatch/ui-components'

import ExpandedContainer from './ExpandedContainer'

export type LayerPropertiesOption = 'color' | 'thickness'

type LayerPropertiesProps = {
  open: boolean
  dataview: UrlDataviewInstance
  colorType?: 'fill' | 'line'
  onColorClick: (color: ColorBarOption) => void
  onThicknessClick?: (color: ThicknessSelectorOption) => void
  onToggleClick: (e: any) => void
  onClickOutside: () => void
  className?: string
  disabled?: boolean
  properties?: LayerPropertiesOption[]
}

export const POLYGON_PROPERTIES: LayerPropertiesOption[] = ['color', 'thickness']
export const POINT_PROPERTIES: LayerPropertiesOption[] = ['color']

const LayerProperties = (props: LayerPropertiesProps) => {
  const {
    open,
    colorType = 'line',
    dataview,
    onToggleClick,
    onColorClick,
    onThicknessClick,
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
          {!isOnlyColor && <label>{t('layer.properties.color')}</label>}
          <ColorBar
            colorBarOptions={colorType === 'line' ? LineColorBarOptions : FillColorBarOptions}
            selectedColor={dataview.config?.color}
            onColorClick={onColorClick}
            swatchesTooltip={t('layer.colorSelectPredefined')}
            hueBarTooltip={t('layer.colorSelectCustom')}
          />
          {properties.includes('thickness') && (
            <div>
              <label>{t('layer.properties.thickness')}</label>
              <ThicknessSelector
                selectedThickness={dataview.config?.thickness}
                onThicknessClick={onThicknessClick}
              />
            </div>
          )}
        </div>
      }
    >
      <IconButton
        icon={open ? 'color-picker' : 'color-picker-filled'}
        size="small"
        style={open || disabled ? {} : { color: dataview.config?.color }}
        tooltip={isOnlyColor ? t('layer.color_change') : t('layer.propertiesChange')}
        tooltipPlacement="top"
        onClick={onToggleClick}
        className={className}
        disabled={disabled}
      />
    </ExpandedContainer>
  )
}

export default LayerProperties
