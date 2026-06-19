import type i18next from 'i18next'
import { AsyncLocalStorage } from 'node:async_hooks'

import { __setServerI18nAccessor } from 'features/i18n/i18n'

import { createI18nForLanguage, createRequestI18n, FALLBACK_LNG } from './i18n.server'

type I18nInstance = typeof i18next

// Per-request i18next instance. The server handles many requests concurrently on one process,
// so the request language can't live on a shared module singleton. AsyncLocalStorage scopes the
// instance to one request's async call chain — readable from deep, non-React code (redux
// selectors, utils) without threading it through every call. See features/i18n/i18n.ts.
const als = new AsyncLocalStorage<I18nInstance>()

let fallbackInstance: I18nInstance | null = null
function getFallbackInstance(): I18nInstance {
  if (!fallbackInstance) {
    fallbackInstance = createI18nForLanguage(FALLBACK_LNG)
  }
  return fallbackInstance
}

export function runWithI18n<T>(instance: I18nInstance, fn: () => T): T {
  return als.run(instance, fn)
}

export function runRequestWithI18n<T>(request: Request, fn: () => T): T {
  return als.run(createRequestI18n(request), fn)
}

export function getRequestI18n(): I18nInstance {
  return als.getStore() ?? getFallbackInstance()
}
__setServerI18nAccessor(getRequestI18n)
