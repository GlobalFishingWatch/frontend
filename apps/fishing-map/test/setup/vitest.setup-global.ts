import type { TestProject } from 'vitest/node'

import validateAuthSetup from './login/auth-setup'

let hasResetAuthLog = false

async function globalSetup(project: TestProject) {
  await validateAuthSetup(project.config.browser?.name ?? 'global-setup', {
    resetLog: !hasResetAuthLog,
  })
  hasResetAuthLog = true
}

export default globalSetup
