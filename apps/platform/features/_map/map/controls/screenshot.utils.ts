const RESIZED_ATTRIBUTE = 'data-screenshot-resized'
const MIN_LABEL_SIZE_SCALE = 0.5

const STAGE_TOP = 64
const STAGE_BOTTOM = 96
const STAGE_SIDE = 32

export type ElementSize = { width: number; height: number }

export const applyScreenshotLayout = (
  element: HTMLElement,
  ratio: number | null,
  initialSize?: ElementSize
): number => {
  const { innerWidth: width, innerHeight: height } = window
  const size = initialSize?.width && initialSize.height ? initialSize : { width, height }
  const baseWidth = ratio ? Math.min(width, height * ratio) : size.width
  const baseHeight = ratio ? baseWidth / ratio : size.height

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

  const shrink = Math.sqrt((baseWidth * baseHeight) / (size.width * size.height))
  return Math.min(1, Math.max(MIN_LABEL_SIZE_SCALE, shrink))
}

export const resetScreenshotLayout = () => {
  document.querySelectorAll<HTMLElement>(`[${RESIZED_ATTRIBUTE}]`).forEach((element) => {
    ;['position', 'left', 'top', 'width', 'height', 'flex', 'transform', 'z-index'].forEach((p) =>
      element.style.removeProperty(p)
    )
    element.removeAttribute(RESIZED_ATTRIBUTE)
  })
}
