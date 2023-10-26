import { defineConfig } from 'cypress'
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset'
const { stat, rmdir } = require('fs')
const decompress = require('decompress')

const cypressJsonConfig = {
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  videosFolder: '../../dist/cypress/apps/fishing-map-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/fishing-map-e2e/screenshots',
  chromeWebSecurity: false,
  trashAssetsBeforeRuns: true,
  specPattern: ['src/e2e/**/*.cy.{js,jsx,ts,tsx}'],
  //excludeSpecPattern: ['src/e2e/map/eez-download.cy.ts'],
  supportFile: 'src/support/e2e.ts',
  numTestsKeptInMemory: 5,
}
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename),
    ...cypressJsonConfig,
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
    },
  },
  env: {
    apiAuthUser: '',
    apiAuthPass: '',
  },
})
