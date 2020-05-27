import rollup from '../../config/rollup.config'

export default rollup({
  input: ['./src/index.ts', './src/dataviews-client.ts'],
})
