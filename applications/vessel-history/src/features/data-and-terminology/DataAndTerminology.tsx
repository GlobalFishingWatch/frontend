import { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { IconButtonSize, IconButtonType } from '@globalfishingwatch/ui-components/dist/icon-button'
import { IconButton, Modal } from '@globalfishingwatch/ui-components'
import styles from './DataAndTerminology.module.css'

interface ModalProps {
  containerClassName?: string
  className?: string
  title?: string
  size?: IconButtonSize
  type?: IconButtonType
}

const DataAndTerminology: React.FC<ModalProps> = ({
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
        className={className}
        onClick={() => setShowModal(true)}
      />
      <Modal
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
