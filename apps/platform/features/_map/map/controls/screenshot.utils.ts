const MIN_LABEL_SIZE_SCALE = 0.5
const STAGE_SIDE = 32
const RESIZED_PROPERTIES = [
  'position',
  'left',
  'top',
  'width',
  'height',
  'flex',
  'transform',
  'z-index',
]

export type ElementSize = { width: number; height: number }
// space taken by the editor header and footer, kept clear of the scaled container
export type ScreenshotStage = { top: number; bottom: number }

export const applyScreenshotLayout = (
  element: HTMLElement,
  ratio: number | null,
  stage: ScreenshotStage,
  initialSize?: ElementSize
): number => {
  const { innerWidth: width, innerHeight: height } = window
  const size = initialSize?.width && initialSize.height ? initialSize : { width, height }
  const baseWidth = ratio ? Math.min(width, height * ratio) : size.width
  const baseHeight = ratio ? baseWidth / ratio : size.height

  const stageWidth = width - STAGE_SIDE * 2
  const stageHeight = height - stage.top - stage.bottom
  const scale = Math.min(stageWidth / baseWidth, stageHeight / baseHeight)

  Object.assign(element.style, {
    position: 'fixed',
    left: '50%',
    top: `${stage.top + stageHeight / 2}px`,
    width: `${baseWidth}px`,
    height: `${baseHeight}px`,
    flex: 'none',
    transform: `translate(-50%, -50%) scale(${scale})`,
    zIndex: '1000',
  })

  const shrink = Math.sqrt((baseWidth * baseHeight) / (size.width * size.height))
  return Math.min(1, Math.max(MIN_LABEL_SIZE_SCALE, shrink))
}

export const resetScreenshotLayout = (element: HTMLElement) => {
  RESIZED_PROPERTIES.forEach((p) => element.style.removeProperty(p))
}
