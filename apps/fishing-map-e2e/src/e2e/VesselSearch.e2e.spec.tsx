import { expect, test } from 'playwright/test'

test('Search01 - Basic vessel search', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto('/map/vessel-search')

  await page.getByRole('button', { name: 'Close' }).click()

  await page.locator('[data-test="seach-vessels-basic-input"]').fill('GABU REEFER')

  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(3000) // wait for results to appear

  expect(page.getByText('629009266')).toBeVisible()

  page.getByText('Gabu Reefer').click()

  await page.waitForURL(
    'http://localhost:3003/map/vessel/9827ea1ea-a120-f374-0cc6-138b38bd8130?vDi=public-global-vessel-identity%3Av4.0&vIs=registryInfo&vRi=eed33c65d1bcfbee79ec3f2ab9462a67&start=2012-01-02T16%3A50%3A42Z&end=2026-01-11T23%3A57%3A40Z&latitude=14.888310092747938&longitude=-5.72907781600951&zoom=3.5673206569207982&vE[0]=loitering&vE[1]=encounter&vE[2]=port_visit&vE[3]=gap'
  )
})
