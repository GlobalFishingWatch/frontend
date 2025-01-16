import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type {
  IconButtonSize,
  IconButtonType} from '@globalfishingwatch/ui-components';
import {
  IconButton,
  Modal,
} from '@globalfishingwatch/ui-components'

import styles from './DataAndTerminology.module.css'

interface ModalProps {
  containerClassName?: string
  className?: string
  title?: string
  size?: IconButtonSize
  type?: IconButtonType
  children: React.ReactNode
}

const DataAndTerminology: React.FC<ModalProps> = ({
  children,
  className,
  containerClassName,
  title,
  size = 'default',
  type = 'border',
}): React.ReactElement<any> => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const closeModal = useCallback(() => setShowModal(false), [setShowModal])

  return (
    <Fragment>
      <IconButton
        icon="info"
        size={size}
        type={type}
        className={cx(styles.infoButton, className)}
        onClick={(e) => {
          setShowModal(true)
        }}
      />
      <Modal
        appSelector="__next"
        isOpen={showModal}
        onClose={closeModal}
        title={title ?? t('common.dataAndTerminology', 'Data and Terminology')}
        className={cx(styles.container, containerClassName)}
      >
        {children}
      </Modal>
    </Fragment>
  )
}

export default DataAndTerminology
