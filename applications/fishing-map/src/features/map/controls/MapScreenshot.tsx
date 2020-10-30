import React, { Fragment, useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDownloadDomElementAsImage } from 'hooks/screen.hooks'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { Button } from '@globalfishingwatch/ui-components'
import { useMapImage } from 'features/map/map.hooks'
import { useMapboxRef } from '../map.context'
import styles from './MapScreenshot.module.css'

const DOWNLOAD_IMAGE_ID = 'download-image'

interface MapScreenshotProps {
  visible: boolean
  setMapDownloadVisible: (visible: boolean) => void
}

const MapScreenshot: React.FC<MapScreenshotProps> = (props) => {
  const { t } = useTranslation()
  const { visible, setMapDownloadVisible } = props
  const mapRef = useMapboxRef()
  const imgMap = useMapImage(visible ? mapRef.current?.getMap() : null)
  const [domElement, setDomElement] = useState<HTMLElement | null>(null)
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const { loading, finished, downloadImage, getCanvas } = useDownloadDomElementAsImage(
    domElement,
    false
  )

  const handleFinished = useCallback(() => {
    setImgPreview(null)
    setMapDownloadVisible(false)
  }, [setMapDownloadVisible])

  useLayoutEffect(() => {
    const domElement = document.getElementById(DOWNLOAD_IMAGE_ID)
    setDomElement(domElement)
  }, [])

  useEffect(() => {
    const getImage = async () => {
      const canvas = await getCanvas()
      setImgPreview(canvas.toDataURL())
    }
    if (imgMap) {
      getImage()
    }
  }, [getCanvas, imgMap])

  useEffect(() => {
    if (finished) {
      handleFinished()
    }
  }, [finished, handleFinished])

  return (
    <Fragment>
      {/* Translate the image to an invisible area to generate the preview */}
      <div className={styles.imgContainerTranslated}>
        <div id={DOWNLOAD_IMAGE_ID} className={styles.imgContainer}>
          {imgMap && (
            <Fragment>
              <div className={styles.logoContainer}>
                <Logo type="invert" className={styles.logo} />
              </div>
              <img
                className={styles.img}
                src={imgMap}
                alt={t('map.screenshot', 'Map screenshot')}
              />
            </Fragment>
          )}
        </div>
      </div>
      <Modal
        header={false}
        isOpen={visible}
        onClose={handleFinished}
        contentClassName={styles.modalContent}
      >
        <div className={styles.imgPreviewContainer}>
          {imgPreview ? (
            <img
              className={styles.imgPreview}
              src={imgPreview}
              alt={t('map.screenshot', 'Map screenshot')}
            />
          ) : (
            <Spinner />
          )}
        </div>
        <div className={styles.footer}>
          <Button type="secondary" onClick={handleFinished}>
            {t('common.dismiss', 'Dismiss') as string}
          </Button>
          <Button disabled={!imgPreview} onClick={() => downloadImage()}>
            {loading ? <Spinner size="small" /> : (t('common.save', 'Save') as string)}
          </Button>
        </div>
      </Modal>
    </Fragment>
  )
}

export default MapScreenshot
