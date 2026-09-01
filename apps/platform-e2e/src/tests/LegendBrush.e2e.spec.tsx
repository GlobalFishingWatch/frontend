import type { Locator, Page } from 'playwright/test'

import { expect, test } from '../fixtures'
import { MAP_PATH } from '../paths'
import { TAGS } from '../tags'

const panel = (page: Page, id: string) => page.locator(`[data-test="activity-layer-panel-${id}"]`)

const brush = (layer: Locator) => layer.locator('[data-test="color-ramp-brush"]')
// By position rather than by accessible name: the brush labels live in source/translations.json
// and Crowdin has not filled `en` yet, so their accessible names are still the raw i18n keys
const minHandle = (layer: Locator) => brush(layer).getByRole('slider').first()
const maxHandle = (layer: Locator) => brush(layer).getByRole('slider').last()
const boundInput = (page: Page) => page.locator('input[type="number"]')
const removeBound = (page: Page) => page.getByTestId('color-ramp-brush-remove')

// The brush only renders once the 4wings tiles have produced a colour domain
async function waitForBrush(layer: Locator) {
  await expect(brush(layer)).toBeVisible({ timeout: 60000 })
}

/** Paints a selection over the middle of the ramp, the way a user drags it */
async function dragSelection(page: Page, layer: Locator, from = 0.3, to = 0.7) {
  const box = await brush(layer).boundingBox()
  if (!box) throw new Error('brush has no box')
  const y = box.y + box.height / 2
  await page.mouse.move(box.x + box.width * from, y)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * to, y, { steps: 10 })
  await page.mouse.up()
}

test.beforeEach(async ({ page }) => {
  await page.goto(MAP_PATH)
  await page.waitForLoadState('networkidle')
})

test(
  'LegendBrush01 - a drag filters a single activity layer without touching its siblings',
  { tag: [TAGS.EXTENDED] },
  async ({ page }) => {
    const ais = panel(page, 'ais')
    const vms = panel(page, 'vms')
    await waitForBrush(ais)
    await waitForBrush(vms)

    await dragSelection(page, ais)

    // Both handles land away from the ramp edges, so both bounds are set
    await page.waitForURL('**minVisibleValue**')
    const url = decodeURIComponent(page.url())
    expect(url).toContain('[id]=ais')
    expect(url).toContain('maxVisibleValue')

    // Stored on the ais dataview only
    await expect(ais.getByText('VISIBLE VALUES')).toBeVisible()
    await expect(vms.getByText('VISIBLE VALUES')).toBeHidden()

    // The legend must survive the commit, it used to blink out and never come back
    await expect(brush(ais)).toBeVisible()
    await expect(brush(vms)).toBeVisible()
  }
)

test(
  'LegendBrush02 - handles are draggable and an edge drop clears that bound',
  { tag: [TAGS.EXTENDED] },
  async ({ page }) => {
    const ais = panel(page, 'ais')
    await waitForBrush(ais)
    await dragSelection(page, ais)
    await page.waitForURL('**maxVisibleValue**')

    // Dragging the max handle onto the right edge means "no upper bound"
    const box = await brush(ais).boundingBox()
    if (!box) throw new Error('brush has no box')
    await maxHandle(ais).hover()
    await page.mouse.down()
    await page.mouse.move(box.x + box.width, box.y + box.height / 2, { steps: 10 })
    await page.mouse.up()

    await expect
      .poll(() => decodeURIComponent(page.url()).includes('maxVisibleValue'))
      .toBe(false)
    expect(decodeURIComponent(page.url())).toContain('minVisibleValue')
  }
)

test(
  'LegendBrush03 - survives a reload, and the handle popover edits then clears one bound',
  { tag: [TAGS.EXTENDED] },
  async ({ page }) => {
    const ais = panel(page, 'ais')
    await waitForBrush(ais)
    await dragSelection(page, ais)
    await page.waitForURL('**minVisibleValue**')
    const filteredUrl = page.url()

    await page.reload()
    await page.waitForLoadState('networkidle')
    await waitForBrush(ais)
    expect(page.url()).toBe(filteredUrl)

    // Clicking a handle opens the fine tune popover for that bound only.
    // Typed values are committed as entered, never snapped to a ramp break
    await maxHandle(ais).click()
    await boundInput(page).fill('5000')
    await page.keyboard.press('Enter')
    await expect.poll(() => decodeURIComponent(page.url())).toContain('[maxVisibleValue]=5000')

    await maxHandle(ais).click()
    await removeBound(page).click()

    await expect.poll(() => decodeURIComponent(page.url()).includes('maxVisibleValue')).toBe(false)
    // The min bound is untouched, so the layer is still filtered
    await expect(ais.getByText('VISIBLE VALUES')).toBeVisible()
  }
)

test(
  'LegendBrush04 - arrow keys move a focused handle',
  { tag: [TAGS.EXTENDED] },
  async ({ page }) => {
    const ais = panel(page, 'ais')
    await waitForBrush(ais)

    await minHandle(ais).focus()
    await page.keyboard.press('ArrowRight')

    await page.waitForURL('**minVisibleValue**')
    expect(decodeURIComponent(page.url())).toContain('[id]=ais')
  }
)
