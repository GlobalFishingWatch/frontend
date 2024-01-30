import { defineConfig } from 'cypress'
import baseConfig from './cypress.config'

const cypressJsonConfig = {
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: true,
  videosFolder: '../../dist/cypress/apps/fishing-map-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/fishing-map-e2e/screenshots',
  chromeWebSecurity: false,
  specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  supportFile: 'src/support/e2e.ts',
  pageLoadTimeout: 3 * 60 * 1000,
  defaultCommandTimeout: 4 * 60 * 1000,
}
export default defineConfig({
  ...baseConfig,
  e2e: {
    ...cypressJsonConfig,
    /**
     * TODO(@nrwl/cypress): In Cypress v12,the testIsolation option is turned on by default.
     * This can cause tests to start breaking where not indended.
     * You should consider enabling this once you verify tests do not depend on each other
     * More Info: https://docs.cypress.io/guides/references/migration-guide#Test-Isolation
     **/
    testIsolation: true,
    pageLoadTimeout: 100000,
  },
  env: {
    apiAuth: 'https://gateway.api.dev.globalfishingwatch.org',
    apiAuthUser: '',
    apiAuthPass: '',
  },
})
