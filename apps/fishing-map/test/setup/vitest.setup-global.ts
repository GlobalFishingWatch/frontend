import type { TestProject } from 'vitest/node'

import validateAuthSetup, { isAuthCacheExpired } from './login/auth-setup'

let hasResetAuthLog = false
let authSetupDone = false

async function globalSetup(project: TestProject) {
  if (authSetupDone && !isAuthCacheExpired()) {
    return
  }
  authSetupDone = false
  await validateAuthSetup(project.config.browser?.name ?? 'global-setup', {
    resetLog: !hasResetAuthLog,
  })
  hasResetAuthLog = true
  authSetupDone = true
}

export default globalSetup
