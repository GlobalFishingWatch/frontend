import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset'
import { defineConfig } from 'cypress'

const { stat, rmdir, unlinkSync } = require('fs')
const decompress = require('decompress')

const cypressJsonConfig = {
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: true,
  videosFolder: '../../dist/cypress/apps/fishing-map-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/fishing-map-e2e/screenshots',
  chromeWebSecurity: false,
  trashAssetsBeforeRuns: true,
  specPattern: ['src/e2e/**/*.cy.{js,jsx,ts,tsx}'],
  //excludeSpecPattern: ['src/e2e/map/', 'src/e2e/sidebar/'],
  supportFile: 'src/support/e2e.ts',
  numTestsKeptInMemory: 5,
}
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename),
    ...cypressJsonConfig,
    reporter: '../../node_modules/mochawesome',
    reporterOptions: {
      mochaFile: '../../dist/cypress/apps/fishing-map-e2e/test-[hash].xml',
      reportDir: '../../dist/cypress/apps/fishing-map-e2e/',
      toConsole: true,
      overwrite: false,
      // generate intermediate HTML reports
      html: true,
      // generate intermediate JSON reports
      json: true,
      reportFilename: '[status]_[datetime]-[name]-report',
      timestamp: 'longDate',
    },
    /**
     * TODO(@nx/cypress): In Cypress v12,the testIsolation option is turned on by default.
     * This can cause tests to start breaking where not indended.
     * You should consider enabling this once you verify tests do not depend on each other
     * More Info: https://docs.cypress.io/guides/references/migration-guide#Test-Isolation
     **/
    testIsolation: false,
    setupNodeEvents(on, config) {
      on('task', {
        deleteFolder(folderName) {
          console.log('deleting folder %s', folderName)

          return new Promise((resolve, reject) => {
            stat(folderName, (err, stats) => {
              if (!err) {
                rmdir(folderName, { maxRetries: 10, recursive: true }, (removeErr) => {
                  if (removeErr) {
                    console.error(removeErr)
                    return reject(removeErr)
                  }
                  resolve(null)
                })
              } else {
                resolve(null)
              }
            })
          })
        },

        unzipping: ({ path, file }) =>
          decompress(path + file, path + 'unzip/' + file.replace('.zip', '')),
      })
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            unlinkSync(results.video)
          }
        }
      })
    },

    env: {
      apiAuthUser: '',
      apiAuthPass: '',
    },
  },
})
