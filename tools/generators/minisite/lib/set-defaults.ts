import { readWorkspaceConfiguration, Tree, updateWorkspaceConfiguration } from '@nx/devkit'
import { NormalizedSchema } from './normalize-options'

export function setDefaults(host: Tree, options: NormalizedSchema) {
  const workspace = readWorkspaceConfiguration(host)

  if (!workspace.defaultProject) {
    workspace.defaultProject = options.projectName
  }

  workspace.generators = workspace.generators || {}
  workspace.generators['@nx/next'] = workspace.generators['@nx/next'] || {}
  const prev = workspace.generators['@nx/next']

  workspace.generators = {
    ...workspace.generators,
    '@nx/next': {
      ...prev,
      application: {
        style: options.style,
        linter: options.linter,
        ...prev.application,
      },
    },
  }
  updateWorkspaceConfiguration(host, workspace)
}
