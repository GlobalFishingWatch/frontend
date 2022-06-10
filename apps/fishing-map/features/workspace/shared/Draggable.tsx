import { useState, useCallback, useMemo, useEffect } from 'react'

const INITIAL_POSITION = { x: 0, y: 0 }
export const DRAGGABLE_ITEM_ID = 'drag'

function Draggable({ children, id, onDrag, onDragEnd }): React.ReactElement {
  const [isDragging, setIsDragging] = useState(false)
  const [origin, setOrigin] = useState(INITIAL_POSITION)
  const [translation, setTranslation] = useState(INITIAL_POSITION)

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      const translation = { x: clientX - origin.x, y: clientY - origin.y }
      setTranslation(translation)
      onDrag({ translation, id })
    },
    [id, onDrag, origin.x, origin.y]
  )

  const handleMouseUp = useCallback(() => {
    onDragEnd()
    setIsDragging(false)
    window.onmousemove = undefined
    window.onmouseup = undefined
    setTranslation(INITIAL_POSITION)
  }, [onDragEnd])

  const handleMouseDown = useCallback(
    ({ target, clientX, clientY }) => {
      if (target.id === DRAGGABLE_ITEM_ID) {
        window.onmousemove = handleMouseMove
        window.onmouseup = handleMouseUp
        setIsDragging(true)
        setOrigin({ x: clientX, y: clientY })
      }
    },
    [handleMouseMove, handleMouseUp]
  )

  useEffect(() => {
    if (isDragging) {
      window.onmousemove = handleMouseMove
      window.onmouseup = handleMouseUp
    } else {
      setTranslation(INITIAL_POSITION)
    }
  }, [handleMouseMove, handleMouseUp, isDragging, translation])

  useEffect(() => {}, [translation])

  const styles = useMemo(
    () => ({
      transform: `translate(${translation.x}px, ${translation.y}px)`,
      transition: isDragging ? 'none' : 'transform 500ms',
      zIndex: isDragging ? 2 : 1,
      INITIAL_position: isDragging ? 'absolute' : 'relative',
    }),
    [isDragging, translation.x, translation.y]
  )

  return (
    <div style={styles} onMouseDown={handleMouseDown}>
      {children}
    </div>
  )
}

export default Draggable
