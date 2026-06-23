import type i18next from 'i18next'
import { AsyncLocalStorage } from 'node:async_hooks'

import { __setServerI18nAccessor } from 'features/i18n/i18n'
import { FALLBACK_LNG } from 'features/i18n/i18n.config'

import {
  createI18nForLanguage,
  createRequestI18n,
  loadServerPackageNamespaces,
} from './i18n.server'

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

export async function runRequestWithI18n<T>(request: Request, fn: () => T): Promise<Awaited<T>> {
  const instance = createRequestI18n(request)
  // Load CDN-only package namespaces (e.g. flags) before render so SSR resolves their values
  await loadServerPackageNamespaces(instance, instance.language)
  return await als.run(instance, fn)
}

export function getRequestI18n(): I18nInstance {
  return als.getStore() ?? getFallbackInstance()
}

__setServerI18nAccessor(getRequestI18n)
