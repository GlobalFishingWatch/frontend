import type { Locator, Page } from 'playwright/test'

import { expect, test } from '../fixtures'
import { MAP_PATH } from '../paths'
import { TAGS } from '../tags'

const panel = (page: Page, id: string) => page.locator(`[data-test="activity-layer-panel-${id}"]`)

const minThumb = (layer: Locator) => layer.getByRole('slider', { name: 'Min' })
const brushedArea = (layer: Locator) => layer.getByRole('button', { name: 'Filter values' })

// The brush only renders once the 4wings tiles have produced a colour domain
async function waitForBrush(layer: Locator) {
  await expect(minThumb(layer)).toBeVisible({ timeout: 60000 })
}

test.beforeEach(async ({ page }) => {
  await page.goto(MAP_PATH)
  await page.waitForLoadState('networkidle')
})

test(
  'LegendBrush01 - filters a single activity layer without touching its siblings',
  { tag: [TAGS.EXTENDED] },
  async ({ page }) => {
    const ais = panel(page, 'ais')
    const vms = panel(page, 'vms')
    await waitForBrush(ais)
    await waitForBrush(vms)

    // focus() rather than click(): react aria renders the thumb input visually hidden at 1px,
    // so a real click lands on the legend row painted over it
    await minThumb(ais).focus()
    await page.keyboard.press('ArrowRight')

    // Stored on the ais dataview only, so a reload restores exactly this state
    await page.waitForURL('**minVisibleValue**')
    expect(page.url()).toContain('%5Bid%5D=ais')

    await expect(brushedArea(ais)).toBeVisible()
    await expect(brushedArea(vms)).toBeHidden()
    await expect(ais.getByText('VISIBLE VALUES')).toBeVisible()

    // The legend must survive the commit, it used to blink out and never come back
    await expect(minThumb(ais)).toBeVisible()
    await expect(minThumb(vms)).toBeVisible()
  }
)

test(
  'LegendBrush02 - survives a reload and clears without leaving params behind',
  { tag: [TAGS.EXTENDED] },
  async ({ page }) => {
    const ais = panel(page, 'ais')
    await waitForBrush(ais)

    // focus() rather than click(): react aria renders the thumb input visually hidden at 1px,
    // so a real click lands on the legend row painted over it
    await minThumb(ais).focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForURL('**minVisibleValue**')
    const filteredUrl = page.url()

    await page.reload()
    await page.waitForLoadState('networkidle')
    await waitForBrush(ais)
    await expect(brushedArea(ais)).toBeVisible()
    expect(page.url()).toBe(filteredUrl)

    await brushedArea(ais).click()
    await page.getByLabel('Remove value filter').click()

    await expect(brushedArea(ais)).toBeHidden()
    await expect(ais.getByText('VISIBLE VALUES')).toBeHidden()
    expect(page.url()).not.toContain('minVisibleValue')
    expect(page.url()).not.toContain('maxVisibleValue')
  }
)

test(
  'LegendBrush03 - accepts an exact bound typed into the popover',
  { tag: [TAGS.EXTENDED] },
  async ({ page }) => {
    const ais = panel(page, 'ais')
    await waitForBrush(ais)

    // focus() rather than click(): react aria renders the thumb input visually hidden at 1px,
    // so a real click lands on the legend row painted over it
    await minThumb(ais).focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForURL('**minVisibleValue**')

    await brushedArea(ais).click()
    // Typed bounds are not snapped to the ramp breaks, unlike dragging
    await page.getByLabel('Max', { exact: true }).fill('5000')
    await page.keyboard.press('Enter')

    await page.waitForURL('**maxVisibleValue**')
    expect(decodeURIComponent(page.url())).toContain('[maxVisibleValue]=5000')
  }
)
