// Entry for the platform `test:login` target: logs in once outside vitest, so CI can share the tokens with every worker.
// Run through jiti because lib dist uses extensionless imports that plain Node ESM cannot resolve.
import runAuthSetup from './auth-setup'

await runAuthSetup('test:login', { resetLog: true })
