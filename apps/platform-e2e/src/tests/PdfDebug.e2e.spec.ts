// Temporary: inspects why a section is skipped by the PDF converter. Not meant to be committed.
import { VESSEL_PROFILE_LINK_TESTID } from '@platform/config/selectors/vessels'

import { expect, test } from '../fixtures'
import { MAP_PATH } from '../paths'

test('debug - vessel areas section', async ({ page, searchPage, loginPage }) => {
  page.on('console', (msg) => {
    if (msg.text().startsWith('DBG')) console.log(msg.text())
  })
  await page.goto(MAP_PATH)
  await loginPage.login()
  await searchPage.gotoWithQuery('GABU REEFER')
  await searchPage.expectResultsVisible()
  await page.getByTestId(VESSEL_PROFILE_LINK_TESTID).first().click()
  await page.waitForURL('**/vessel/**')
  await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible({ timeout: 60_000 })
  await page.waitForTimeout(8000)
  await page.evaluate(async () => {
    const { withPrintStyles } = await import('/platform/features/pdf/pdf-print-styles.ts' as string)
    await withPrintStyles(() => {
      const headings = Array.from(document.querySelectorAll('h2'))
      headings.forEach((h2) => {
        const chain: string[] = []
        let el: Element | null = h2
        while (el && chain.length < 14) {
          const cs = getComputedStyle(el)
          chain.push(
            `${el.tagName}.${String(el.className).slice(0, 24)}|${cs.display}|${cs.position}|${cs.visibility}`
          )
          el = el.parentElement
        }
        console.log('DBG', JSON.stringify(h2.textContent), chain.join(' < '))
      })
    })
  })
})
