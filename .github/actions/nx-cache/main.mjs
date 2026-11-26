import { restoreCache } from '@actions/cache'
import {
  exportVariable,
  getInput,
  getMultilineInput,
  info,
  saveState,
  setFailed,
} from '@actions/core'
import { spawn } from 'node:child_process'
import { existsSync, openSync, readdirSync, writeFileSync } from 'node:fs'
import { get } from 'node:http'
import { join } from 'node:path'
import { env, execPath } from 'node:process'
import { setTimeout } from 'node:timers/promises'

const { GITHUB_RUN_ATTEMPT, GITHUB_SHA, RUNNER_TEMP } = env
const dir = join(RUNNER_TEMP, 'nx-cache')
const url = 'http://127.0.0.1:4911'
const log = join(RUNNER_TEMP, 'nx-cache.log')

const prefix = getInput('key', { required: true })
// Unique per attempt, so a re-run of a failed job can save what it adds
const key = `${prefix}-${GITHUB_SHA}-${GITHUB_RUN_ATTEMPT}`
const restoredKey = await restoreCache([dir], key, [
  `${prefix}-`,
  ...getMultilineInput('restore-keys'),
])
info(restoredKey ? `Restored Nx cache from ${restoredKey}` : 'No Nx cache to restore')
writeFileSync(
  join(RUNNER_TEMP, 'nx-cache-restored.json'),
  JSON.stringify(existsSync(dir) ? readdirSync(dir) : [])
)

const startedAt = Date.now()
const server = spawn(execPath, [join(import.meta.dirname, 'nx-cache-server.mjs'), dir], {
  detached: true,
  stdio: ['ignore', openSync(log, 'a'), openSync(log, 'a')],
})
server.unref()

saveState('key', key)
saveState('pid', server.pid)
saveState('startedAt', startedAt)
exportVariable('NX_SELF_HOSTED_REMOTE_CACHE_SERVER', url)

const ping = () =>
  new Promise((resolve) =>
    get(`${url}/v1/cache/ping`, (res) => {
      res.resume()
      resolve(true)
    }).on('error', () => resolve(false))
  )

let listening = false
for (let attempt = 0; attempt < 50 && !listening; attempt++) {
  listening = await ping()
  if (!listening) await setTimeout(100)
}
if (listening) info(`Nx cache server listening on ${url}`)
else setFailed(`Nx cache server did not start, see ${log}`)
