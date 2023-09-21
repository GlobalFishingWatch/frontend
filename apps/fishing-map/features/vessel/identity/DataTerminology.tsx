import { Fragment, useCallback, useState } from 'react'
import htmlParse from 'html-react-parser'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import {
  IconButtonSize,
  IconButtonType,
  IconButton,
  Modal,
} from '@globalfishingwatch/ui-components'
import { I18nNamespaces } from 'features/i18n/react-i18next'
import styles from './DataTerminology.module.css'

interface ModalProps {
  containerClassName?: string
  className?: string
  title?: string
  size?: IconButtonSize
  type?: IconButtonType
  terminologyKey: keyof I18nNamespaces['data-terminology']
}

const DataTerminology: React.FC<ModalProps> = ({
  terminologyKey,
  className,
  containerClassName,
  title,
  size = 'default',
  type = 'border',
}): React.ReactElement => {
  const { t } = useTranslation(['translations', 'data-terminology'])
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
        {htmlParse(t(`data-terminology:${terminologyKey}`, terminologyKey))}
      </Modal>
    </Fragment>
  )
}

export default DataTerminology
