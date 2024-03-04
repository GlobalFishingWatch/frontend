import { Position } from '@deck.gl/core/typed'
import { DeckGLRenderCallbackArgs } from '@deck.gl/react/typed/utils/extract-jsx-layers'

export type MapAnnotation = {
  id: number
  lon: number | string
  lat: number | string
  label: string
  color?: string
}

export type MapAnnotationComponentProps = DeckGLRenderCallbackArgs

export type MapAnnotationDilaogComponentProps = DeckGLRenderCallbackArgs & {
  coords: Position | undefined
}
