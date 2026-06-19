import type i18next from 'i18next'

import { FALLBACK_LNG, normalizeI18nLanguage } from './i18n.config'

export type I18nServerState = {
  initialI18nStore: Record<string, Record<string, Record<string, unknown>>>
  initialLanguage: string
}

export function isValidI18nServerState(state: unknown): state is I18nServerState {
  if (state == null || typeof state !== 'object') {
    return false
  }
  const { initialLanguage, initialI18nStore } = state as I18nServerState
  if (typeof initialLanguage !== 'string' || !initialLanguage.length) {
    return false
  }
  const normalizedLanguage = normalizeI18nLanguage(initialLanguage)
  return (
    normalizedLanguage.length > 0 &&
    initialI18nStore != null &&
    typeof initialI18nStore === 'object' &&
    initialI18nStore[normalizedLanguage] != null
  )
}

export function normalizeI18nServerState(state: I18nServerState): I18nServerState {
  return {
    initialLanguage: normalizeI18nLanguage(state.initialLanguage),
    initialI18nStore: state.initialI18nStore,
  }
}

export function serializeI18nState(instance: typeof i18next): I18nServerState {
  const initialLanguage = instance.resolvedLanguage || instance.language
  const initialI18nStore: I18nServerState['initialI18nStore'] = {}
  for (const lng of new Set([initialLanguage, FALLBACK_LNG])) {
    const data = instance.services.resourceStore.data[lng]
    if (data) {
      initialI18nStore[lng] = data as Record<string, Record<string, unknown>>
    }
  }
  return {
    initialI18nStore,
    initialLanguage,
  }
}
