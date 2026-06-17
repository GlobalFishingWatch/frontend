import { useEffect } from 'react'

import styles from './ErrorBoundary.module.css'

// A failed dynamic import almost always means the deployed assets changed under us
// (stale HTML referencing old hashed chunks): the server answers the missing chunk
// URL with the SPA fallback HTML, so the browser rejects the import with messages
// like "'text/html' is not a valid JavaScript MIME type" or "Failed to fetch
// dynamically imported module". Vite's `vite:preloadError` (handled in client.tsx)
// covers modulepreload, but a raw `import()` that rejects surfaces here instead.
const MODULE_LOAD_ERROR_PATTERNS = [
  'is not a valid JavaScript MIME type',
  'Failed to fetch dynamically imported module',
  'error loading dynamically imported module',
  'Importing a module script failed',
  'Unable to preload CSS',
]

function isModuleLoadError(error?: Error) {
  const message = error?.message || ''
  return MODULE_LOAD_ERROR_PATTERNS.some((pattern) => message.includes(pattern))
}

export function RouterErrorBoundary({ error }: { error: Error }) {
  useEffect(() => {
    if (isModuleLoadError(error)) {
      window.location.reload()
    }
  }, [error])

  return (
    <div>
      <div className={styles.errorBoundary}>
        <h1 className={styles.title}>There was an unexpected error</h1>
      </div>
      <div className={styles.error}>
        {error && (
          <ul>
            {error.message && (
              <li>
                <label>Message:</label> {error.message}
              </li>
            )}
            {error.stack && (
              <li>
                <label>Stack:</label> {error.stack}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
