const RESIZED_ATTRIBUTE = 'data-screenshot-resized'
const MIN_LABEL_SIZE_SCALE = 0.5
// px reserved around the scaled app for the editor header, footer and side padding
const STAGE_TOP = 64
const STAGE_BOTTOM = 96
const STAGE_SIDE = 32

/**
 * Lays the live app container out at the largest box of `ratio` (width / height, null = window
 * shape) that fits the window, then CSS-scales it to fit between the editor header and footer.
 * Nothing is remounted: the map keeps running and stays interactive while scaled.
 * Returns how much the container shrank vs the window, used to scale map labels in step.
 */
export const applyScreenshotLayout = (element: HTMLElement, ratio: number | null): number => {
  const { innerWidth: width, innerHeight: height } = window
  const baseWidth = ratio ? Math.min(width, height * ratio) : width
  const baseHeight = ratio ? baseWidth / ratio : height

  const stageWidth = width - STAGE_SIDE * 2
  const stageHeight = height - STAGE_TOP - STAGE_BOTTOM
  const scale = Math.min(stageWidth / baseWidth, stageHeight / baseHeight)

  Object.assign(element.style, {
    position: 'fixed',
    left: '50%',
    top: `${STAGE_TOP + stageHeight / 2}px`,
    width: `${baseWidth}px`,
    height: `${baseHeight}px`,
    flex: 'none',
    transform: `translate(-50%, -50%) scale(${scale})`,
    zIndex: '1000',
  })
  element.setAttribute(RESIZED_ATTRIBUTE, '')

  // area-based so a tall 9:16 crop of a wide screen, which keeps its full height, isn't
  // treated as shrinking by its width alone
  return Math.max(MIN_LABEL_SIZE_SCALE, Math.sqrt((baseWidth * baseHeight) / (width * height)))
}

export const resetScreenshotLayout = () => {
  document.querySelectorAll<HTMLElement>(`[${RESIZED_ATTRIBUTE}]`).forEach((element) => {
    ;['position', 'left', 'top', 'width', 'height', 'flex', 'transform', 'z-index'].forEach((p) =>
      element.style.removeProperty(p)
    )
    element.removeAttribute(RESIZED_ATTRIBUTE)
  })
}
