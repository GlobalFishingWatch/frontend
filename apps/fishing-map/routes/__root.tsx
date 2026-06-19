/// <reference types="vite/client" />

import type { ReactNode } from 'react'
import { Suspense } from 'react'
import robotoLatin400 from '@fontsource/roboto/files/roboto-latin-400-normal.woff2?url'
import robotoLatin500 from '@fontsource/roboto/files/roboto-latin-500-normal.woff2?url'
// import { TanStackDevtools } from '@tanstack/react-devtools'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import {
  createRootRoute,
  getRouteApi,
  HeadContent,
  Outlet,
  redirect,
  Scripts,
} from '@tanstack/react-router'

import type { UserData } from '@globalfishingwatch/api-types'

import { ROOT_DOM_ELEMENT } from 'data/config'
import { RouterErrorBoundary } from 'features/app/ErrorBoundaryRouter'
import { reportRouteError } from 'features/app/sentry'
import { getLoadedI18nState, t } from 'features/i18n/i18n'
import { toDocumentLang } from 'features/i18n/i18n.config'
import type { I18nServerState } from 'features/i18n/i18n-state.utils'
import { I18nSSRProvider } from 'features/i18n/I18nSSRProvider'
import { getDefaultMeta } from 'router/router.meta'

import appCss from './styles.css?url'

const GOOGLE_TAG_MANAGER_ID = import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID as string

const defaultDescription =
  'The Global Fishing Watch map is the first open-access platform for visualization and analysis of marine traffic and vessel-based human activity at sea.'

type PanelWidthsState = {
  asideWidthPct: number | null
  contentPanelWidth: number | null
  screenWidth: number | null
}

const EMPTY_PANEL_WIDTHS: PanelWidthsState = {
  asideWidthPct: null,
  contentPanelWidth: null,
  screenWidth: null,
}

async function loadI18nState(): Promise<I18nServerState> {
  if (!import.meta.env.SSR) {
    const clientI18nState = getLoadedI18nState()
    if (clientI18nState) {
      return clientI18nState
    }
  }
  const { getI18nState } = await import('server-functions/i18n-state.functions')
  return (await getI18nState()) as I18nServerState
}

async function loadPanelWidths() {
  if (!import.meta.env.SSR) {
    return EMPTY_PANEL_WIDTHS
  }
  const { getSidebarWidthState } = await import('server-functions/screen-size.functions')
  return getSidebarWidthState()
}

async function loadUser(): Promise<{ user: UserData | null }> {
  if (!import.meta.env.SSR) {
    return { user: null as UserData | null }
  }
  const { getUserState } = await import('server-functions/user.functions')
  return getUserState()
}

const rootRouteApi = getRouteApi('__root__')

function RootDocument({ children, lang = 'en' }: Readonly<{ children: ReactNode; lang: string }>) {
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <div id={ROOT_DOM_ELEMENT}>{children}</div>
        <Scripts />
        {GOOGLE_TAG_MANAGER_ID && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
                <iframe src="https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}

function RootComponent() {
  const { i18nState } = rootRouteApi.useLoaderData() ?? {}

  // Tests render RouterProvider inside a DOM container — skip <html>/<body> wrapper.
  if (import.meta.env.VITEST) {
    return (
      <Suspense fallback={null}>
        <I18nSSRProvider>
          <Outlet />
        </I18nSSRProvider>
      </Suspense>
    )
  }

  return (
    <RootDocument lang={toDocumentLang(i18nState?.initialLanguage)}>
      <Suspense fallback={null}>
        <I18nSSRProvider>
          <Outlet />
        </I18nSSRProvider>
      </Suspense>
      {/* {import.meta.env.DEV && (
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      )} */}
    </RootDocument>
  )
}

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/index') {
      throw redirect({ to: '/', search: location.search })
    }
  },
  errorComponent: ({ error }) => (
    <RootDocument lang="en">
      <RouterErrorBoundary error={error as Error} />
    </RootDocument>
  ),
  loader: async () => {
    const [i18nState, panelWidths, userState] = await Promise.all([
      loadI18nState(),
      loadPanelWidths().catch(() => EMPTY_PANEL_WIDTHS),
      loadUser().catch(() => ({ user: null })),
    ])
    return {
      i18nState,
      asideWidthPct: panelWidths.asideWidthPct,
      contentPanelWidth: panelWidths.contentPanelWidth,
      screenWidth: panelWidths.screenWidth,
      user: userState.user,
    }
  },
  onError: (err) => {
    reportRouteError(err, 'router-loader')
  },
  staleTime: Number.POSITIVE_INFINITY,
  preloadStaleTime: Number.POSITIVE_INFINITY,
  gcTime: Number.POSITIVE_INFINITY,
  shouldReload: false,
  head: () => {
    const title = `GFW | ${t((s) => s.common.map)}`
    const description = t((s) => s.workspace.siteDescription.default) || defaultDescription
    const meta = getDefaultMeta(title, description)
    meta.links.unshift(
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: robotoLatin400,
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: robotoLatin500,
        crossOrigin: 'anonymous',
      }
    )
    return meta
  },

  component: RootComponent,
})
