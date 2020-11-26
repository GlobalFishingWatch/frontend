import React, { useState } from 'react'
import ColorBar, {
  ColorBarOption,
  HeatmapColorBarOptions,
} from '@globalfishingwatch/ui-components/src/color-bar'

const ColorBarSection = () => {
  const [selectedColor, setSelectedColor] = useState<ColorBarOption>()
  return (
    <ColorBar
      colorBarOptions={HeatmapColorBarOptions}
      onColorClick={(color) => setSelectedColor(color)}
      selectedColor={selectedColor?.id}
    />
  )
}

export default ColorBarSection
