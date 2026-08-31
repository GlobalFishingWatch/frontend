import type { Page } from 'playwright/test'

import { expect, test } from '../fixtures'
import { MAP_PATH } from '../paths'
import { TAGS } from '../tags'

/**
 * The `welcomePopupsDisabled` auto fixture dismisses the onboarding panel for every other spec.
 * These tests are about the panel itself, so they opt back in — this init script runs after the
 * fixture's, so it wins.
 */
async function enableOnboardingPanel(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('OnboardingPanelDismissed', 'false')
  })
}

test(`welcome panel - auto-opens on a first map visit ${TAGS.SMOKE}`, async ({ page }) => {
  await enableOnboardingPanel(page)
  await page.goto(MAP_PATH)

  await expect(page.getByText('What would you like to do today?')).toBeVisible()
  await expect(page.getByTestId('onboarding-card-searchVessel')).toBeVisible()
  await expect(page.getByTestId('onboarding-card-areaReport')).toBeVisible()
  await expect(page.getByTestId('onboarding-card-userGuide')).toBeVisible()
})

test(`welcome panel - vessel card opens search and its guide article ${TAGS.SMOKE}`, async ({
  page,
}) => {
  await enableOnboardingPanel(page)
  await page.goto(MAP_PATH)

  await page.getByTestId('onboarding-card-searchVessel').click()

  await page.waitForURL('**/vessel-search**')
  expect(page.url()).toContain('sidePanelContent=userGuide')
  expect(page.url()).toContain('sidePanelSubcontentId=vessel-search')
})

test(`welcome panel - area card opens the map area search ${TAGS.SMOKE}`, async ({ page }) => {
  await enableOnboardingPanel(page)
  await page.goto(MAP_PATH)

  await page.getByTestId('onboarding-card-areaReport').click()

  await expect(page.getByTestId('map-search-input')).toBeVisible()
  await expect(page.getByTestId('map-search-input')).toBeFocused()
  expect(page.url()).toContain('sidePanelId=analysis-and-dynamic-reports')
})

test(`welcome panel - don't show again survives a reload ${TAGS.SMOKE}`, async ({ page }) => {
  await enableOnboardingPanel(page)
  await page.goto(MAP_PATH)

  await expect(page.getByTestId('onboarding-card-searchVessel')).toBeVisible()
  // The Checkbox's button carries no accessible name, so click its label — what a user clicks too.
  await page.getByText("Don't show again").click()

  await page.goto(MAP_PATH)
  await expect(page.getByText('What would you like to do today?')).not.toBeVisible()
})
