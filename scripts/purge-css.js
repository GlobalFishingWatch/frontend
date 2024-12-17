const fs = require('fs')
const { PurgeCSS } = require('purgecss')
const glob = require('glob')

// Find all CSS files
const cssFiles = glob.sync('**/*.css', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'],
})

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
  variables: true,
}

async function purgeCSS() {
  try {
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
