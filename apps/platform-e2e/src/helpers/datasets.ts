import type { Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { TIMEOUTS } from './timeouts'

/**
 * Resolves with the id of the dataset the app creates through `POST /datasets`. Call it before the
 * click that saves, and await it after. The `userResourcesCleanup` fixture deletes the dataset.
 */
export async function waitForDatasetCreated(page: Page): Promise<string> {
  const response = await page.waitForResponse(
    (r) => r.request().method() === 'POST' && new URL(r.url()).pathname.endsWith('/datasets'),
    { timeout: TIMEOUTS.LONG }
  )
  expect(response.ok(), `POST /datasets returned ${response.status()}`).toBe(true)
  const { id } = (await response.json()) as { id: string }
  return id
}
