import type { ErrorComponentProps } from '@tanstack/react-router'
import { ErrorComponent } from '@tanstack/react-router'

import styles from './VesselsTable.module.css'

export function UserErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div className={styles.container}>
      <ErrorComponent error={error} />
    </div>
  )
}
