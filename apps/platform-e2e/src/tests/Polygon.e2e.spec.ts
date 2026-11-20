import {
  DRAW_LAYER_NAME_INPUT_TESTID,
  DRAW_POLYGON_BUTTON_TESTID,
  DRAW_SAVE_BUTTON_TESTID,
} from '@platform/config/selectors/map'
import {
  getDeleteDatasetTestId,
  USER_DATASETS_SPINNER_TESTID,
  USER_DATASETS_TAB_TESTID,
} from '@platform/config/selectors/user'

import { expect, test } from '../fixtures'
import type { CreatedDataset } from '../helpers/datasets'
import { deleteDatasetThroughApi, waitForDatasetCreated } from '../helpers/datasets'
import { TIMEOUTS } from '../helpers/timeouts'
import { MAP_PATH } from '../paths'
import { TAGS } from '../tags'

// Moved here from the platform integration specs (Polygon.spec.tsx): saving creates a real dataset
// (POST /uploads, POST /datasets), which the recorded-response replay never forwards.
test(
  'Polygon - draw a new polygon, see it in the map and delete it',
  { tag: [TAGS.EXTENDED] },
  async ({ page, loginPage, mapPage }) => {
    // The dataset id is `<kebab-case name>-<timestamp>`; a unique name keeps a leftover from a
    // failed run out of this run's assertions
    const layerName = `E2E polygon ${Date.now()}`
    let dataset: CreatedDataset | undefined
    let deletedFromUi = false

    try {
      await page.goto(MAP_PATH)
      // drawing is only enabled for logged-in users
      await loginPage.login()

      await page.getByTestId(DRAW_POLYGON_BUTTON_TESTID).click()
      const nameInput = page.getByTestId(DRAW_LAYER_NAME_INPUT_TESTID)
      await expect(nameInput).toBeVisible()

      await mapPage.drawTriangle()
      await nameInput.fill(layerName)

      // disabled until a closed polygon and a valid name exist
      const saveButton = page.getByTestId(DRAW_SAVE_BUTTON_TESTID)
      await expect(saveButton).toBeEnabled()
      const created = waitForDatasetCreated(page)
      await saveButton.click()
      dataset = await created
      const datasetId = dataset.id

      // The saved polygon is added to the workspace as a new layer
      await expect(page.getByText(layerName).first()).toBeVisible({ timeout: TIMEOUTS.LONG })

      await loginPage.openUserPanel()
      await page.getByTestId(USER_DATASETS_TAB_TESTID).click()
      await expect(page.getByTestId(USER_DATASETS_SPINNER_TESTID)).toBeHidden({
        timeout: TIMEOUTS.MEDIUM,
      })

      const deleteButton = page.getByTestId(getDeleteDatasetTestId(datasetId))
      await expect(deleteButton).toBeVisible({ timeout: TIMEOUTS.MEDIUM })

      // the delete button asks with window.confirm
      page.once('dialog', (dialog) => dialog.accept())
      const deleted = page.waitForResponse(
        (r) =>
          r.request().method() === 'DELETE' &&
          new URL(r.url()).pathname.endsWith(`/datasets/${datasetId}`)
      )
      await deleteButton.click()
      expect((await deleted).ok()).toBe(true)
      deletedFromUi = true

      await expect(deleteButton).toHaveCount(0)
    } finally {
      if (dataset && !deletedFromUi) {
        await deleteDatasetThroughApi(page, dataset)
      }
    }
  }
)
