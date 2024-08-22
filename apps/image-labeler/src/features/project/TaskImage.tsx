import { Fragment, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import styles from './TaskImage.module.css'

type TaskImageProps = {
  thumbnail: string
  scale?: number
  open: boolean
  imageStyle?: React.CSSProperties
}

const SCALE_LINE_WIDTH_PERCENTAGE = 10

const rgb2luma = ({ r, g, b }: { r: number; g: number; b: number }) => {
  return Math.round(r * 0.299 + g * 0.587 + b * 0.114)
}

const drawEnhancedImageToCanvas = ({
  img,
  thold,
  canvas,
}: {
  img: HTMLImageElement
  thold: number
  canvas?: HTMLCanvasElement | null
}) => {
  if (!canvas) return
  // set canvas size based on image
  canvas.width = img.width
  canvas.height = img.height

  // draw in image to canvas
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return
  ctx.drawImage(img, 0, 0)

  const { width, height } = img
  let min
  let max // to find min-max

  // get image data
  const idata = ctx.getImageData(0, 0, width, height) // needed for later
  const data = idata.data // the bitmap itself
  const hgram = new Uint32Array(data.length / 4) // histogram buffer (or use Float32)

  // get lumas and build histogram
  for (let i = 0; i < data.length; i += 4) {
    var luma = rgb2luma({ r: data[i], g: data[i + 1], b: data[i + 2] })
    hgram[luma]++ // add to the luma bar (and why we need an integer)
  }

  // find min value
  for (let i = 0; i < width * 0.5; i++) {
    if (hgram[i] > thold) {
      min = i
      break
    }
  }
  if (!min) min = 0 // if not found, set to default 0

  // find max value
  for (let i = width - 1; i > width * 0.5; i--) {
    if (hgram[i] > thold) {
      max = i
      break
    }
  }
  if (!max) max = 255 // if not found, set to default 255

  const scale = 255 / ((max - min) * 2)
  // scale all pixels RGB values
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, data[i] - min) * scale
    data[i + 1] = Math.max(0, data[i + 1] - min) * scale
    data[i + 2] = Math.max(0, data[i + 2] - min) * scale
  }
  ctx.putImageData(idata, 0, 0)
}

export function TaskImage({ thumbnail, scale, open, imageStyle }: TaskImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [enhancedImageVisible, setEnhancedImageVisible] = useState(true)

  useEffect(() => {
    const draw = () => {
      drawEnhancedImageToCanvas({ img, thold: 1, canvas: canvasRef.current })
    }
    const img = new Image()
    img.addEventListener('load', draw)
    img.src = `data:${thumbnail}`
    return () => {
      img.removeEventListener('load', draw)
    }
  }, [thumbnail])

  return (
    <div
      className={cx(styles.imgContainer, { [styles.disabled]: !enhancedImageVisible })}
      onMouseDown={() => {
        setEnhancedImageVisible(false)
      }}
      onMouseUp={() => {
        setEnhancedImageVisible(true)
      }}
    >
      <img className={styles.img} src={`data:${thumbnail}`} alt="original thumbnail" />
      <canvas
        className={styles.img}
        ref={canvasRef}
        style={{ visibility: enhancedImageVisible ? 'visible' : 'hidden', ...imageStyle }}
        title="Press and hold to see original image"
      />
      {open && scale !== undefined && canvasRef.current?.width !== undefined && (
        <Fragment>
          <span className={styles.scaleValue}>
            {(scale * canvasRef.current?.width) /
              (canvasRef.current?.width / SCALE_LINE_WIDTH_PERCENTAGE)}{' '}
            m
          </span>
          <div className={styles.scaleLine} style={{ width: `${SCALE_LINE_WIDTH_PERCENTAGE}%` }} />
        </Fragment>
      )}
    </div>
  )
}

export default TaskImage
