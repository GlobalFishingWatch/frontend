import { MVTLoader } from '@loaders.gl/mvt'

export const GFWContextLoader = {
  ...MVTLoader,
  mimeTypes: [...MVTLoader.mimeTypes, 'application/octet-stream'],
}
