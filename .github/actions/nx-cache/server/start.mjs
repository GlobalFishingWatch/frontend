import { spawn } from 'node:child_process'
import { appendFileSync, openSync } from 'node:fs'
import { get } from 'node:http'
import { join } from 'node:path'
import { env, execPath, exit, stdout } from 'node:process'
import { setTimeout } from 'node:timers/promises'

const { GITHUB_ENV, GITHUB_STATE, RUNNER_TEMP } = env
const url = 'http://127.0.0.1:4911'
const log = join(RUNNER_TEMP, 'nx-cache.log')

const startedAt = Date.now()
const server = spawn(
  execPath,
  [join(import.meta.dirname, 'nx-cache-server.mjs'), join(RUNNER_TEMP, 'nx-cache')],
  { detached: true, stdio: ['ignore', openSync(log, 'a'), openSync(log, 'a')] }
)
server.unref()

appendFileSync(GITHUB_STATE, `pid=${server.pid}\nstartedAt=${startedAt}\n`)
appendFileSync(GITHUB_ENV, `NX_SELF_HOSTED_REMOTE_CACHE_SERVER=${url}\n`)

const ping = () =>
  new Promise((resolve) =>
    get(`${url}/v1/cache/ping`, (res) => {
      res.resume()
      resolve(true)
    }).on('error', () => resolve(false))
  )

for (let attempt = 0; attempt < 50; attempt++) {
  if (await ping()) {
    stdout.write(`Nx cache server listening on ${url}\n`)
    exit(0)
  }
  await setTimeout(100)
}
stdout.write(`::error::Nx cache server did not start, see ${log}\n`)
exit(1)
