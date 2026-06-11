import { useCallback, useEffect, useMemo, useRef } from 'react'

import { useReplaceQueryParams } from 'router/routes.hook'

type SidePanelTarget =
  | { type: 'userGuide'; id?: string; subcontentId?: string }
  | { type: 'datasets'; id: string; subcontentId?: string }
  | { type: 'userDataset'; id: string; subcontentId?: string }
  | { type: 'dataTerminology'; id: string; subcontentId?: string }

export function useSidePanel() {
  const { replaceQueryParams } = useReplaceQueryParams()

  const openSidePanel = useCallback(
    async (panel: SidePanelTarget) => {
      if (!panel) {
        return
      }
      replaceQueryParams({
        sidePanelContent: panel.type,
        sidePanelId: panel.id,
        sidePanelSubcontentId: panel.subcontentId,
      })
    },
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

  return useMemo(() => ({ openSidePanel, closeSidePanel }), [openSidePanel, closeSidePanel])
}

export function useScrollToTopOnChange<T extends HTMLElement>(dependency: unknown) {
  const ref = useRef<T>(null)
  useEffect(() => {
    ref.current?.scrollTo({ top: 0 })
  }, [dependency])
  return ref
}
