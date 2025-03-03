import React, { useState } from 'react'
import type { Color } from 'react-aria-components'
import { ColorSlider, ColorThumb, parseColor, SliderTrack } from 'react-aria-components'
import cx from 'classnames'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'

import { IconButton } from '../icon-button'

import type { ColorBarOption } from './color-bar-options'
import { FillColorBarOptions } from './color-bar-options'

import styles from './ColorBar.module.css'

interface ColorBarProps {
  onColorClick?: (color: ColorBarOption, e?: React.MouseEvent) => void
  selectedColor?: string
  disabledColors?: string[]
  colorBarOptions: ColorBarOption[]
  className?: string
  swatchesTooltip?: string
  hueBarTooltip?: string
}

export function ColorBar(props: ColorBarProps) {
  const {
    onColorClick,
    className = '',
    selectedColor,
    colorBarOptions = FillColorBarOptions,
    disabledColors = [],
    hueBarTooltip = '',
    swatchesTooltip = '',
  } = props
  const [currentValue, setCurrentValue] = useState<Color>(
    parseColor(selectedColor || '#ff0000')
      .toFormat('hsl')
      .withChannelValue('saturation', 100)
      .withChannelValue('lightness', 70)
  )
  const [colorMode, setColorMode] = useLocalStorage<'swatches' | 'hue-bar'>(
    'colorSelectionMode',
    'swatches'
  )

  const toggleColorMode = () => {
    setColorMode((prevColorMode) => (prevColorMode === 'hue-bar' ? 'swatches' : 'hue-bar'))
  }

  const handleHueBarSelection = (color: Color) => {
    onColorClick?.({
      id: color.toString('hex'),
      value: color.toString('hex'),
    })
  }

  return (
    <div className={styles.colorBarWrapper}>
      {colorMode === 'swatches' ? (
        <ul className={cx(styles.listContainer, className)}>
          {colorBarOptions.map((color) => {
            const disabledColor =
              disabledColors.includes(color.id) || disabledColors.includes(color.value)
            return (
              <li key={color.id} className={styles.colorContainer}>
                <button
                  className={cx(styles.color, {
                    [styles.colorActive]:
                      selectedColor === color.id || selectedColor === color.value,
                    [styles.colorDisabled]: disabledColor,
                  })}
                  style={{ backgroundColor: color.value }}
                  onClick={(e) => onColorClick && !disabledColor && onColorClick(color, e)}
                ></button>
              </li>
            )
          })}
        </ul>
      ) : (
        <ColorSlider
          channel="hue"
          value={currentValue}
          onChange={setCurrentValue}
          onChangeEnd={handleHueBarSelection}
          className={styles.hueBarWrapper}
        >
          <SliderTrack className={styles.hueBar}>
            <ColorThumb className={styles.colorThumb} />
          </SliderTrack>
        </ColorSlider>
      )}
      <IconButton
        icon={colorMode === 'hue-bar' ? 'color-picker-swatches' : 'color-picker-precise'}
        tooltip={colorMode === 'hue-bar' ? swatchesTooltip : hueBarTooltip}
        onClick={toggleColorMode}
        size="small"
      />
    </div>
  )
}
