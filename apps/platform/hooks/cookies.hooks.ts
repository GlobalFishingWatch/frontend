import { useCallback } from 'react'

import { readDocumentCookie, writeDocumentCookieJSON } from '@globalfishingwatch/api-client'

import { PANEL_WIDTHS_COOKIE_KEY, type PanelWidths } from 'features/app/app.config'

export function usePersistedPanelWidth(field: keyof PanelWidths) {
  return useCallback(
    (value: number) => {
      // read-modify-write so concurrent field writes don't clobber each other
      const current =
        readDocumentCookie<PanelWidths>({ key: PANEL_WIDTHS_COOKIE_KEY, type: 'object' }) ?? {}
      writeDocumentCookieJSON(PANEL_WIDTHS_COOKIE_KEY, { ...current, [field]: value })
    },
    [field]
  )
}
