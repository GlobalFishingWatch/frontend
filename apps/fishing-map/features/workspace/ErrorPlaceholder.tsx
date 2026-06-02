import cx from 'classnames'

import styles from './Workspace.module.css'

interface ErrorPlaceholderProps {
  title: string
  children?: React.ReactNode
  className?: string
}

export default function ErrorPlaceholder({ title, children, className }: ErrorPlaceholderProps) {
  return (
    <div className={cx(styles.placeholder, className)}>
      <div>
        <h2 className={styles.errorTitle}>{title}</h2>
        {children && children}
      </div>
    </div>
  )
}
