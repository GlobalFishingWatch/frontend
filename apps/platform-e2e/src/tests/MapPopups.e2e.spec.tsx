import { expect, test } from '../fixtures'
import { clickMapUntilVisible } from '../helpers/map'
import { MAP_PATH } from '../paths'
import { TAGS } from '../tags'

// LayerSwitch testId is `context-layer-${dataview.id}` and the EEZ instance id
// is already prefixed with `context-layer-`
const EEZ_SWITCH = '[data-testid="context-layer-context-layer-eez"]'
const VMS_SWITCH = '[data-testid="activity-layer-panel-switch-vms"]'
// Coastal waters off Brazil, always inside an EEZ and with fishing activity
const MAP_VIEW = '?latitude=-27&longitude=-46&zoom=5'
const MAP_POINT = { x: 440, y: 300 }

test(`MapPopups01 - popup content follows context layer visibility ${TAGS.EXTENDED}`, async ({
  page,
}) => {
  await page.goto(`${MAP_PATH}${MAP_VIEW}`)
  await page.waitForLoadState('networkidle')

  const eezSwitch = page.locator(EEZ_SWITCH)
  await expect(eezSwitch).toBeVisible()
  if ((await eezSwitch.getAttribute('aria-checked')) !== 'true') {
    await eezSwitch.click()
  }

  const eezSection = page.locator('#map-container').getByText('EEZs')
  await clickMapUntilVisible(page, MAP_POINT, eezSection)

  // Hiding the layer removes its section from the popup already open
  await eezSwitch.click()
  await expect(eezSection).toBeHidden()

  // And showing it again brings it back, even though it was hidden when the map was clicked
  await eezSwitch.click()
  await expect(eezSection).toBeVisible()
})

test(`MapPopups02 - popup content follows activity layer visibility ${TAGS.EXTENDED}`, async ({
  page,
}) => {
  await page.goto(`${MAP_PATH}${MAP_VIEW}`)
  await page.waitForLoadState('networkidle')

  // activity dataviews are merged in a single deck layer, so its id changes on every toggle
  const vmsSection = page.locator('#map-container').getByText('Apparent fishing effort (VMS)')
  await clickMapUntilVisible(page, MAP_POINT, vmsSection)

  const vmsSwitch = page.locator(VMS_SWITCH)
  await vmsSwitch.click()
  await expect(vmsSection).toBeHidden()

  await vmsSwitch.click()
  await expect(vmsSection).toBeVisible()

  // the layer name toggles the visibility too
  const vmsTitle = page.locator('[data-layer-toggle]', {
    hasText: 'Apparent fishing effort (VMS)',
  })
  await vmsTitle.click()
  await expect(vmsSection).toBeHidden()

  await vmsTitle.click()
  await expect(vmsSection).toBeVisible()

  // a layer hidden when the map was clicked is added to the popup, without duplicating the rest
  const presenceTitle = page.locator('[data-layer-toggle]', { hasText: 'Vessel presence' })
  await presenceTitle.click()
  await expect(page.locator('#map-container').getByText('Vessel presence')).toBeVisible()
  await expect(vmsSection).toHaveCount(1)
})
