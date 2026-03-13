/* global console, process */

import { globSync } from 'glob'
import fs from 'node:fs'
import { PurgeCSS } from 'purgecss'

const IGNORE_GLOBS = ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**']

function parseProjectArg(argv) {
  const projectIndex = argv.indexOf('--project')
  if (projectIndex !== -1) {
    const projectValue = argv[projectIndex + 1]
    if (!projectValue || projectValue.startsWith('--')) {
      throw new Error('Missing project value. Use --project <project-path>.')
    }
    return projectValue
  }
  const inlineProjectArg = argv.find((arg) => arg.startsWith('--project='))
  if (inlineProjectArg) {
    return inlineProjectArg.split('=')[1]
  }
  return undefined
}

function resolveProjectPath(projectArg) {
  if (!projectArg) return null

  const cleanProjectArg = projectArg.replace(/^\.?\//, '')
  if (
    (cleanProjectArg.startsWith('apps/') || cleanProjectArg.startsWith('libs/')) &&
    fs.existsSync(cleanProjectArg)
  ) {
    return cleanProjectArg
  }

  const appPath = `apps/${cleanProjectArg}`
  const libPath = `libs/${cleanProjectArg}`
  const appExists = fs.existsSync(appPath)
  const libExists = fs.existsSync(libPath)

  if (appExists && libExists) {
    throw new Error(
      `Project "${projectArg}" is ambiguous. Use "apps/${cleanProjectArg}" or "libs/${cleanProjectArg}".`
    )
  }
  if (appExists) return appPath
  if (libExists) return libPath

  throw new Error(
    `Project "${projectArg}" not found. Use --project with a valid path like "apps/fishing-map".`
  )
}

// Base configuration
const baseConfig = {
  content: [
    './apps/**/src/**/*.{js,jsx,ts,tsx}',
    './apps/**/pages/**/*.{js,jsx,ts,tsx}',
    './apps/**/features/**/*.{js,jsx,ts,tsx}',
    './libs/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: {
    standard: [/^recharts-/, /^print-/, /^sticky/, /^active/, /^disabled/, /^map-/, /^workspace-/],
    deep: [/^tooltip/, /^modal/],
    greedy: [/^data-/, /^react-/],
  },
  fontFace: true,
  keyframes: true,
  variables: false,
}

async function purgeCSS() {
  let cssFiles = []
  try {
    const projectArg = parseProjectArg(process.argv.slice(2))
    const projectPath = resolveProjectPath(projectArg)
    const cssPattern = projectPath ? `${projectPath}/**/*.css` : '**/*.css'
    cssFiles = globSync(cssPattern, { ignore: IGNORE_GLOBS })

    if (cssFiles.length === 0) {
      console.log(`No CSS files found for pattern "${cssPattern}"`)
      return
    }

    console.log(
      projectPath
        ? `Purging ${cssFiles.length} CSS files in "${projectPath}"...`
        : `Purging ${cssFiles.length} CSS files across the workspace...`
    )

    // Create backups
    cssFiles.forEach((file) => {
      fs.copyFileSync(file, `${file}.backup`)
    })

    // Process each CSS file
    for (const cssFile of cssFiles) {
      console.log(`Processing ${cssFile}...`)

      const results = await new PurgeCSS().purge({
        ...baseConfig,
        css: [cssFile],
      })

      // Write purged CSS back to original file
      if (results[0]?.css) {
        fs.writeFileSync(cssFile, results[0].css)
        console.log(`✓ Purged ${cssFile}`)
      }
    }

    console.log('\nPurge completed successfully!')
  } catch (error) {
    console.error('Error during purge:', error)

    // Restore backups on error
    cssFiles.forEach((file) => {
      if (fs.existsSync(`${file}.backup`)) {
        fs.copyFileSync(`${file}.backup`, file)
      }
    })
  } finally {
    // Clean up backups
    cssFiles.forEach((file) => {
      if (fs.existsSync(`${file}.backup`)) {
        fs.unlinkSync(`${file}.backup`)
      }
    })
  }
}

purgeCSS()
