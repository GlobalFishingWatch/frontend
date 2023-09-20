import { convertNxGenerator, formatFiles, Tree } from '@nx/devkit'
import { runTasksInSerial } from '@nx/workspace/src/utilities/run-tasks-in-serial'
import { nextInitGenerator } from '@nx/next/src/generators/init/init'
import { normalizeOptions } from './lib/normalize-options'
import { Schema } from './schema'
import { addCypress } from './lib/add-cypress'
import { addJest } from './lib/add-jest'
import { addProject } from './lib/add-project'
import { createApplicationFiles } from './lib/create-application-files'
import { createNextServerFiles } from './lib/create-next-server-files'
import { setDefaults } from './lib/set-defaults'
import { updateJestConfig } from './lib/update-jest-config'

async function applicationGenerator(host: Tree, schema: Schema) {
  const options = normalizeOptions(host, schema)

  const nextTask = await nextInitGenerator(host, {
    ...options,
    skipFormat: true,
  })
  createApplicationFiles(host, options)
  createNextServerFiles(host, options)
  addProject(host, options)
  const cypressTask = await addCypress(host, options)
  const jestTask = await addJest(host, options)
  updateJestConfig(host, options)
  setDefaults(host, options)

  if (!options.skipFormat) {
    await formatFiles(host)
  }

  return runTasksInSerial(nextTask, cypressTask, jestTask)
}

export const applicationSchematic = convertNxGenerator(applicationGenerator)
export default applicationGenerator
