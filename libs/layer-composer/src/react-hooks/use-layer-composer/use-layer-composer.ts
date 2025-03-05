import { useEffect, useState } from 'react'

import type {
  AnyGeneratorConfig,
  ExtendedStyle,
  GlobalGeneratorConfig,  StyleTransformation} from '@globalfishingwatch/layer-composer';
import {
  getInteractiveLayerIds,
  sort} from '@globalfishingwatch/layer-composer'

import { LayerComposer } from '../../layer-composer'
import { useDebounce } from '../use-debounce'

const applyStyleTransformations = (
  style: ExtendedStyle,
  styleTransformations?: StyleTransformation[]
) => {
  if (!styleTransformations) return style
  let newStyle = style
  styleTransformations.forEach((t) => {
    newStyle = t(newStyle)
  })
  return newStyle
}

export const defaultStyleTransformations: StyleTransformation[] = [sort, getInteractiveLayerIds]

// let styleSpecValidate: any

const defaultLayerComposerInstance = new LayerComposer()
export function useLayerComposer(
  generatorConfigs: AnyGeneratorConfig[],
  globalGeneratorConfig?: GlobalGeneratorConfig,
  styleTransformations: StyleTransformation[] = defaultStyleTransformations,
  layerComposer: LayerComposer = defaultLayerComposerInstance
) {
  const [style, setStyle] = useState<ExtendedStyle>()
  const debouncedStyle = useDebounce(style, 1)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const getGlStyles = async () => {
      try {
        const { style, promises } = layerComposer.getGLStyle(
          generatorConfigs,
          globalGeneratorConfig
        )
        const afterTransformations = applyStyleTransformations(style, styleTransformations)
        // if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
        //   if (!styleSpecValidate) {
        //     styleSpecValidate = await import(
        //       '@globalfishingwatch/maplibre-gl/dist/style-spec'
        //     ).then((m) => {
        //       return m.validate
        //     })
        //   }
        //   if (styleSpecValidate) {
        //     const styleErrors = styleSpecValidate(afterTransformations)
        //     if (styleErrors && styleErrors.length) {
        //       console.warn(style)
        //       throw new Error(styleErrors.map((e: any) => e.message).join('\n'))
        //     }
        //   }
        // }
        setStyle(afterTransformations)
        if (promises && promises.length) {
          setLoading(true)
          await Promise.all(
            promises.map((p: Promise<{ style: ExtendedStyle }>) => {
              return p.then(({ style }) => {
                setStyle(applyStyleTransformations(style, styleTransformations))
              })
            })
          )
          setLoading(false)
        }
        setError(null)
      } catch (e: any) {
        console.warn(e)
        setError(e)
      }
    }
    getGlStyles()
  }, [generatorConfigs, globalGeneratorConfig, layerComposer, styleTransformations])

  return { style: debouncedStyle, loading, error }
}
