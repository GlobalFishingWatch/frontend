import { validate as mapboxStyleValidator } from '@mapbox/mapbox-gl-style-spec'

import generators from './generators'

import LayerComposer, { DEFAULT_CONFIG } from '.'

test('instanciates with the default config', async () => {
  const layerComposer = new LayerComposer()
  const objectToMatch = { ...DEFAULT_CONFIG }
  const { style } = layerComposer.getGLStyle([])
  expect(style).toMatchObject(objectToMatch)
  // expect(layerComposer.getGLStyle(glyphPath)).toMatchSnapshot()
})

test('instanciates with the defaultGenerators config', async () => {
  const layerComposerConfig = { generators }
  const layerComposer = new LayerComposer(layerComposerConfig)
  const objectToMatch = { ...DEFAULT_CONFIG }
  const { style } = layerComposer.getGLStyle([])
  expect(style).toMatchObject(objectToMatch)
  // expect(layerComposer.getGLStyle(glyphPath)).toMatchSnapshot()
})

test('check valid style.json format', async () => {
  const layerComposer = new LayerComposer()
  const { style } = layerComposer.getGLStyle([])
  const errors = mapboxStyleValidator(style)
  if (errors.length) {
    console.log('Errors found in style validation:', errors)
  }
  expect(errors.length).toBe(0)
})
