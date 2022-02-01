import React, { useState, useEffect, Fragment } from 'react'
import cx from 'classnames'
import styles from './loader.module.scss'

interface LoaderProps {
  invert?: boolean
  timeout?: number
  mini?: boolean
  encounter?: boolean
  carrier?: boolean
}

const Loader: React.FC<LoaderProps> = ({
  timeout = 200,
  mini = false,
  invert = false,
  carrier = false,
  encounter = false,
}): React.ReactElement => {
  const [visible, setVisible] = useState<boolean>(false)
  useEffect(() => {
    const timeoutCallback = setTimeout(() => setVisible(true), timeout)
    return () => {
      clearTimeout(timeoutCallback)
    }
  }, [timeout])
  if (!visible) return <Fragment />

  return (
    <div className={styles.loaderContainer}>
      <div
        className={cx(styles.spinner, {
          [styles.invert]: invert,
          [styles.mini]: mini,
          [styles.carrier]: carrier,
          [styles.encounter]: encounter,
        })}
        role="alert"
        aria-live="assertive"
      />
      <p className="sr-only">Loading content</p>
    </div>
  )
}

export default Loader
