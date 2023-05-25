import { Tree } from '@nx/devkit'
import { NormalizedSchema } from './normalize-options'

export function updateJestConfig(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return
  }

  const configPath = `${options.appProjectRoot}/jest.config.js`
  const originalContent = host.read(configPath, 'utf-8')
  const content = originalContent
    .replace(
      'transform: {',
      "transform: {\n    '^(?!.*\\\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',"
    )
    .replace(`'babel-jest'`, `['babel-jest', { presets: ['@nx/next/babel'] }]`)
  host.write(configPath, content)
}
