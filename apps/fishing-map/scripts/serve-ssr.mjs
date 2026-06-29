import { execSync, spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const serverEntry = path.join(appRoot, '.output/server/index.mjs')

try {
  execSync("pkill -f '.output/server/index.mjs'", { stdio: 'ignore' })
} catch {
  // No stale process to kill.
}

let child = null
let shuttingDown = false
let shutdownExitCode = 0

function exitNow(code) {
  if (child?.pid) {
    try {
      child.kill('SIGKILL')
    } catch {
      // Child already exited.
    }
  }
  process.exit(code)
}

function shutdown(signal) {
  const exitCode = signal === 'SIGINT' ? 130 : 143

  if (shuttingDown) {
    exitNow(exitCode)
    return
  }

  shuttingDown = true
  shutdownExitCode = exitCode

  if (!child?.pid) {
    exitNow(exitCode)
    return
  }

  child.kill('SIGTERM')
  setTimeout(() => exitNow(shutdownExitCode), 3000).unref()
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

child = spawn(process.execPath, [serverEntry], {
  cwd: appRoot,
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code, signal) => {
  if (shuttingDown) {
    if (signal === 'SIGINT') {
      exitNow(130)
      return
    }
    if (signal === 'SIGTERM') {
      exitNow(143)
      return
    }
    exitNow(code ?? shutdownExitCode)
    return
  }

  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
