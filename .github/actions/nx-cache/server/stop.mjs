import { readdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { env, kill, stdout } from 'node:process'

const { RUNNER_TEMP, STATE_pid, STATE_startedAt } = env
const dir = join(RUNNER_TEMP, 'nx-cache')

try {
  kill(Number(STATE_pid))
} catch {
  stdout.write('Nx cache server was not running\n')
}

// The server touches every entry it serves, so anything older than the start was not used
let dropped = 0
const files = readdirSync(dir)
for (const file of files) {
  const path = join(dir, file)
  if (file.endsWith('.tmp') || statSync(path).mtimeMs < Number(STATE_startedAt)) {
    rmSync(path, { force: true })
    dropped++
  }
}
stdout.write(`Nx cache: kept ${files.length - dropped} entries, dropped ${dropped} unused\n`)
