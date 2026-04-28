import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import { LevelsSlider } from './LevelsSlider'
import type { DataRange, LevelsValues, NormMode, RawImageData } from './TaskImage.utils'
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
  rangeMode?: 'compressed' | 'full'
  normMode?: NormMode
  showCrosshair?: boolean
}

const SCALE_LINE_WIDTH_PERCENTAGE = 10

export function TaskImage({
  thumbnail,
  scale,
  open,
  rangeMode = 'compressed',
  normMode = 'global',
  showCrosshair = false,
}: TaskImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const histCanvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>(undefined)
  const [levels, setLevels] = useState<LevelsValues>([0, 128, 255])
  const [dataRange, setDataRange] = useState<DataRange>([0, 255])
  const [levelsKey, setLevelsKey] = useState(0)
  const levelsRef = useRef<LevelsValues>([0, 128, 255])
  const autoLevelsRef = useRef<LevelsValues>([0, 128, 255])
  const rangeModeRef = useRef(rangeMode)
  const rawOriginal = useRef<RawImageData | null>(null)

  const applyLevelsToAll = useCallback((v: LevelsValues) => {
    if (rawOriginal.current && canvasRef.current)
      applyLevelsToCanvas(rawOriginal.current, canvasRef.current, v)
  }, [])

  rangeModeRef.current = rangeMode
  const displayRange: DataRange = rangeMode === 'full' ? [0, 255] : dataRange

  useEffect(() => {
    levelsRef.current = levels
    applyLevelsToAll(levels)
  }, [levels, applyLevelsToAll])

  useEffect(() => {
    if (histCanvasRef.current && rawOriginal.current)
      drawHistogram(histCanvasRef.current, rawOriginal.current.data, displayRange, normMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeMode, dataRange, normMode])

  useEffect(() => {
    const next = rangeMode === 'full' ? ([0, 128, 255] as LevelsValues) : autoLevelsRef.current
    levelsRef.current = next
    applyLevelsToAll(next)
    setLevels(next)
    setLevelsKey((k) => k + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeMode])

  useEffect(() => {
    rawOriginal.current = null

    const src = `data:${thumbnail}`
    const img = new Image()
    const draw = async () => {
      const { width, height } = img
      if (canvasRef.current) {
        canvasRef.current.width = width
        canvasRef.current.height = height
        rawOriginal.current = await decodeOriginalToRaw(src, img, normMode)
      }

      if (rawOriginal.current) {
        const { levels: auto, range } = computeAutoLevels(rawOriginal.current)
        autoLevelsRef.current = auto
        const effectiveLevels = rangeModeRef.current === 'full' ? ([0, 128, 255] as LevelsValues) : auto
        const effectiveRange: DataRange = rangeModeRef.current === 'full' ? [0, 255] : range
        levelsRef.current = effectiveLevels
        applyLevelsToAll(effectiveLevels)
        setLevels(effectiveLevels)
        setDataRange(range)
        setLevelsKey((k) => k + 1)
        if (histCanvasRef.current)
          drawHistogram(histCanvasRef.current, rawOriginal.current.data, effectiveRange, normMode)
      }
      setCanvasWidth(width)
    }
    img.addEventListener('load', draw)
    img.src = src
    return () => img.removeEventListener('load', draw)
  }, [thumbnail, normMode, applyLevelsToAll])

  return (
    <div className={styles.imageWrapper}>
      <div className={styles.imgContainer}>
        <canvas className={styles.img} ref={canvasRef} />
        {showCrosshair && (
          <svg className={styles.crosshair} viewBox="0 0 100 100" preserveAspectRatio="none">
            <line
              x1="0"
              y1="50"
              x2="45"
              y2="50"
              stroke="red"
              strokeWidth="0.7"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="55"
              y1="50"
              x2="100"
              y2="50"
              stroke="red"
              strokeWidth="0.7"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="45"
              stroke="red"
              strokeWidth="0.7"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="50"
              y1="55"
              x2="50"
              y2="100"
              stroke="red"
              strokeWidth="0.7"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
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
      {open && (
        <LevelsSlider
          key={levelsKey}
          initialValues={levels}
          onChange={setLevels}
          min={displayRange[0]}
          max={displayRange[1]}
        />
      )}
    </div>
  )
}

export default TaskImage
