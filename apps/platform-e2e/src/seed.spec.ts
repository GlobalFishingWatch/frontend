import { test } from '@playwright/test'

import { MAP_PATH } from './paths'

test('seed', async ({ page }) => {
  await page.goto(MAP_PATH)
})
