/// <reference types="vite/client" />

import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'

import { ROOT_DOM_ELEMENT } from 'data/config'

import appCss from './styles.css?url'

// Inline env values to avoid importing data/config which transitively
// pulls in heavy visualization libraries incompatible with Vite's SSR Module Runner
const PATH_BASENAME = (import.meta.env.NEXT_PUBLIC_URL as string) || '/map'
const GOOGLE_TAG_MANAGER_ID = import.meta.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string

const defaultDescription =
  'The Global Fishing Watch map is the first open-access platform for visualization and analysis of marine traffic and vessel-based human activity at sea.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      { title: 'GFW | Map' },
      {
        property: 'og:description',
        content: defaultDescription,
      },
      {
        name: 'twitter:description',
        content: defaultDescription,
      },
      {
        name: 'description',
        content: defaultDescription,
      },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'theme-color', content: '#163f89' },
      { name: 'application-name', content: 'GFW Fishing map' },
      { name: 'referrer', content: 'no-referrer-when-downgrade' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'GFW Fishing map' },
      { name: 'msapplication-TileColor', content: '#fff' },
      { name: 'msapplication-TileImage', content: 'icons/mstile-144x144.png' },
      { name: 'msapplication-config', content: 'icons/browserconfig.xml' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: 'https://globalfishingwatch.org/map' },
      { rel: 'shortcut icon', href: `${PATH_BASENAME}/icons/favicon.ico` },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: `${PATH_BASENAME}/icons/favicon-16x16.png`,
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `${PATH_BASENAME}/icons/favicon-32x32.png`,
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: `${PATH_BASENAME}/icons/favicon-48x48.png`,
      },
      { rel: 'manifest', href: `${PATH_BASENAME}/icons/manifest.webmanifest` },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com/' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com/',
        crossOrigin: 'anonymous',
      },
      {
        href: 'https://fonts.googleapis.com/css?family=Roboto:400,500&display=swap',
        rel: 'stylesheet',
        media: 'print',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        href: `${PATH_BASENAME}/icons/apple-touch-icon-120x120.png`,
      },
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: `${PATH_BASENAME}/icons/apple-touch-icon-152x152.png`,
      },
      {
        rel: 'apple-touch-icon',
        sizes: '1024x1024',
        href: `${PATH_BASENAME}/icons/apple-touch-icon-1024x1024.png`,
      },
    ],
  }),
  component: RootComponent,
})

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
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
        <div id={ROOT_DOM_ELEMENT}>{children}</div>
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <RootDocument>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </RootDocument>
  )
}
