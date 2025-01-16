import { Fragment, useEffect, useRef } from 'react'
import cx from 'classnames'
import { Jimp } from 'jimp'

import { useLocalStorage } from '@globalfishingwatch/react-hooks/use-local-storage'

import styles from './TaskImage.module.css'

type TaskImageProps = {
  thumbnail: string
  scale?: number
  open: boolean
  imageStyle?: React.CSSProperties
}

const SCALE_LINE_WIDTH_PERCENTAGE = 10

const drawEnhancedImageToCanvas = async ({
  img,
  canvas,
  src,
}: {
  img: HTMLImageElement
  canvas?: HTMLCanvasElement | null
  src: string
}) => {
  if (!canvas) return
  // set canvas size based on image
  canvas.width = img.width
  canvas.height = img.height

  // draw in image to canvas
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return
  ctx.drawImage(img, 0, 0)

  const image = await Jimp.read(src)
  image.normalize()
  const imageData = new ImageData(
    new Uint8ClampedArray(image.bitmap.data),
    image.bitmap.width,
    image.bitmap.height
  )
  ctx.putImageData(imageData, 0, 0)
}

export function TaskImage({ thumbnail, scale, open, imageStyle }: TaskImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showEnhancedImage] = useLocalStorage('showEnhancedImage', true)

  useEffect(() => {
    const draw = () => {
      drawEnhancedImageToCanvas({
        img,
        canvas: canvasRef.current,
        src: `data:${thumbnail}`,
      })
    }
    const img = new Image()
    img.addEventListener('load', draw)
    img.src = `data:${thumbnail}`
    return () => {
      img.removeEventListener('load', draw)
    }
  }, [thumbnail])

  return (
    <div className={cx(styles.imgContainer)}>
      <img
        className={styles.img}
        src={`data:${thumbnail}`}
        alt="original thumbnail"
        style={imageStyle}
      />
      <canvas
        className={styles.img}
        ref={canvasRef}
        style={{ visibility: showEnhancedImage ? 'visible' : 'hidden' }}
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
