/// <reference types="vite/client" />
import * as React from 'react'
import { createRootRoute, HeadContent, Link, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { DefaultCatchBoundary } from '@/features/router/DefaultCatchBoundary'
import { NotFound } from '@/features/router/NotFound'
import appCss from '@/styles/app.css?url'
import baseCss from '@/styles/base.css?url'
import { seo } from '@/utils/seo'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: baseCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{' '}
          <Link
            to="/vessels"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Vessels
          </Link>
          <Link
            to="/ports"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Ports
          </Link>
          <Link
            to="/map/$"
            params={{
              _splat: '/marine-manager',
            }}
            search={{
              latitude: 30,
              longitude: 0,
              zoom: 4,
            }}
            activeProps={{
              className: 'font-bold',
            }}
          >
            Fishing Map
          </Link>
        </div>
        <hr />
        <div id="__next">{children}</div>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
