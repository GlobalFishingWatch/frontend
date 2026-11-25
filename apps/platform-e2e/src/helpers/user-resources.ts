import type { Page, Response } from 'playwright/test'

import { USER_TOKEN_COOKIE_KEY } from '../../../platform/features/app/cookies.config'

// Collections where `POST /<collection>` creates a resource owned by the logged-in user and
// answers with its `id`
const USER_RESOURCE_COLLECTIONS = ['/datasets', '/workspaces', '/reports', '/vessel-groups']

/**
 * The API URL of the user resource a successful `POST` created, or `undefined` for any other
 * response. Built from the request the app sent, so no API base is configured here.
 */
export async function getCreatedUserResourceUrl(response: Response) {
  const url = new URL(response.url())
  if (
    response.request().method() !== 'POST' ||
    !response.ok() ||
    !USER_RESOURCE_COLLECTIONS.some((collection) => url.pathname.endsWith(collection))
  ) {
    return
  }
  const { id } = (await response.json()) as { id: string }
  url.pathname = `${url.pathname}/${id}`
  url.search = ''
  return url.toString()
}

/**
 * Deletes resources with the logged-in user's token, without going through the UI, so it still
 * works when the spec failed halfway. A 404 means the spec already deleted it.
 */
export async function deleteUserResources(page: Page, urls: string[]) {
  if (!urls.length) return
  const cookies = await page.context().cookies()
  const token = cookies.find((c) => c.name === USER_TOKEN_COOKIE_KEY)?.value
  if (!token) {
    throw new Error(`Cannot delete ${urls.join(', ')}: no user token cookie`)
  }
  const failed: string[] = []
  for (const url of urls) {
    const response = await page.request.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok() && response.status() !== 404) {
      failed.push(`${url} (${response.status()})`)
    }
  }
  if (failed.length) {
    throw new Error(`Cannot delete user resources: ${failed.join(', ')}`)
  }
}
