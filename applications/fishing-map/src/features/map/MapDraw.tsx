import React from 'react'
import { Editor, EditingMode, DrawPolygonMode } from 'react-map-gl-draw'

type MapDrawProps = {
  mode: 'edit' | 'draw'
}

function MapDraw({ mode }: MapDrawProps) {
  return (
    <Editor
      clickRadius={12}
      mode={mode === 'edit' ? EditingMode : DrawPolygonMode}
      onSelect={(select: any) => {
        console.log(select)
      }}
    />
  )
}

export default MapDraw
