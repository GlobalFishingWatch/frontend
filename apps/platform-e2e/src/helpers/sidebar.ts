import type { Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { TIMEOUTS } from './timeouts'

export const ACTIVITY_LAYERS = {
  AIS: 'activity-layer-panel-switch-ais',
  VMS: 'activity-layer-panel-switch-vms',
  PRESENCE: 'activity-layer-panel-switch-presence',
}

export const REFERENCE_LAYERS = {
  EEZ: 'context-layer-context-layer-eez',
}

async function setLayer(page: Page, layer: string, on: boolean) {
  const layerSwitch = page.getByTestId(layer)
  await expect(layerSwitch).toBeVisible({ timeout: TIMEOUTS.LONG })

  if ((await layerSwitch.getAttribute('aria-checked')) !== String(on)) {
    await layerSwitch.click()
  }
  await expect(layerSwitch).toHaveAttribute('aria-checked', String(on))
}

export async function waitForLayerLoaded(page: Page, layer: string) {
  const layerPanel = page.locator('[class*="LayerPanel"]', { has: page.getByTestId(layer) })
  await expect(layerPanel.locator('svg[class*="spinner"]')).toHaveCount(0, {
    timeout: TIMEOUTS.LONG,
  })
}

export async function toggleOnLayer(page: Page, layer: string) {
  await setLayer(page, layer, true)
  await waitForLayerLoaded(page, layer)
}

export async function toggleOffAllLayers(page: Page, layers: Record<string, string>) {
  for (const layer of Object.values(layers)) {
    await setLayer(page, layer, false)
  }
}

export async function toggleOnlyLayer(page: Page, layers: Record<string, string>, layer: string) {
  await toggleOffAllLayers(page, layers)
  await toggleOnLayer(page, layer)
}
