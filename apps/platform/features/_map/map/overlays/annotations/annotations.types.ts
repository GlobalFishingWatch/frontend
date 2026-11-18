export const MAP_ANNOTATION_SIZES = ['small', 'medium', 'large'] as const
export type MapAnnotationSize = (typeof MAP_ANNOTATION_SIZES)[number]

export const MAP_ANNOTATION_FONT_SCALE: Record<MapAnnotationSize, number> = {
  small: 1,
  medium: 1.4,
  large: 1.8,
}

export const MAP_ANNOTATION_BTN_BASE_REM = 1.2

export type MapAnnotation = {
  id: number
  lon: number | string
  lat: number | string
  label: string
  color?: string
  size?: MapAnnotationSize
}
