import { Jimp } from 'jimp'
import * as UPNG from 'upng-js'

export const HIST_W = 256
export const HIST_H = 40

export type RawImageData = { data: Uint8ClampedArray; width: number; height: number }
export type LevelsValues = [number, number, number]
export type DataRange = [number, number]
export type AutoLevelsResult = { levels: LevelsValues; range: DataRange }

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

export type NormMode = 'global' | 'per-channel'

export const decodeOriginalToRaw = async (
  src: string,
  img: HTMLImageElement,
  normMode: NormMode = 'global'
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

      let minR = 65535,
        maxR = 0,
        minG = 65535,
        maxG = 0,
        minB = 65535,
        maxB = 0
      for (let i = 0; i < width * height; i++) {
        const off = i * numChannels * 2
        if (ctype === 0 || ctype === 4) {
          const v = view.getUint16(off, false)
          if (v < minR) minR = v
          if (v > maxR) maxR = v
        } else if (ctype === 2 || ctype === 6) {
          const rv = view.getUint16(off, false)
          const gv = view.getUint16(off + 2, false)
          const bv = view.getUint16(off + 4, false)
          if (rv < minR) minR = rv
          if (rv > maxR) maxR = rv
          if (gv < minG) minG = gv
          if (gv > maxG) maxG = gv
          if (bv < minB) minB = bv
          if (bv > maxB) maxB = bv
        }
      }

      const isGray = ctype === 0 || ctype === 4
      const gMin = normMode === 'per-channel' ? minR : Math.min(minR, minG, minB)
      const gMax = normMode === 'per-channel' ? maxR : Math.max(maxR, maxG, maxB)
      const rRange = (normMode === 'per-channel' && !isGray ? maxR - minR : gMax - gMin) || 1
      const gRange = (normMode === 'per-channel' && !isGray ? maxG - minG : gMax - gMin) || 1
      const bRange = (normMode === 'per-channel' && !isGray ? maxB - minB : gMax - gMin) || 1
      const rMin = normMode === 'per-channel' && !isGray ? minR : gMin
      const gMin2 = normMode === 'per-channel' && !isGray ? minG : gMin
      const bMin = normMode === 'per-channel' && !isGray ? minB : gMin

      for (let i = 0; i < width * height; i++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 255
        const off = i * numChannels * 2
        if (ctype === 0 || ctype === 4) {
          const v = view.getUint16(off, false)
          if (v === 0) {
            a = 0
          } else {
            r = g = b = ((v - gMin) / (gMax - gMin || 1)) * 255
            if (ctype === 4) a = view.getUint16(off + 2, false) / 256
          }
        } else if (ctype === 2 || ctype === 6) {
          const rv = view.getUint16(off, false)
          const gv = view.getUint16(off + 2, false)
          const bv = view.getUint16(off + 4, false)
          if (rv === 0 && gv === 0 && bv === 0) {
            a = 0
          } else {
            r = ((rv - rMin) / rRange) * 255
            g = ((gv - gMin2) / gRange) * 255
            b = ((bv - bMin) / bRange) * 255
            if (ctype === 6) a = view.getUint16(off + 6, false) / 256
          }
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
  const out = new Uint8ClampedArray(d.data)
  for (let i = 0; i < out.length; i += 4)
    if (out[i] === 0 && out[i + 1] === 0 && out[i + 2] === 0) out[i + 3] = 0
  return { data: out, width, height }
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

export const computeAutoLevels = (raw: RawImageData): AutoLevelsResult => {
  const bins = new Int32Array(256)
  const pixelCount = raw.data.length / 4
  for (let i = 0; i < raw.data.length; i += 4)
    bins[Math.round((raw.data[i] + raw.data[i + 1] + raw.data[i + 2]) / 3)]++

  let dataMin = 1,
    dataMax = 255
  for (let x = 1; x < 256; x++) {
    if (bins[x] > 0) {
      dataMin = x
      break
    }
  }
  for (let x = 255; x >= 1; x--) {
    if (bins[x] > 0) {
      dataMax = x
      break
    }
  }

  const nonBlackCount = pixelCount - bins[0]
  const lo = nonBlackCount * 0.0001
  const hi = nonBlackCount * 0.9999
  let cumul = 0,
    minVal = dataMin,
    maxVal = dataMax
  for (let x = dataMin; x <= dataMax; x++) {
    cumul += bins[x]
    if (cumul < lo) minVal = x
    if (cumul < hi) maxVal = x
  }
  return {
    levels: [minVal, Math.round(minVal + (maxVal - minVal) / 3), maxVal],
    range: [dataMin, dataMax],
  }
}

export const drawHistogram = (
  canvas: HTMLCanvasElement,
  data: Uint8ClampedArray,
  range: DataRange,
  normMode: NormMode = 'global'
) => {
  const dpr = window.devicePixelRatio || 1
  canvas.width = HIST_W * dpr
  canvas.height = HIST_H * dpr
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.scale(dpr, dpr)

  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.fillRect(0, 0, HIST_W, HIST_H)

  const [rangeMin, rangeMax] = range
  const span = rangeMax - rangeMin || 1
  const barW = HIST_W / span

  if (normMode === 'per-channel') {
    const rBins = new Float32Array(256)
    const gBins = new Float32Array(256)
    const bBins = new Float32Array(256)
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue
      rBins[data[i]]++
      gBins[data[i + 1]]++
      bBins[data[i + 2]]++
    }
    const maxBin = Math.max(Math.max(...rBins), Math.max(...gBins), Math.max(...bBins)) || 1
    const channels = [
      { bins: rBins, color: 'rgba(255,0,0, 0.8)' },
      { bins: gBins, color: 'rgba(0,255,0, 0.8)' },
      { bins: bBins, color: 'rgba(0,0,255, 0.8)' },
    ]
    ctx.globalCompositeOperation = 'screen'
    for (const { bins, color } of channels) {
      ctx.fillStyle = color
      for (let x = rangeMin; x <= rangeMax; x++) {
        const h = (Math.log1p(bins[x]) / Math.log1p(maxBin)) * HIST_H
        ctx.fillRect((x - rangeMin) * barW, HIST_H - h, barW, h)
      }
    }
    ctx.globalCompositeOperation = 'source-over'
  } else {
    const bins = new Float32Array(256)
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue
      bins[Math.round((data[i] + data[i + 1] + data[i + 2]) / 3)]++
    }
    const maxBin = Math.max(...bins) || 1
    ctx.fillStyle = 'rgb(215, 215, 215)'
    for (let x = rangeMin; x <= rangeMax; x++) {
      const h = (Math.log1p(bins[x]) / Math.log1p(maxBin)) * HIST_H
      ctx.fillRect((x - rangeMin) * barW, HIST_H - h, barW, h)
    }
  }
}
