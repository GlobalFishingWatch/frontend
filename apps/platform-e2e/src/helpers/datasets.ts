import type { Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { USER_TOKEN_COOKIE_KEY } from '../../../platform/features/app/cookies.config'

import { TIMEOUTS } from './timeouts'

export type CreatedDataset = {
  id: string
  /** The dataset's own API URL, built from the request the app sent, so no API base is configured here */
  url: string
}

/**
 * Resolves with the dataset the app creates through `POST /datasets`. Call it before the click that
 * saves, and await it after.
 */
export async function waitForDatasetCreated(page: Page): Promise<CreatedDataset> {
  const response = await page.waitForResponse(
    (r) => r.request().method() === 'POST' && new URL(r.url()).pathname.endsWith('/datasets'),
    { timeout: TIMEOUTS.LONG }
  )
  expect(response.ok(), `POST /datasets returned ${response.status()}`).toBe(true)
  const { id } = (await response.json()) as { id: string }
  const url = new URL(response.url())
  url.pathname = `${url.pathname}/${id}`
  url.search = ''
  return { id, url: url.toString() }
}

/**
 * Cleanup for specs that create a dataset: deletes it with the logged-in user's token, without
 * going through the UI, so it still works when the spec failed halfway. A 404 means it is gone.
 */
export async function deleteDatasetThroughApi(page: Page, dataset: CreatedDataset) {
  const cookies = await page.context().cookies()
  const token = cookies.find((c) => c.name === USER_TOKEN_COOKIE_KEY)?.value
  if (!token) {
    throw new Error(`Cannot delete dataset "${dataset.id}": no user token cookie`)
  }
  const response = await page.request.delete(dataset.url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok() && response.status() !== 404) {
    throw new Error(`Cannot delete dataset "${dataset.id}": ${response.status()}`)
  }
}
