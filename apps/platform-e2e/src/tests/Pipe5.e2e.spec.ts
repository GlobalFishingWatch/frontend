import { test } from '../fixtures'
import { waitForHydration } from '../helpers/hydration'
import { MAP_PATH } from '../paths'
import { TAGS } from '../tags'

test.beforeEach(async ({ page }) => {
  await page.goto(MAP_PATH)
  await waitForHydration(page)
})
