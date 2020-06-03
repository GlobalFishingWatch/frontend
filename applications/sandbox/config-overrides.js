// This allows using deps directly with @gfw/xxx/src/yyy

const getYarnWorkspaces = require('get-yarn-workspaces')
const { override, babelInclude } = require('customize-cra')

module.exports = override(babelInclude(getYarnWorkspaces()))
