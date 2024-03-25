import { MVTLoader } from '@loaders.gl/mvt'

export const GFWMVTLoader = {
  ...MVTLoader,
  // TODO: match api response with standard to avoid this override
  mimeTypes: [...MVTLoader.mimeTypes, 'application/octet-stream'],
}
