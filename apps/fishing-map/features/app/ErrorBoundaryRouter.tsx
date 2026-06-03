import styles from './ErrorBoundary.module.css'

export function RouterErrorBoundary({ error }: { error: Error }) {
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
