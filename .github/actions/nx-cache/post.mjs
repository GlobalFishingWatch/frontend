import { saveCache } from '@actions/cache'
import { getState, info, warning } from '@actions/core'
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { env, kill } from 'node:process'

const dir = join(env.RUNNER_TEMP, 'nx-cache')
const key = getState('key')

try {
  kill(Number(getState('pid')))
} catch {
  info('Nx cache server was not running')
}

if (!key || !existsSync(dir)) {
  info('No Nx cache to save')
} else {
  // The server touches every entry it serves, so anything older than the start was not used
  const startedAt = Number(getState('startedAt'))
  const kept = []
  let dropped = 0
  for (const file of readdirSync(dir)) {
    const path = join(dir, file)
    if (file.endsWith('.tmp') || statSync(path).mtimeMs < startedAt) {
      rmSync(path, { force: true })
      dropped++
    } else {
      kept.push(file)
    }
  }
  const restored = new Set(
    JSON.parse(readFileSync(join(env.RUNNER_TEMP, 'nx-cache-restored.json'), 'utf8'))
  )
  const added = kept.filter((file) => !restored.has(file)).length
  info(`Nx cache: kept ${kept.length} entries (${added} new), dropped ${dropped} unused`)

  if (!kept.length) {
    info('Nothing to save')
  } else if (!added && !dropped) {
    info('Nx cache unchanged, not saving')
  } else {
    try {
      if ((await saveCache([dir], key)) !== -1) info(`Saved Nx cache as ${key}`)
    } catch (error) {
      warning(`Could not save the Nx cache: ${error.message}`)
    }
  }
}
