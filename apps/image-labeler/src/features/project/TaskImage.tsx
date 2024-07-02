import { useCallback, useEffect, useRef } from 'react'
import { scaleLinear } from 'd3-scale'
import styles from './Task.module.css'

type TaskImageProps = {
  thumbnail: string
}

const rgb2luma = (px: Uint8ClampedArray, pos: number) => {
  return px[pos] * 0.299 + px[pos + 1] * 0.587 + px[pos + 2] * 0.114
}

export function TaskImage({ thumbnail }: TaskImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawEnhancedImageToCanvas = useCallback(
    ({
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
      let min = -1
      let max = -1 // to find min-max
      let maxH = 0 // to find scale of histogram
      const hgram = new Uint32Array(width) // histogram buffer (or use Float32)

      // get image data
      const idata = ctx.getImageData(0, 0, width, height) // needed for later
      const data = idata.data // the bitmap itself

      // get lumas and build histogram
      for (let i = 0; i < data.length; i += 4) {
        var luma = Math.round(rgb2luma(data, i))
        hgram[luma]++ // add to the luma bar (and why we need an integer)
      }

      // find tallest bar so we can use that to scale threshold
      for (let i = 0; i < width; i++) {
        if (hgram[i] > maxH) maxH = hgram[i]
      }

      // use that for threshold
      thold *= maxH

      // find min value
      for (let i = 0; i < width * 0.5; i++) {
        if (hgram[i] > thold) {
          min = i
          break
        }
      }
      if (min < 0) min = 0 // if not found, set to default 0

      // find max value
      for (let i = width - 1; i > width * 0.5; i--) {
        if (hgram[i] > thold) {
          max = i
          break
        }
      }
      if (max < 0) max = 255 // if not found, set to default 255

      // TODO: change to d3 scale
      const scale = (255 / (max - min)) * 2
      const d3scale = scaleLinear([0, 255], [min, max])
      // console.log('Min: ' + min + ' Max: ' + max + ' Scale: ' + scale.toFixed(1) + 'x')

      // scale all pixels RGB values
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, data[i] - min) * scale
        data[i + 1] = Math.max(0, data[i + 1] - min) * scale
        data[i + 2] = Math.max(0, data[i + 2] - min) * scale
        // data[i] = d3scale(data[i] - min)
        // data[i + 1] = d3scale(data[i + 1] - min)
        // data[i + 2] = d3scale(data[i + 2] - min)
      }
      ctx.putImageData(idata, 0, 0)
    },
    []
  )

  useEffect(() => {
    const draw = () => {
      drawEnhancedImageToCanvas({ img, thold: 1, canvas: canvasRef.current })
    }
    const img = new Image()
    img.addEventListener('load', draw)
    // img.crossOrigin = 'Anonymous'
    img.src =
      'data:image/png;base64,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'
    // img.src = '//i.imgur.com/VtNwHbU.jpg'
    return () => {
      img.removeEventListener('load', draw)
    }
  }, [thumbnail, drawEnhancedImageToCanvas])

  return (
    // <div className={styles.img} style={{ backgroundImage: `url(${thumbnail})` }}>
    <canvas className={styles.img} ref={canvasRef} />
  )
}

export default TaskImage
