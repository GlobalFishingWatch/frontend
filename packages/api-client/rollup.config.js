import configure from '../../config/rollup.config'

const pkg = require('./package.json')

export default configure({
  file: pkg.main,
})
