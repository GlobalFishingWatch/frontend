import { createAction } from '@reduxjs/toolkit'

/**
 * Lives outside reports-activity.slice because importing that slice injects it (`rootReducer.inject`)
 * and pulls its graph. Pages outside /map, like NavigationHistoryButton on /areas, dispatch this
 * without loading the slice; when the slice is not injected yet there is nothing to reset.
 * Same pattern as features/nav/nav.actions.ts.
 */
export const resetReportData = createAction('report/resetReportData')
