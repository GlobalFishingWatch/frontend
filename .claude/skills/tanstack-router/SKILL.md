---
name: tanstack-router
description: TanStack Router documentation for React. Reference when working with routing, navigation, search params, data loading, route trees, or any routing-related code.
---

# TanStack Router for React

## Overview

TanStack Router is a type-safe router for React applications. Key features:

- **100% inferred TypeScript support** with lossless type inference
- Nested and layout routing with pathless layout support
- Built-in route loaders with SWR (stale-while-revalidate) caching
- JSON-first search parameter state management with schema validation
- File-based or code-based route generation
- Automatic route prefetching and code splitting
- Search param middleware and route matching middleware

Install: `npm install @tanstack/react-router`

Requirements: React 18+, TypeScript 5.3+ recommended.

---

## Creating a Router

### Basic Setup

```tsx
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen' // file-based routing

const router = createRouter({
  routeTree,
})

// Register types for full type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return <RouterProvider router={router} />
}
```

### Router Options

```tsx
const router = createRouter({
  routeTree,
  defaultStaleTime: 10_000,        // Global stale time for loaders
  defaultPreloadStaleTime: 30_000,  // Stale time for preloaded data
  defaultPendingMs: 1000,           // Delay before showing pending UI
  defaultPendingMinMs: 500,         // Minimum pending display time
  defaultNotFoundComponent: () => <div>404 Not Found</div>,
  context: { /* initial context */ },
})
```

---

## Route Trees and Route Definitions

### File-Based Routing (Recommended)

File-based routing uses the filesystem to define routes. Requires bundler plugin (Vite, Rspack, Webpack, etc.).

#### File Naming Conventions

| Convention | Example File | Route Path | Description |
|---|---|---|---|
| `__root.tsx` | `__root.tsx` | N/A | Root route, must exist |
| `index.tsx` | `index.tsx` | `/` | Index route |
| Basic | `about.tsx` | `/about` | Static route |
| Dot nesting | `blog.post.tsx` | `/blog/post` | Nested via dots (flat) |
| Directory | `posts/index.tsx` | `/posts` | Nested via directories |
| Dynamic | `posts/$postId.tsx` | `/posts/$postId` | Dynamic segment |
| Splat | `files/$.tsx` | `/files/*` | Catch-all route |
| Pathless layout | `_layout/child.tsx` | `/child` | Layout without URL segment |
| Non-nested | `posts_.$postId.edit.tsx` | `/posts/$postId/edit` | Breaks out of parent nesting |
| Route groups | `(admin)/users.tsx` | `/users` | Organizational only, no URL effect |
| Excluded | `-components/` | N/A | Excluded from route tree |
| Escaped | `script[.]js.tsx` | `/script.js` | Escape special characters |

#### File Structure Example

```
routes/
  __root.tsx
  index.tsx
  about.tsx
  posts/
    index.tsx
    $postId.tsx
  posts.$postId.edit.tsx       # non-nested route
  settings/
    profile.tsx
    notifications.tsx
  _authenticated/              # pathless layout
    dashboard.tsx
  files/
    $.tsx                       # splat/catch-all
```

### Code-Based Routing

Use when you need programmatic control. Not recommended for most apps.

```tsx
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <div>
      <nav>{/* navigation */}</nav>
      <Outlet />
    </div>
  ),
})

// Child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>Home</div>,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: () => <div>About</div>,
})

const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts',
  component: () => <Outlet />,
})

const postRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '/$postId',
  component: PostComponent,
})

// Build the tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  postsRoute.addChildren([postRoute]),
])

const router = createRouter({ routeTree })
```

**Important:** Every non-root route needs `getParentRoute` for TypeScript type inference.

---

## Routing Concepts

### Dynamic Route Segments

Use `$` prefix to capture URL segments:

```tsx
// File: routes/posts/$postId.tsx
// Matches: /posts/123, /posts/abc
export const Route = createFileRoute('/posts/$postId')({
  component: PostComponent,
})

function PostComponent() {
  const { postId } = Route.useParams() // type-safe
  return <div>Post: {postId}</div>
}
```

### Splat / Catch-All Routes

Use standalone `$` to capture all remaining segments:

```tsx
// File: routes/files/$.tsx
// Matches: /files/any/path/here
export const Route = createFileRoute('/files/$')({
  component: () => {
    const { _splat } = Route.useParams()
    // _splat = "any/path/here"
    return <div>File: {_splat}</div>
  },
})
```

### Optional Parameters

Use `{-$paramName}` syntax:

```tsx
// Matches both /posts and /posts/tech
export const Route = createFileRoute('/posts/{-$category}')({
  component: () => {
    const { category } = Route.useParams() // category?: string
    return <div>{category ?? 'All Posts'}</div>
  },
})
```

### Pathless Layout Routes

Wrap child routes with shared UI without adding URL segments. Prefix with `_`:

```tsx
// File: routes/_authenticated.tsx (no URL segment)
export const Route = createFileRoute('/_authenticated')({
  component: () => (
    <div className="authenticated-layout">
      <Sidebar />
      <Outlet />
    </div>
  ),
})

// File: routes/_authenticated/dashboard.tsx
// URL: /dashboard (not /_authenticated/dashboard)
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})
```

### Index Routes

Match when parent URL matches exactly with no child:

```tsx
// File: routes/posts/index.tsx
// Matches: /posts (exactly)
export const Route = createFileRoute('/posts/')({
  component: PostsList,
})
```

---

## Outlets

The `<Outlet />` component renders the next matching child route. Fundamental for nested layouts.

```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div>
      <header><h1>My App</h1></header>
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  ),
})
```

- Accepts no props
- Renders nothing when no child route matches
- If a route has no `component`, an `<Outlet />` is rendered automatically

---

## Navigation

### The `<Link>` Component

Renders an `<a>` tag with a valid `href`. The primary way to navigate.

```tsx
import { Link } from '@tanstack/react-router'

// Absolute link
<Link to="/about">About</Link>

// With path params
<Link to="/posts/$postId" params={{ postId: '123' }}>
  View Post
</Link>

// With search params
<Link to="/search" search={{ query: 'tanstack', page: 1 }}>
  Search
</Link>

// With hash
<Link to="/docs" hash="getting-started">
  Getting Started
</Link>

// Functional search params (access previous)
<Link to="." search={(prev) => ({ ...prev, page: prev.page + 1 })}>
  Next Page
</Link>

// Active state styling
<Link
  to="/about"
  activeProps={{ className: 'active' }}
  inactiveProps={{ className: 'inactive' }}
>
  About
</Link>

// Children as function (access active state)
<Link to="/about">
  {({ isActive }) => (
    <span className={isActive ? 'bold' : ''}>About</span>
  )}
</Link>

// Preloading on hover intent
<Link to="/posts" preload="intent" preloadDelay={100}>
  Posts
</Link>

// Relative navigation
<Link from="/posts/$postId" to="..">
  Back to Posts
</Link>

// Replace history instead of push
<Link to="/login" replace>Login</Link>
```

#### Active Options

```tsx
<Link
  to="/posts"
  activeOptions={{
    exact: true,          // Exact path match only
    includeSearch: true,  // Include search params in matching
    includeHash: true,    // Include hash in matching
  }}
>
  Posts
</Link>
```

### `useNavigate()` Hook

Imperative navigation for event handlers and effects.

```tsx
import { useNavigate } from '@tanstack/react-router'

function Component() {
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const result = await createPost()
    navigate({
      to: '/posts/$postId',
      params: { postId: result.id },
    })
  }

  // With from context for type safety
  const navigateFromPost = useNavigate({ from: '/posts/$postId' })
  navigateFromPost({ to: '..', search: { page: 1 } })
}
```

### `<Navigate>` Component

Navigate immediately on mount (declarative redirect):

```tsx
import { Navigate } from '@tanstack/react-router'

function Component() {
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  return <Dashboard />
}
```

### `router.navigate()`

Programmatic navigation outside React components:

```tsx
router.navigate({
  to: '/posts/$postId',
  params: { postId: '123' },
})
```

### `redirect()` in Loaders/beforeLoad

Throw a redirect to navigate during data loading:

```tsx
import { redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/protected')({
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
})
```

### Route Matching

```tsx
import { useMatchRoute } from '@tanstack/react-router'

function Component() {
  const matchRoute = useMatchRoute()

  if (matchRoute({ to: '/posts', pending: true })) {
    return <Spinner />
  }
}
```

---

## Search Params

Search params are first-class citizens. They are automatically parsed/serialized as JSON, supporting complex data types (arrays, objects, numbers, booleans).

### Validation with `validateSearch`

```tsx
// Manual validation
export const Route = createFileRoute('/shop/products')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search?.page ?? 1),
    filter: (search.filter as string) || '',
    sort: (search.sort as string) || 'newest',
  }),
})
```

### With Zod (using adapter)

```tsx
import { z } from 'zod'
import { zodValidator, fallback } from '@tanstack/zod-adapter'

const productSearchSchema = z.object({
  page: fallback(z.number(), 1).default(1),
  filter: fallback(z.string(), '').default(''),
  sort: fallback(z.enum(['newest', 'oldest', 'price']), 'newest').default('newest'),
})

export const Route = createFileRoute('/shop/products/')({
  validateSearch: zodValidator(productSearchSchema),
})
```

### With Valibot (Standard Schema)

```tsx
import * as v from 'valibot'

const productSearchSchema = v.object({
  page: v.optional(v.fallback(v.number(), 1), 1),
  filter: v.optional(v.fallback(v.string(), ''), ''),
  sort: v.optional(
    v.fallback(v.picklist(['newest', 'oldest', 'price']), 'newest'),
    'newest'
  ),
})

export const Route = createFileRoute('/shop/products/')({
  validateSearch: productSearchSchema,
})
```

### Reading Search Params

```tsx
// In route component (type-safe)
function ProductList() {
  const { page, filter, sort } = Route.useSearch()
  return <div>Page: {page}</div>
}

// In any component via getRouteApi
import { getRouteApi } from '@tanstack/react-router'
const routeApi = getRouteApi('/shop/products')

function ProductList() {
  const { page } = routeApi.useSearch()
  return <div>Page: {page}</div>
}

// Loose type safety (for shared components)
import { useSearch } from '@tanstack/react-router'
const search = useSearch({ strict: false })
```

### Writing Search Params

```tsx
// Via Link
<Link to="/products" search={{ page: 2, filter: 'sale' }}>
  Page 2
</Link>

// Functional update
<Link to="." search={(prev) => ({ ...prev, page: prev.page + 1 })}>
  Next Page
</Link>

// Via useNavigate
const navigate = useNavigate({ from: '/products' })
navigate({ search: (prev) => ({ ...prev, page: prev.page + 1 }) })
```

### Search Params Inheritance

Child routes automatically inherit parent search params, with types merged throughout the route tree.

### Search Middlewares

```tsx
import { retainSearchParams, stripSearchParams } from '@tanstack/react-router'

// Retain specific params across navigations
export const Route = createRootRoute({
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [retainSearchParams(['rootValue'])],
  },
})

// Strip default values from URL
export const Route = createFileRoute('/hello')({
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [stripSearchParams({ one: 'abc', two: 'xyz' })],
  },
})
```

---

## Path Params

Dynamic segments captured with `$` prefix.

```tsx
// File: routes/posts/$postId.tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    return fetchPost(params.postId) // params.postId is typed as string
  },
  component: PostComponent,
})

function PostComponent() {
  const { postId } = Route.useParams()
  return <div>Post {postId}</div>
}
```

### Prefixes and Suffixes

```tsx
// File: routes/post-{$postId}.tsx  -> matches /post-123
// File: routes/{$fileName}.txt.tsx -> matches /readme.txt
```

### Navigation with Params

```tsx
// Object style
<Link to="/posts/$postId" params={{ postId: '123' }}>Post</Link>

// Function style
<Link to="/posts/$postId" params={(prev) => ({ ...prev, postId: '456' })}>
  Post
</Link>
```

### Path Params Allowed Characters

```tsx
const router = createRouter({
  routeTree,
  pathParamsAllowedCharacters: ['@', '+', ':', '$'],
})
```

---

## Data Loading

### Route Loaders

```tsx
export const Route = createFileRoute('/posts')({
  loader: async () => {
    return fetchPosts()
  },
  component: PostsComponent,
})

function PostsComponent() {
  const posts = Route.useLoaderData()
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
```

### Loader Parameters

The loader receives:
- `params` - Path parameters
- `context` - Merged route context
- `deps` - Dependencies from `loaderDeps`
- `abortController` - For cancellation
- `cause` - `'enter'` | `'preload'` | `'stay'`
- `preload` - Boolean indicating preload
- `location` - Current location
- `route` - Route reference

### Using Search Params in Loaders (via loaderDeps)

Search params must go through `loaderDeps` for proper cache keying:

```tsx
export const Route = createFileRoute('/posts')({
  validateSearch: (search) => ({
    offset: Number(search.offset ?? 0),
    limit: Number(search.limit ?? 10),
  }),
  loaderDeps: ({ search: { offset, limit } }) => ({ offset, limit }),
  loader: async ({ deps: { offset, limit } }) => {
    return fetchPosts({ offset, limit })
  },
})
```

**Important:** Only include dependencies actually used. Returning entire search objects causes unnecessary reloads.

### Cache Configuration

```tsx
export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(),
  staleTime: 10_000,      // Fresh for 10 seconds (default: 0)
  gcTime: 30 * 60 * 1000, // Keep in cache 30 min (default)
  shouldReload: false,     // Only reload on entry or deps change
})

// Disable SWR (always fresh)
staleTime: Infinity

// No caching after unmount but keep preloading
gcTime: 0
shouldReload: false
```

### `beforeLoad` Hook

Executes before the loader, serially (parent before children). Use for auth checks, context setup:

```tsx
export const Route = createFileRoute('/protected')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    // Return additional context for this route and children
    return {
      user: context.auth.user,
    }
  },
  loader: async ({ context: { user } }) => {
    return fetchUserData(user.id)
  },
})
```

### Abort Signal

```tsx
export const Route = createFileRoute('/posts')({
  loader: ({ abortController }) =>
    fetchPosts({ signal: abortController.signal }),
})
```

### Error Handling

```tsx
export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(),
  errorComponent: ({ error, reset }) => {
    const router = useRouter()
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => {
          router.invalidate() // Reload data and reset error boundary
        }}>
          Retry
        </button>
      </div>
    )
  },
  onError: ({ error }) => {
    console.error('Loader error:', error)
  },
})
```

### Pending / Loading UI

```tsx
export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(),
  pendingComponent: () => <Spinner />,
  pendingMs: 1000,    // Show pending after 1s (default)
  pendingMinMs: 500,  // Show for at least 500ms (default)
})
```

### Consuming Loader Data in Deep Components

```tsx
import { getRouteApi } from '@tanstack/react-router'

const routeApi = getRouteApi('/posts')

function DeepComponent() {
  const data = routeApi.useLoaderData()
  return <div>{data.title}</div>
}
```

---

## Type Safety

### Module Declaration (Required)

```tsx
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

This enables type inference for all hooks and components.

### Using `from` for Type Context

```tsx
// Hooks are type-safe when using Route methods
const params = Route.useParams()      // fully typed
const search = Route.useSearch()      // fully typed
const data = Route.useLoaderData()    // fully typed

// Or with from parameter
const params = useParams({ from: '/posts/$postId' })  // typed
const navigate = useNavigate({ from: '/posts/$postId' }) // typed
```

### Loose/Shared Component Access

For shared components that aren't tied to a specific route:

```tsx
const search = useSearch({ strict: false }) // all properties optional
const params = useParams({ strict: false }) // all properties optional
```

### Performance Tips

1. **Minimize type inference** - only infer types you use
2. **Narrow route scope** - use `from`/`to` parameters
3. **Use object syntax** - prefer `addChildren({})` over arrays for complex trees
4. **Avoid broad types** - use `as const satisfies` instead of generic `LinkProps`

---

## Route Context

Context enables dependency injection through the route tree.

### Setting Up Root Context

```tsx
import { createRootRouteWithContext } from '@tanstack/react-router'

interface MyRouterContext {
  auth: AuthState
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})
```

### Providing Context

```tsx
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // Will be provided by InnerApp
    queryClient,
  },
})

// For dynamic context (e.g., from hooks):
function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}
```

### Using Context in Routes

```tsx
export const Route = createFileRoute('/posts')({
  beforeLoad: ({ context }) => {
    // Access parent context
    console.log(context.auth)
    // Add to context for children
    return { fetchPosts: () => fetch('/api/posts') }
  },
  loader: ({ context }) => {
    // Access both parent context and beforeLoad additions
    return context.fetchPosts()
  },
})
```

### Invalidating Context

```tsx
// When context dependencies change (e.g., auth state):
router.invalidate()
// Triggers context recomputation across all routes
```

---

## Authenticated Routes

Use `beforeLoad` + pathless layout routes for protected areas:

```tsx
// File: routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location, context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
})

// File: routes/_authenticated/dashboard.tsx
// URL: /dashboard - protected by parent beforeLoad
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})
```

### Error Handling in Auth

```tsx
beforeLoad: async ({ location }) => {
  try {
    const user = await verifySession()
    if (!user) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
    return { user }
  } catch (error) {
    if (isRedirect(error)) throw error
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }
}
```

---

## Not Found Handling

### Route-Level

```tsx
import { notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params: { postId } }) => {
    const post = await getPost(postId)
    if (!post) throw notFound()
    return { post }
  },
  notFoundComponent: () => <p>Post not found!</p>,
})
```

### Router-Level Default

```tsx
const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => (
    <div>
      <p>Page not found</p>
      <Link to="/">Go home</Link>
    </div>
  ),
})
```

### Root Route 404

```tsx
export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <div>404 - Not Found</div>,
})
```

---

## Common Hooks Reference

| Hook | Purpose |
|---|---|
| `Route.useParams()` | Get typed path params for current route |
| `Route.useSearch()` | Get typed search params for current route |
| `Route.useLoaderData()` | Get loader data for current route |
| `Route.useRouteContext()` | Get context for current route |
| `useNavigate()` | Imperative navigation |
| `useMatchRoute()` | Check if a route matches |
| `useRouter()` | Access router instance |
| `useRouterState()` | Access router state |
| `useParams({ strict: false })` | Loose params from any route |
| `useSearch({ strict: false })` | Loose search from any route |
| `getRouteApi('/path')` | Get route API for deep components |

---

## Common Imports

```tsx
import {
  createRouter,
  createRoute,
  createRootRoute,
  createRootRouteWithContext,
  createFileRoute,
  RouterProvider,
  Link,
  Navigate,
  Outlet,
  redirect,
  notFound,
  useNavigate,
  useParams,
  useSearch,
  useMatchRoute,
  useRouter,
  useRouterState,
  getRouteApi,
  ErrorComponent,
  isRedirect,
} from '@tanstack/react-router'
```
