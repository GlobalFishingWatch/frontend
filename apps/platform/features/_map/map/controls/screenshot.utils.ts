const RESIZED_ATTRIBUTE = 'data-screenshot-resized'
const MIN_LABEL_SIZE_SCALE = 0.5

/**
 * Shrinks the element to the largest box with the given aspect ratio (width / height) that fits
 * inside its current size, so deck re-renders the map at that shape instead of the capture being
 * cropped. Returns how much the element shrank, used to scale map labels in step with the map.
 */
export const applyAspectRatio = (element: HTMLElement, ratio: number): number => {
  const { width, height } = element.getBoundingClientRect()
  if (!width || !height) return 1

  const fitWidth = Math.min(width, height * ratio)
  const fitHeight = fitWidth / ratio
  element.style.width = `${fitWidth}px`
  element.style.height = `${fitHeight}px`
  element.style.flex = 'none'
  element.style.margin = 'auto'
  element.setAttribute(RESIZED_ATTRIBUTE, '')

  // area-based so a tall 9:16 crop of a wide screen, which keeps its full height, isn't
  // treated as shrinking by its width alone
  return Math.max(MIN_LABEL_SIZE_SCALE, Math.sqrt((fitWidth * fitHeight) / (width * height)))
}

export const resetAspectRatio = () => {
  document.querySelectorAll<HTMLElement>(`[${RESIZED_ATTRIBUTE}]`).forEach((element) => {
    element.style.removeProperty('width')
    element.style.removeProperty('height')
    element.style.removeProperty('flex')
    element.style.removeProperty('margin')
    element.removeAttribute(RESIZED_ATTRIBUTE)
  })
}
