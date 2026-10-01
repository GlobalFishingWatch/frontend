import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useReplaceQueryParams } from 'router/routes.hook'
import type { QueryParams, SidePanelContent, SidePanelState } from 'types'

export type SidePanelTarget =
  | { type: 'userGuide'; id?: string; subcontentId?: string }
  | { type: 'datasets'; id: string; subcontentId?: string }
  | { type: 'userDataset'; id: string; subcontentId?: string }
  | { type: 'dataTerminology'; id: string; subcontentId?: string }
  | { type: 'chat'; id?: string; subcontentId?: string }

type SidePanelSearch = Pick<QueryParams, 'sidePanels' | 'sidePanelActive'>

/** Opens (or updates) a panel as a tab, keeping every other open panel. One tab per type. */
export function withSidePanel(search: SidePanelSearch, panel: SidePanelTarget): SidePanelSearch {
  const sidePanels = search.sidePanels ?? []
  const next = { type: panel.type, id: panel.id, subcontentId: panel.subcontentId }
  const exists = sidePanels.some((p) => p.type === panel.type)
  return {
    sidePanels: exists
      ? sidePanels.map((p) => (p.type === panel.type ? next : p))
      : [...sidePanels, next],
    sidePanelActive: panel.type,
  }
}

const CLOSED_SIDE_PANELS: SidePanelSearch = {
  sidePanels: undefined,
  sidePanelActive: undefined,
}

function withoutSidePanel(search: SidePanelSearch, type: SidePanelContent): SidePanelSearch {
  const sidePanels = (search.sidePanels ?? []).filter((p) => p.type !== type)
  if (!sidePanels.length) return CLOSED_SIDE_PANELS
  return {
    sidePanels,
    sidePanelActive:
      search.sidePanelActive === type ? sidePanels.at(-1)?.type : search.sidePanelActive,
  }
}

export function useSidePanel() {
  const { replaceQueryParams } = useReplaceQueryParams()

  const openSidePanel = useCallback(
    (panel: SidePanelTarget) => {
      if (!panel) return
      replaceQueryParams((prev) => withSidePanel(prev, panel))
    },
    [replaceQueryParams]
  )

  const closeSidePanel = useCallback(
    (type: SidePanelContent) => replaceQueryParams((prev) => withoutSidePanel(prev, type)),
    [replaceQueryParams]
  )

  const closeAllSidePanels = useCallback(
    () => replaceQueryParams(CLOSED_SIDE_PANELS),
    [replaceQueryParams]
  )

  const setActiveSidePanel = useCallback(
    (type: SidePanelContent) => replaceQueryParams({ sidePanelActive: type }),
    [replaceQueryParams]
  )

  return useMemo(
    () => ({
      openSidePanel,
      closeSidePanel,
      closeAllSidePanels,
      setActiveSidePanel,
    }),
    [openSidePanel, closeSidePanel, closeAllSidePanels, setActiveSidePanel]
  )
}

export const SidePanelContext = createContext<SidePanelState | null>(null)

/** The panel currently being rendered: its type, id and subcontentId */
export function useSidePanelItem() {
  const item = useContext(SidePanelContext)
  if (!item) throw new Error('useSidePanelItem must be used inside a SidePanelContext provider')
  return item
}

export function useSidePanelLabel() {
  const { t } = useTranslation()
  return (type: SidePanelContent) => {
    if (type === 'userGuide') return t((t) => t.common.userGuide)
    if (type === 'chat') return t((t) => t.common.assistant)
    if (type === 'dataTerminology') return t((t) => t.common.dataTerminology)
    return t((t) => t.dataset.title)
  }
}

export function useScrollToTopOnChange<T extends HTMLElement>(dependency: unknown) {
  const ref = useRef<T>(null)
  useEffect(() => {
    ref.current?.scrollTo({ top: 0 })
  }, [dependency])
  return ref
}
