import React, { Fragment, useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import { IconButton, Modal } from '@globalfishingwatch/ui-components'
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value?: number
  label?: string
  presition?: number,
  helpText?: React.ReactNode
}
export function ProgressBar(props: ProgressBarProps) {
  const {
    label = null,
    value,
    presition = 1,
    helpText
  } = props

  const [showModal, setShowModal] = useState(false)
  const closeModal = useCallback(() => setShowModal(false), [setShowModal])

  const waitingValue = useMemo(() => {
    return value === undefined || value === null
  }, [value])

  const percent = useMemo(() => {
    // avoid NaN values
    const divider = presition >= 0 ? (presition * 10) : 1
    if (value === undefined || value === null) {
      return 0
    }

    return Math.round((value + Number.EPSILON) * divider) / divider
  }, [value, presition])

  return (
    <div className={styles.barContainer}>
      {label && <label className={styles.label} >
        {label}
        {helpText && (
          <Fragment>
            <IconButton
              icon="info"
              size={"tiny"}
              type={"default"}
              className={cx(styles.infoButton)}
              onClick={() => setShowModal(true)}
            />
            <Modal
              appSelector="__next"
              isOpen={showModal}
              onClose={closeModal}
              title={label}

            >
              {helpText}
            </Modal>
          </Fragment>
        )}
      </label>}
      <div className={styles.barValue} style={{
        paddingLeft: `calc(${waitingValue ? 0 : percent}% - 14px)`,
      }}>{!waitingValue ? percent + '%' : <span className={styles.loadingLabel}>loading</span>}</div>
      <div className={styles.bar}>
        <div className={cx(styles.dot, { [styles.loading]: waitingValue })} style={{
          left: `${percent}%`,
        }}></div>
      </div>
    </div>
  )
}

export default ProgressBar
