import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import { LevelsSlider } from './LevelsSlider'
import type { LevelsValues, RawImageData } from './TaskImage.utils'
import {
  applyLevelsToCanvas,
  computeAutoLevels,
  decodeOriginalToRaw,
  drawHistogram,
} from './TaskImage.utils'

import styles from './TaskImage.module.css'

type TaskImageProps = {
  thumbnail: string
  scale?: number
  open: boolean
}

const SCALE_LINE_WIDTH_PERCENTAGE = 10

export function TaskImage({ thumbnail, scale, open }: TaskImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const histCanvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>(undefined)
  const [levels, setLevels] = useState<LevelsValues>([0, 128, 255])
  const [levelsKey, setLevelsKey] = useState(0)
  const levelsRef = useRef<LevelsValues>([0, 128, 255])
  const rawOriginal = useRef<RawImageData | null>(null)

  const applyLevelsToAll = useCallback((v: LevelsValues) => {
    if (rawOriginal.current && canvasRef.current)
      applyLevelsToCanvas(rawOriginal.current, canvasRef.current, v)
  }, [])

  useEffect(() => {
    levelsRef.current = levels
    applyLevelsToAll(levels)
  }, [levels, applyLevelsToAll])

  useEffect(() => {
    rawOriginal.current = null

    const src = `data:${thumbnail}`
    const img = new Image()
    const draw = async () => {
      const { width, height } = img
      if (canvasRef.current) {
        canvasRef.current.width = width
        canvasRef.current.height = height
        rawOriginal.current = await decodeOriginalToRaw(src, img)
      }

      if (rawOriginal.current) {
        const auto = computeAutoLevels(rawOriginal.current)
        levelsRef.current = auto
        applyLevelsToAll(auto)
        setLevels(auto)
        setLevelsKey((k) => k + 1)
        if (histCanvasRef.current) drawHistogram(histCanvasRef.current, rawOriginal.current.data)
      }
      setCanvasWidth(width)
    }
    img.addEventListener('load', draw)
    img.src = src
    return () => img.removeEventListener('load', draw)
  }, [thumbnail, applyLevelsToAll])

  return (
    <div className={styles.imageWrapper}>
      <div className={styles.imgContainer}>
        <canvas className={styles.img} ref={canvasRef} />
        {open && scale !== undefined && canvasWidth !== undefined && (
          <Fragment>
            <span className={styles.scaleValue}>
              {(scale * canvasWidth) / (100 / SCALE_LINE_WIDTH_PERCENTAGE)} m
            </span>
            <div
              className={styles.scaleLine}
              style={{ width: `${SCALE_LINE_WIDTH_PERCENTAGE}%` }}
            />
          </Fragment>
        )}
      </div>
      <canvas
        ref={histCanvasRef}
        className={styles.histogram}
        style={{ display: open ? 'block' : 'none' }}
      />
      {open && <LevelsSlider key={levelsKey} initialValues={levels} onChange={setLevels} />}
    </div>
  )
}

export default TaskImage
