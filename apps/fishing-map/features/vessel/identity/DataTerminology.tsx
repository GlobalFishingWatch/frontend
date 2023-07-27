import { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import {
  IconButtonSize,
  IconButtonType,
  IconButton,
  Modal,
} from '@globalfishingwatch/ui-components'
import styles from './DataTerminology.module.css'

interface ModalProps {
  containerClassName?: string
  className?: string
  title?: string
  size?: IconButtonSize
  type?: IconButtonType
  children: React.ReactNode
}

const DataTerminology: React.FC<ModalProps> = ({
  children,
  className,
  containerClassName,
  title,
  size = 'default',
  type = 'border',
}): React.ReactElement => {
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
        title={title ?? t('common.dataTerminology', 'Data and Terminology')}
        className={cx(styles.container, containerClassName)}
      >
        {children}
      </Modal>
    </Fragment>
  )
}

export default DataTerminology
