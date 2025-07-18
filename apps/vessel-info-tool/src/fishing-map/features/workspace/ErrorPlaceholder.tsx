import styles from './Workspace.module.css'

interface ErrorPlaceholderProps {
  title: string
  children?: React.ReactNode
}

export default function ErrorPlaceholder({ title, children }: ErrorPlaceholderProps) {
  return (
    <div className={styles.placeholder}>
      <div>
        <h2 className={styles.errorTitle}>{title}</h2>
        {children && children}
      </div>
    </div>
  )
}
