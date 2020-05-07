const { override, babelInclude } = require('customize-cra')
const getYarnWorkspaces = require('get-yarn-workspaces')

module.exports = override(babelInclude(getYarnWorkspaces()))
