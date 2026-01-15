import { expect, test } from 'playwright/test'

test('VV01- Vessel profile', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto(
    '/map/index?dvIn[0][id]=presence&dvIn[0][cfg][vis]=false&dvIn[1][id]=vessel-9827ea1ea-a120-f374-0cc6-138b38bd8130&dvIn[1][dvId]=fishing-map-vessel-track-v-4&dvIn[1][cfg][clr]=%23F95E5E&dvIn[1][cfg][info]=public-global-vessel-identity%3Av4.0&dvIn[1][cfg][track]=public-global-all-tracks%3Av4.0&dvIn[1][cfg][events][0]=public-global-fishing-events%3Av4.0&dvIn[1][cfg][events][1]=public-global-port-visits-events%3Av4.0&dvIn[1][cfg][events][2]=public-global-encounters-events%3Av4.0&dvIn[1][cfg][events][3]=public-global-loitering-events%3Av4.0&dvIn[1][cfg][events][4]=public-global-gaps-events%3Av4.0&dvIn[1][cfg][rVIs][0]=1da8dbc23-3c48-d5ce-95f1-1ffb6cc00161&dvIn[1][cfg][rVIs][1]=0b7047cb5-58c8-6e63-4bfd-96a6af515c91&dvIn[1][cfg][rVIs][2]=58cf536b1-1fca-dac3-ad31-7411a3708dcd&dvIn[1][dT]=false&bDV'
  )

  await page.getByRole('button', { name: 'Close' }).click()

  await page.getByText('Gabu Reefer').click()

  await page.getByRole('button', { name: 'Close' }).click()

  await page.locator('button').filter({ hasText: 'Registry' }).click()

  expect(page.getByText('Fishing Cargo Services (Panama) Aug 7, 2024 - Nov 30, 2025')).toBeVisible()

  expect(await page.getByLabel('Register and login to see').count()).toBe(8)

  expect(page.getByText('Vessel dwqdwqd')).toBeVisible()
})
