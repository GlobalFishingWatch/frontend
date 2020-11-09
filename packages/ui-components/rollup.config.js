import rollup from '../../config/rollup.config'

export default rollup({
  external: ['@globalfishingwatch/layer-composer/dist/types'],
})
