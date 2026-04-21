import { Jimp } from 'jimp'
import * as UPNG from 'upng-js'

export const HIST_W = 256
export const HIST_H = 40

export type RawImageData = { data: Uint8ClampedArray; width: number; height: number }
export type LevelsValues = [number, number, number]

export const decodeEnhancedToRaw = async (src: string): Promise<RawImageData | null> => {
  try {
    const image = await Jimp.read(src)
    image.normalize()
    return {
      data: new Uint8ClampedArray(image.bitmap.data),
      width: image.bitmap.width,
      height: image.bitmap.height,
    }
  } catch {
    return null
  }
}

export const decodeOriginalToRaw = async (
  src: string,
  img: HTMLImageElement
): Promise<RawImageData | null> => {
  const { width, height } = img
  const base64 = src.split(',')[1]
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i)

  const bitDepth = bytes[24]

  if (bitDepth === 16) {
    try {
      const png = UPNG.decode(bytes.buffer)
      const { width, height, ctype } = png
      const data = new Uint8ClampedArray(width * height * 4)
      const pngData = png.data as any
      const view = pngData.buffer
        ? new DataView(pngData.buffer, pngData.byteOffset, pngData.byteLength)
        : new DataView(pngData)
      const numChannels = ctype === 0 ? 1 : ctype === 2 ? 3 : ctype === 4 ? 2 : ctype === 6 ? 4 : 1

      let minVal = 65535,
        maxVal = 0
      for (let i = 0; i < width * height; i++) {
        const off = i * numChannels * 2
        if (ctype === 0 || ctype === 4) {
          const v = view.getUint16(off, false)
          if (v < minVal) minVal = v
          if (v > maxVal) maxVal = v
        } else if (ctype === 2 || ctype === 6) {
          minVal = Math.min(
            minVal,
            view.getUint16(off, false),
            view.getUint16(off + 2, false),
            view.getUint16(off + 4, false)
          )
          maxVal = Math.max(
            maxVal,
            view.getUint16(off, false),
            view.getUint16(off + 2, false),
            view.getUint16(off + 4, false)
          )
        }
      }

      let sMin = minVal,
        sMax = maxVal
      if (maxVal - minVal < 0.1 * 65535) {
        const c = (minVal + maxVal) / 2
        sMin = c - 0.05 * 65535
        sMax = c + 0.05 * 65535
      }
      const sRange = sMax - sMin || 1

      for (let i = 0; i < width * height; i++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 255
        const off = i * numChannels * 2
        if (ctype === 0 || ctype === 4) {
          const v = view.getUint16(off, false)
          r = g = b = Math.min(255, Math.max(0, ((v - sMin) / sRange) * 255))
          if (ctype === 4) a = view.getUint16(off + 2, false) / 256
        } else if (ctype === 2 || ctype === 6) {
          r = Math.min(255, Math.max(0, ((view.getUint16(off, false) - sMin) / sRange) * 255))
          g = Math.min(255, Math.max(0, ((view.getUint16(off + 2, false) - sMin) / sRange) * 255))
          b = Math.min(255, Math.max(0, ((view.getUint16(off + 4, false) - sMin) / sRange) * 255))
          if (ctype === 6) a = view.getUint16(off + 6, false) / 256
        }
        data[i * 4] = r
        data[i * 4 + 1] = g
        data[i * 4 + 2] = b
        data[i * 4 + 3] = a
      }
      return { data, width, height }
    } catch (e) {
      console.error('Error decoding 16-bit PNG:', e)
    }
  }

  const tmp = document.createElement('canvas')
  tmp.width = width
  tmp.height = height
  const ctx = tmp.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(img, 0, 0)
  const d = ctx.getImageData(0, 0, width, height)
  return { data: new Uint8ClampedArray(d.data), width, height }
}

const applyLevelToChannel = (
  val: number,
  black: number,
  white: number,
  midNorm: number
): number => {
  if (val <= black) return 0
  if (val >= white) return 255
  const n = (val - black) / (white - black)
  const gamma = Math.log(0.5) / Math.log(Math.max(0.001, Math.min(0.999, midNorm)))
  return Math.min(255, Math.max(0, Math.pow(n, gamma) * 255))
}

export const applyLevelsToCanvas = (
  raw: RawImageData,
  canvas: HTMLCanvasElement,
  [black, midtone, white]: LevelsValues
) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const midNorm = white === black ? 0.5 : (midtone - black) / (white - black)
  const out = new Uint8ClampedArray(raw.data.length)
  for (let i = 0; i < raw.data.length; i += 4) {
    out[i] = applyLevelToChannel(raw.data[i], black, white, midNorm)
    out[i + 1] = applyLevelToChannel(raw.data[i + 1], black, white, midNorm)
    out[i + 2] = applyLevelToChannel(raw.data[i + 2], black, white, midNorm)
    out[i + 3] = raw.data[i + 3]
  }
  ctx.putImageData(new ImageData(out, raw.width, raw.height), 0, 0)
}

export const computeAutoLevels = (raw: RawImageData): LevelsValues => {
  const bins = new Int32Array(256)
  const pixelCount = raw.data.length / 4
  for (let i = 0; i < raw.data.length; i += 4) {
    bins[Math.round((raw.data[i] + raw.data[i + 1] + raw.data[i + 2]) / 3)]++
  }

  const lo = pixelCount * 0.003
  const hi = pixelCount * 0.997
  let cumul = 0
  let minVal = 0,
    maxVal = 255
  for (let x = 0; x < 256; x++) {
    cumul += bins[x]
    if (cumul < lo) minVal = x
    if (cumul < hi) maxVal = x
  }
  return [minVal, Math.round(minVal + (maxVal - minVal) / 3), maxVal]
}

export const drawHistogram = (canvas: HTMLCanvasElement, data: Uint8ClampedArray) => {
  const dpr = window.devicePixelRatio || 1
  canvas.width = HIST_W * dpr
  canvas.height = HIST_H * dpr
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.scale(dpr, dpr)

  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.fillRect(0, 0, HIST_W, HIST_H)

  const bins = new Float32Array(256)
  for (let i = 0; i < data.length; i += 4) {
    bins[Math.round((data[i] + data[i + 1] + data[i + 2]) / 3)]++
  }
  const maxBin = Math.max(...bins) || 1
  ctx.fillStyle = 'rgb(215, 215, 215)'
  for (let x = 0; x < 256; x++) {
    const h = (Math.log1p(bins[x]) / Math.log1p(maxBin)) * HIST_H
    ctx.fillRect(x, HIST_H - h, 1, h)
  }
}
