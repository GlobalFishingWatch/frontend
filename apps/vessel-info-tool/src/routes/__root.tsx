import * as React from 'react'
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import Header from '@/features/header/Header'
import OptionsMenu from '@/features/options/OptionsMenu'
import Profile from '@/features/profile/Profile'
import Search from '@/features/search/Search'

import { DefaultCatchBoundary } from '@/features/router/DefaultCatchBoundary'
import { NotFound } from '@/features/router/NotFound'
import appCss from '@/styles/app.css?url'
import baseCss from '@/styles/base.css?url'
import { getCurrentUserFn } from '@/server/auth'

export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await getCurrentUserFn()

    return {
      user,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      // title: 'Interoperability tool | Vessel info tool',
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
  const context = Route.useRouteContext()
  const user = context.user

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="root">
          {user ? (
            <Header>
              <OptionsMenu />
              <Profile user={user} />
            </Header>
          ) : null}
          {children}
        </div>
        <Scripts />
      </body>
    </html>
  )
}
