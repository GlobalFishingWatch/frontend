import { appPackageJsonConfig } from '@globalfishingwatch/linting/nx'

import rootConfig from '../../eslint.config.js'

export default [...rootConfig, appPackageJsonConfig]
