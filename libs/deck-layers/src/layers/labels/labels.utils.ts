export type LabelBox = {
  x: number
  y: number
  w: number
  h: number
}

/** Roboto average  width */
export const CHAR_WIDTH_RATIO = 0.5
export const LINE_HEIGHT_RATIO = 1.2
const DEFAULT_GAP = 15

const PLACEMENTS = ['above', 'below', 'right', 'left'] as const

function placementOffset(
  placement: (typeof PLACEMENTS)[number],
  box: LabelBox,
  base: [number, number]
): [number, number] {
  const gap = Math.abs(base[1]) || DEFAULT_GAP
  switch (placement) {
    case 'above':
      return [base[0], -gap]
    case 'below':
      return [base[0], gap]
    case 'right':
      return [gap + box.w / 2, 0]
    case 'left':
      return [-(gap + box.w / 2), 0]
  }
}

function overlapArea(
  ax: number,
  ay: number,
  a: LabelBox,
  bx: number,
  by: number,
  b: LabelBox,
  padding: number
): number {
  const w = (a.w + b.w) / 2 + padding - Math.abs(ax - bx)
  if (w <= 0) return 0
  const h = (a.h + b.h) / 2 + padding - Math.abs(ay - by)
  return h <= 0 ? 0 : w * h
}

export function resolveLabelOverlap(
  boxes: LabelBox[],
  baseOffsets: [number, number][],
  padding = 2
): [number, number][] {
  const offsets: [number, number][] = []
  const placed: [number, number, number][] = []
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i]
    if (box.w <= 0) {
      offsets.push(baseOffsets[i])
      continue
    }
    let best: [number, number] = baseOffsets[i]
    let bestArea = Infinity
    for (const placement of PLACEMENTS) {
      const offset = placementOffset(placement, box, baseOffsets[i])
      const x = box.x + offset[0]
      const y = box.y + offset[1]
      let area = 0
      for (const [px, py, pi] of placed) {
        area += overlapArea(x, y, box, px, py, boxes[pi], padding)
      }
      if (area < bestArea) {
        bestArea = area
        best = offset
      }
      if (area === 0) break
    }
    offsets.push(best)
    placed.push([box.x + best[0], box.y + best[1], i])
  }
  return offsets
}
