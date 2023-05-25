import { addProjectConfiguration, joinPathFragments, ProjectConfiguration, Tree } from '@nx/devkit'
import { NormalizedSchema } from './normalize-options'

export function addProject(host: Tree, options: NormalizedSchema) {
  const targets: Record<string, any> = {}

  targets.deploy = {
    executor: '@nx/workspace:run-commands',
    options: {
      commands: [
        `nx build ${options.projectName} --parallel`,
        `nx docker-prepare ${options.projectName}`,
      ],
      parallel: false,
    },
  }

  targets['docker-prepare'] = {
    executor: '@nx/workspace:run-commands',
    outputs: [],
    options: {
      commands: [
        `cp config/entrypoint.sh dist/${options.appProjectRoot}`,
        `cp ${options.appProjectRoot}/nginx.conf dist/${options.appProjectRoot}`,
      ],
    },
  }

  targets.compile = {
    builder: '@nx/next:build',
    outputs: ['{options.outputPath}'],
    defaultConfiguration: 'production',
    options: {
      root: options.appProjectRoot,
      outputPath: joinPathFragments('dist', options.appProjectRoot),
    },
    // This has to be here so `nx serve [app] --prod` will work. Otherwise
    // a missing configuration error will be thrown.
    configurations: {
      production: {},
    },
  }

  targets.start = {
    executor: '@nx/workspace:run-commands',
    options: {
      commands: [
        `nx clean-locales ${options.projectName}`,
        'nx serve i18n-labels',
        `nx serve ${options.projectName}`,
      ],
      parallel: true,
    },
  }

  targets['clean-locales'] = {
    executor: '@nx/workspace:run-commands',
    outputs: [],
    options: {
      commands: [`rm -rf ${joinPathFragments('dist', options.appProjectRoot)}/public/locales`],
    },
  }

  targets.serve = {
    builder: '@nx/next:server',
    options: {
      buildTarget: `${options.projectName}:build`,
      dev: true,
    },
    configurations: {
      production: {
        buildTarget: `${options.projectName}:compile:production`,
        dev: false,
      },
    },
  }

  targets.serve = {
    executor: '@nx/next:server',
    options: {
      buildTarget: `${options.projectName}:compile`,
      dev: true,
      port: 3003,
    },
    configurations: {
      production: {
        buildTarget: `${options.projectName}:build:production`,
        dev: false,
      },
    },
  }

  if (options.server) {
    targets.serve.options = {
      ...targets.serve.options,
      customServerPath: options.server,
    }
  }

  targets.build = {
    builder: '@nx/next:export',
    options: {
      buildTarget: `${options.projectName}:build:production`,
    },
  }

  targets.lint = {
    executor: '@nx/linter:eslint',
    outputs: ['{options.outputFile}'],
    options: {
      lintFilePatterns: [`${options.appProjectRoot}/**/*.{ts,tsx,js,jsx}`],
    },
  }

  const project: ProjectConfiguration = {
    root: options.appProjectRoot,
    sourceRoot: options.appProjectRoot,
    projectType: 'application',
    targets,
    tags: options.parsedTags,
  }

  addProjectConfiguration(
    host,
    options.projectName,
    {
      ...project,
    },
    options.standaloneConfig
  )
}
