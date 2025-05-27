import { DEFAULT_TIME_RANGE } from 'data/config'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import type { AnyWorkspaceState } from 'types'

import type { ConfigurationParams } from './types'

export const DEFAULT_WORKSPACE = `fishing-activity/${DEFAULT_WORKSPACE_ID}`

export function getSharedWorkspaceParams(
  { start_date, end_date, area } = {} as ConfigurationParams
) {
  const params: AnyWorkspaceState = {
    start: start_date || DEFAULT_TIME_RANGE.start,
    end: end_date || DEFAULT_TIME_RANGE.end,
    ...(area?.buffer && {
      reportBufferValue: 50,
      reportBufferUnit: 'nauticalmiles',
      reportBufferOperation: 'dissolve',
    }),
  }
  return params
}
