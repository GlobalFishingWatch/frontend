import React, { Fragment, useState, useEffect, useCallback } from 'react'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import Modal from 'react-modal'
import { CountryFlag } from '@globalfishingwatch/ui-components'
import { ReactComponent as IconLogo } from 'assets/images/gfw-carrier-vessels-white.svg'
import { Vessel, EventVessel } from 'types/api/models'
import { EncounterTypes } from 'types/app.types'
import { useMapImage } from 'hooks/map.hooks'
import { useDownloadDomElementAsImage } from 'hooks/screen.hooks'
import Loader from 'components/loader/loader'
import MapLegend from '../map-legend/map-legend.container'
import styles from './map-screenshot.module.css'

const DOWNLOAD_IMAGE_ID = 'download-image'

interface MapScreenshotProps {
  map: any
  vessel: Vessel | null
  encounterVessel: EventVessel | null
  filters: string
  visible: boolean
  dateRangeLiteral: string
  otherEvents: EncounterTypes[] | null
  currentEvents: EncounterTypes[] | null
  heatmapLegend: { ramp: number[][]; area: number } | null
  setMapDownloadVisible: (visible: boolean) => void
}

const MapScreenshot: React.FC<MapScreenshotProps> = (props) => {
  const {
    map,
    filters,
    vessel,
    visible,
    otherEvents,
    currentEvents,
    heatmapLegend,
    encounterVessel,
    dateRangeLiteral,
    setMapDownloadVisible,
  } = props
  const img = useMapImage(visible ? map : null)
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const domElement = img !== null ? document.getElementById(DOWNLOAD_IMAGE_ID) : null
  const { loading, finished, downloadImage, getCanvas } = useDownloadDomElementAsImage(
    domElement,
    false
  )

  const trackAndDownload = useCallback(() => {
    uaEvent({
      category: 'CVP - General Actions',
      action: 'Save screenshot',
      label: vessel ? 'vessel history page' : 'home page',
    })
    downloadImage()
  }, [downloadImage, vessel])

  const handleFinished = useCallback(() => {
    setImgPreview(null)
    setMapDownloadVisible(false)
  }, [setMapDownloadVisible])

  useEffect(() => {
    const getImage = async () => {
      const canvas = await getCanvas()
      setImgPreview(canvas.toDataURL())
    }
    if (domElement) {
      getImage()
    }
  }, [domElement, getCanvas])

  useEffect(() => {
    if (finished) {
      handleFinished()
    }
  }, [finished, handleFinished])

  const vesselFlag = vessel !== null && vessel.flags[0].value
  const encounterVesselFlag = encounterVessel && encounterVessel.flag
  const hasEvents =
    (currentEvents && currentEvents.length > 0) || (otherEvents && otherEvents.length > 0)

  return (
    <Fragment>
      <Modal
        overlayClassName={styles.modalOverlay}
        className={styles.modalContent}
        isOpen={map && visible}
        onRequestClose={handleFinished}
      >
        {/* Translate the image to an invisible area to generate the preview */}
        <div className={styles.imgContainerTranslated}>
          <div id={DOWNLOAD_IMAGE_ID} className={styles.imgContainer}>
            <div className={styles.logoContainer}>
              <IconLogo className={styles.logo} />
            </div>
            {img && <img className={styles.img} src={img} alt="Map screenshot" />}
            <div className={styles.legendContainer}>
              <p className={styles.legendTitle}>{dateRangeLiteral}</p>
              {vessel && (
                <p className={styles.flexCenter}>
                  <span className={styles.mainVesselLine} />{' '}
                  {vesselFlag && <CountryFlag iso={vesselFlag} />}
                  <span className={cx(styles.legendTitle, styles.legendTitleSpace)}>
                    {vessel.name}
                  </span>
                </p>
              )}
              <div className={styles.legend}>
                <div>
                  {hasEvents && filters && (
                    <p>
                      <span className={styles.legendTitle}>EVENTS</span>
                      <span className={cx(styles.legendLabel, styles.legendTitleSpace)}>
                        ({filters.trim()})
                      </span>
                    </p>
                  )}
                  <div className={styles.eventsLegendContainer}>
                    {currentEvents && (
                      <div className={styles.eventsLegendList}>
                        {currentEvents.map((currentEvent) => (
                          <div key={currentEvent.id} className={styles.eventsLegend}>
                            <span
                              className={styles.eventsLegendIcon}
                              style={{ color: currentEvent.color }}
                            ></span>
                            <span className={styles.legendLabel}>{currentEvent.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {otherEvents && (
                      <div className={styles.eventsLegendList}>
                        {otherEvents.map((events) => (
                          <div key={events.id} className={styles.eventsLegend}>
                            <span
                              className={styles.eventsLegendIcon}
                              style={{ color: events.color }}
                            ></span>
                            <span className={styles.legendLabel}>{events.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {!vessel && (
                  <MapLegend
                    className={styles.mapLegend}
                    heatmapLegend={heatmapLegend}
                    heatmapCurrentValue={null}
                  />
                )}
              </div>
              {encounterVessel && (
                <p className={styles.flexCenter}>
                  <span className={styles.encounterVesselLine} />{' '}
                  {encounterVesselFlag && <CountryFlag iso={encounterVesselFlag} />}
                  <span className={cx(styles.legendTitle, styles.legendTitleSpace)}>
                    {encounterVessel.name}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className={styles.imgPreviewContainer}>
          {imgPreview ? (
            <img className={styles.imgPreview} src={imgPreview} alt="Map screenshot preview" />
          ) : (
            <Loader />
          )}
        </div>
        <div className={styles.footer}>
          <button onClick={handleFinished}>DISMISS</button>
          <button
            disabled={!imgPreview}
            className={styles.primaryBtn}
            onClick={() => trackAndDownload()}
          >
            {loading ? <Loader invert mini /> : 'Save'}
          </button>
        </div>
      </Modal>
    </Fragment>
  )
}

export default MapScreenshot
