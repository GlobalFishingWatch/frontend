import React, { Fragment, useCallback, useMemo, useState } from 'react'
import cx from 'classnames'

import { IconButton } from '../icon-button'
import { Modal } from '../modal'

import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value?: number | string
  label?: string
  className?: string
  precision?: number
  helpText?: React.ReactNode
  disabled?: boolean
  disabledText?: string
  loading: boolean
}
export function ProgressBar(props: ProgressBarProps) {
  const {
    label = null,
    value,
    className,
    disabled = false,
    disabledText = '',
    precision = 1,
    helpText,
    loading = false,
  } = props

  const [showModal, setShowModal] = useState(false)
  const closeModal = useCallback(() => setShowModal(false), [setShowModal])

  const percent = useMemo(() => {
    // avoid NaN values
    const divider = precision > 0 ? Math.pow(10, precision) : 1
    if (value === undefined || value === null || typeof value === 'string') {
      return 0
    }

    return Math.round((value + Number.EPSILON) * divider) / divider
  }, [value, precision])

  return (
    <div className={cx(styles.barContainer, className, { [styles.disabled]: disabled })}>
      {label && (
        <label className={styles.label}>
          {label}
          {helpText && (
            <Fragment>
              <IconButton
                icon="info"
                size={'tiny'}
                type={'default'}
                className={cx(styles.infoButton)}
                onClick={() => setShowModal(true)}
              />
              <Modal appSelector="__next" isOpen={showModal} onClose={closeModal} title={label}>
                {helpText}
              </Modal>
            </Fragment>
          )}
        </label>
      )}
      <div
        className={styles.barValue}
        style={{
          paddingLeft: `calc(${loading ? 0 : percent}% - 14px)`,
        }}
      >
        {!loading ? (
          disabled ? (
            disabledText
          ) : (
            percent + '%'
          )
        ) : (
          <span className={styles.loadingLabel}>loading</span>
        )}
      </div>
      <div className={cx(styles.bar)}>
        <div
          className={cx(styles.dot, {
            [styles.loading]: loading,
          })}
          style={{
            left: `${percent}%`,
          }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
