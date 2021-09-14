import React, { useMemo } from 'react'
import { Editor, EditingMode, DrawPolygonMode } from 'react-map-gl-draw'
import { useSelector } from 'react-redux'
import { selectDrawMode } from './map.slice'

function MapDraw() {
  const mode = useSelector(selectDrawMode)

  const editorMode = useMemo(() => {
    if (mode === 'disabled') {
      return
    }
    return mode === 'edit' ? new EditingMode() : new DrawPolygonMode()
  }, [mode])

  if (!editorMode) {
    return null
  }

  return <Editor clickRadius={12} mode={editorMode} />
}

export default MapDraw
