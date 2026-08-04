import { createSelector } from '@reduxjs/toolkit'

import type { BufferOperation, BufferUnit } from '@globalfishingwatch/data-transforms'

import {
  selectUrlBufferOperationQuery,
  selectUrlBufferUnitQuery,
  selectUrlBufferValueQuery,
} from 'router/routes.selectors'

import {
  selectReportBufferOperationSelector,
  selectReportBufferUnitSelector,
  selectReportBufferValueSelector,
} from '../reports.config.selectors'

/**
 * The report buffer config, resolved workspace-state-first then URL.
 *
 * Split out of area-reports.selectors.ts, which imports deck-layer-composer, deck-layers, @turf/turf and
 * match-sorter. These three are the only thing app.workspace.selectors needs from there, and that module
 * is reached from MainNav — so importing them from area-reports.selectors put all four heavy packages in
 * the entry chunk of every page. area-reports.selectors re-exports them, so its other consumers are
 * unaffected.
 *
 * Keep this module's imports leaf-only (router + reports.config.selectors are both clean).
 */

export const selectReportBufferValue = createSelector(
  [selectReportBufferValueSelector, selectUrlBufferValueQuery],
  (workspaceBufferValue, urlBufferValue): number => {
    return workspaceBufferValue || urlBufferValue
  }
)

export const selectReportBufferUnit = createSelector(
  [selectReportBufferUnitSelector, selectUrlBufferUnitQuery],
  (workspaceBufferUnit, urlBufferUnit): BufferUnit => {
    return workspaceBufferUnit || urlBufferUnit
  }
)

export const selectReportBufferOperation = createSelector(
  [selectReportBufferOperationSelector, selectUrlBufferOperationQuery],
  (workspaceBufferOperation, urlBufferOperation): BufferOperation => {
    return workspaceBufferOperation || urlBufferOperation
  }
)
