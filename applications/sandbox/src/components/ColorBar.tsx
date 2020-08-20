import React, { useState } from 'react'
import ColorBar, { ColorBarOptions } from '@globalfishingwatch/ui-components/src/color-bar'

const ColorBarSection = () => {
  const [selectedColor, setSelectedColor] = useState<ColorBarOptions | undefined>()
  return (
    <ColorBar
      onColorClick={(color) => setSelectedColor(color)}
      selectedColor={selectedColor}
      disabledColors={['#F95E5E', '#21D375']}
    />
  )
}

export default ColorBarSection
