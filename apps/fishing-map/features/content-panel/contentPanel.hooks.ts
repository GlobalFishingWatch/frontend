import { useCallback, useMemo } from 'react'

import { useReplaceQueryParams } from 'router/routes.hook'

type SidePanelTarget =
  | { type: 'userGuide'; id?: string; subcontentId?: string }
  | { type: 'datasets'; id: string }

export function useSidePanel() {
  const { replaceQueryParams } = useReplaceQueryParams()

  const openSidePanel = useCallback(
    (panel: SidePanelTarget) =>
      replaceQueryParams({
        sidePanelContent: panel.type,
        sidePanelId: panel.id,
        sidePanelSubcontentId: panel.type === 'userGuide' ? panel.subcontentId : undefined,
      }),
    [replaceQueryParams]
  )

  const closeSidePanel = useCallback(
    () =>
      replaceQueryParams({
        sidePanelContent: undefined,
        sidePanelId: undefined,
        sidePanelSubcontentId: undefined,
      }),
    [replaceQueryParams]
  )

  return useMemo(
    () => ({ openSidePanel, closeSidePanel }),
    [openSidePanel, closeSidePanel]
  )
}
