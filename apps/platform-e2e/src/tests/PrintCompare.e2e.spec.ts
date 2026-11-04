// Temporary: captures the current print output (window.print + @media print) and, once it
// exists, the PDF download, so both can be compared page by page. Not meant to be committed.
import { mkdirSync } from 'fs'

import type { Page } from 'playwright/test'

import { VESSEL_PROFILE_LINK_TESTID } from '@platform/config/selectors/vessels'

import { expect, test } from '../fixtures'
import { CANARY_ISLANDS_EEZ } from '../pages/ReportPage'
import { MAP_PATH } from '../paths'

const OUT = process.env.PRINT_COMPARE_OUT || '/tmp/print-compare'
const MODE = process.env.PRINT_COMPARE_MODE || 'print' // 'print' | 'pdf'

async function capture(page: Page, name: string) {
  mkdirSync(OUT, { recursive: true })
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') console.log('[browser]', msg.text().slice(0, msg.text().startsWith('PDFOUTLINE') ? 20000000 : 400), JSON.stringify(msg.location()))
  })
  page.on('pageerror', (error) => console.log('[pageerror]', (error.stack || error.message).slice(0, 1500)))
  // The sidebar header turns sticky (and hides its actions) once scrolled.
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach((el) => {
      if (el.scrollTop > 0) el.scrollTop = 0
    })
  })
  await page.waitForTimeout(500)
  const button =
    MODE === 'print'
      ? page.getByRole('button', { name: /^print$/i }).first()
      : page.locator('[data-testid$="download-pdf"]').first()
  if (MODE === 'print') {
    await page.evaluate(() => {
      window.print = () => {}
    })
    await button.click()
    await page.waitForTimeout(3000)
    await page.emulateMedia({ media: 'print' })
    await page.pdf({ path: `${OUT}/${name}-print.pdf`, preferCSSPageSize: true, printBackground: true })
  } else {
    const download = page.waitForEvent('download', { timeout: 120_000 })
    await button.click()
    await (await download).saveAs(`${OUT}/${name}-pdf.pdf`)
  }
}

test('compare - area report', async ({ page, loginPage, reportPage }) => {
  await reportPage.open(CANARY_ISLANDS_EEZ)
  await loginPage.login()
  await reportPage.loadVesselTable()
  await page.waitForTimeout(5000)
  await capture(page, 'report')
})

test('compare - vessel profile', async ({ page, loginPage, searchPage }) => {
  await page.goto(MAP_PATH)
  await loginPage.login()
  await searchPage.gotoWithQuery('GABU REEFER')
  await searchPage.expectResultsVisible()
  await page.getByTestId(VESSEL_PROFILE_LINK_TESTID).first().click()
  await page.waitForURL('**/vessel/**')
  await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible({ timeout: 60_000 })
  await page.waitForTimeout(10000)
  await capture(page, 'vessel')
})
