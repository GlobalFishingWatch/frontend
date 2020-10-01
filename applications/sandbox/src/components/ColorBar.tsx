import React, { useState } from 'react'
import ColorBar, { ColorBarOption } from '@globalfishingwatch/ui-components/src/color-bar'

const ColorBarSection = () => {
  const [selectedColor, setSelectedColor] = useState<ColorBarOption>()
  return (
    <ColorBar onColorClick={(color) => setSelectedColor(color)} selectedColor={selectedColor?.id} />
  )
}

export default ColorBarSection
