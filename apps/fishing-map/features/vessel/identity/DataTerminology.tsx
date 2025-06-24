import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import htmlParse from 'html-react-parser'

import type { IconButtonSize, IconButtonType } from '@globalfishingwatch/ui-components'
import { Icon, Modal, Spinner } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectDebugOptions } from 'features/debug/debug.slice'
import type { I18nNamespaces } from 'features/i18n/i18n.types'

import { selectVesselSection } from '../vessel.config.selectors'

import styles from './DataTerminology.module.css'

interface ModalProps {
  containerClassName?: string
  className?: string
  title?: string
  size?: IconButtonSize
  type?: IconButtonType
  terminologyKey: I18nNamespaces['dataTerminology']
}

const DataTerminology: React.FC<ModalProps> = ({
  terminologyKey,
  className,
  containerClassName,
  title,
}): React.ReactElement<any> => {
  const { t } = useTranslation(['translations', 'data-terminology'])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const closeModal = useCallback(() => setShowModal(false), [setShowModal])
  const vesselSection = useSelector(selectVesselSection)
  const debugOptions = useSelector(selectDebugOptions)

  const onClick = useCallback(() => {
    setShowModal(true)
    if (debugOptions.dataTerminologyIframe) {
      setLoading(true)
    }
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: `open_vessel_info_${vesselSection}_tab`,
      label: terminologyKey,
    })
  }, [debugOptions.dataTerminologyIframe, terminologyKey, vesselSection])

  return (
    <Fragment>
      <span role="button" onClick={onClick} tabIndex={0}>
        <Icon icon="info" className={cx(styles.infoButton, className)} />
      </span>
      <Modal
        appSelector="__next"
        isOpen={showModal}
        onClose={closeModal}
        shouldCloseOnEsc
        title={title ?? t('common.dataTerminology')}
        className={cx(containerClassName, {
          [styles.iFrameContainer]: debugOptions.dataTerminologyIframe,
        })}
        contentClassName={
          debugOptions.dataTerminologyIframe ? styles.iFramecontent : styles.content
        }
      >
        {debugOptions.dataTerminologyIframe ? (
          <Fragment>
            {loading && <div className={styles.iFrameSpinnerContainer}>{<Spinner />}</div>}
            <iframe
              style={{
                width: '100%',
                height: '100%',
              }}
              title="info-iframe"
              src={`https://globalfishingwatch.org/map-and-data/${terminologyKey.toLowerCase()}/`}
              onLoad={(e) => {
                e.preventDefault()
                setLoading(false)
              }}
            />
          </Fragment>
        ) : (
          htmlParse(t(`data-terminology:${terminologyKey}`, terminologyKey))
        )}
      </Modal>
    </Fragment>
  )
}

export default DataTerminology
