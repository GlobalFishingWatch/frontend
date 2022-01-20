import {
  addProjectConfiguration,
  joinPathFragments,
  ProjectConfiguration,
  Tree,
} from '@nrwl/devkit'
import { NormalizedSchema } from './normalize-options'

export function addProject(host: Tree, options: NormalizedSchema) {
  const targets: Record<string, any> = {}

  targets.deploy = {
    executor: '@nrwl/workspace:run-commands',
    options: {
      commands: [
        `nx build ${options.projectName} --parallel`,
        `nx docker-prepare ${options.projectName}`,
      ],
      parallel: false,
    },
  }

  targets['docker-prepare'] = {
    executor: '@nrwl/workspace:run-commands',
    outputs: [],
    options: {
      commands: [
        `cp config/entrypoint.sh dist/${options.appProjectRoot}`,
        `cp ${options.appProjectRoot}/nginx.conf dist/${options.appProjectRoot}`,
      ],
    },
  }

  targets.compile = {
    builder: '@nrwl/next:build',
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
    executor: '@nrwl/workspace:run-commands',
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
    executor: '@nrwl/workspace:run-commands',
    outputs: [],
    options: {
      commands: [`rm -rf ${joinPathFragments('dist', options.appProjectRoot)}/public/locales`],
    },
  }

  targets.serve = {
    builder: '@nrwl/next:server',
    options: {
      buildTarget: `${options.projectName}:build`,
      dev: true,
    },
    configurations: {
      production: {
        buildTarget: `${options.projectName}:build:production`,
        dev: false,
      },
    },
  }

  targets.serve = {
    executor: '@nrwl/next:server',
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
    builder: '@nrwl/next:export',
    options: {
      buildTarget: `${options.projectName}:build:production`,
    },
  }

  targets.lint = {
    executor: '@nrwl/linter:eslint',
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
