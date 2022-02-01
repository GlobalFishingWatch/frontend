import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import Modal from 'react-modal'
import styles from 'app.module.css'
import { useLocalStorage } from 'hooks/localstorage.hooks'
import { getDataset } from 'redux-modules/router/route.selectors'
import { ReactComponent as Logo } from 'assets/images/gfw-carrier-vessels.svg'
import { DATA_DOWNLOAD_URL, WELCOME_MODAL_READED_STORAGE_KEY } from 'data/constants'

declare global {
  interface Window {
    gtag: any
  }
}

Modal.setAppElement('#root')

const WelcomeModal: React.FC = (): React.ReactElement => {
  const [welcomeModalReaded, setWelcomeModalReaded] = useLocalStorage(
    WELCOME_MODAL_READED_STORAGE_KEY
  )
  const datasetId = useSelector(getDataset)
  const dismissWelcomeModal = useCallback(() => {
    setWelcomeModalReaded('true')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal
      overlayClassName={styles.modalOverlay}
      className={styles.modalContentWrapper}
      isOpen={!welcomeModalReaded}
      onRequestClose={dismissWelcomeModal}
    >
      <Logo className={styles.modalLogo} />
      <h2 className={styles.modalTitle}>Welcome to the Carrier Vessel Portal</h2>
      <div className={styles.modalContent}>
        <p>
          <a href="https://globalfishingwatch.org">Global Fishing Watch</a> and{' '}
          <a href="https://www.pewtrusts.org/en">The Pew Charitable Trusts</a> are working together
          to improve understanding and management of transshipment at-sea through greater
          transparency, monitoring and analysis of the activity.
        </p>
        <p>
          As part of these efforts, the two organizations have developed a public portal to help
          policymakers and fishery managers better understand the activity of carriers, refrigerated
          cargo vessels that can support the transfer of fish from commercial fishing vessels out at
          sea and delivery of fish to ports for processing worldwide.
        </p>
        <p>
          The Carrier Vessel Portal utilizes AIS data to show the historical activity of carriers,
          including port visits, loitering and encounter events, as well as RFMOs authorization for
          both carriers and fishing vessels to enable the user a full picture of carrier patterns.
        </p>
        <p>
          Check out our{' '}
          <a href="https://globalfishingwatch.org/faqs/#faqs-video-tutorials">video tutorial</a> and{' '}
          <a href="https://globalfishingwatch.org/article-categories/carrier-vessel-portal/">FAQ</a>{' '}
          for further information.
        </p>
        <ul>
          <h3>What’s New!</h3>
        </ul>
        <li>
          As part of our effort of improving our data, the algorithm for loitering events and port
          visits have been adjusted to more precisely capture possible events, and therefore you may
          see an increase in these events.
        </li>
        <li>
          The carrier vessel portal now allows users to filter activity by the flag State of the
          donor vessel.
        </li>
        <li>
          Addition of NPFC and SPRFMO as highlighted RFMOs within the CVP. This means that if an
          encounter occurred within the NPFC or SPRFMO Convention Areas any publicly available
          registry records from these RFMOs was matched to the carrier and fishing vessel to
          identify potential authorization during the time of the encounter. In addition activity
          can be filtered by either Convention Area.
        </li>
        <li>
          The downloadable data has been updated to better encompass all events, including
          encounters, loitering, and port visits. When clicking on the option to ‘Download entire
          dataset’ within the CVP you will be brought to the webpage{' '}
          <a
            target="_blank"
            href={`${DATA_DOWNLOAD_URL}/datasets/${datasetId}`}
            rel="noopener noreferrer"
            className={styles.modalContentLink}
            id="data-download-link-welcome-modal"
          >
            here
          </a>
          . The complete set of data is provided along with a cohesive explanation of the data
          provided.
        </li>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.modalButton} onClick={dismissWelcomeModal}>
          Dismiss
        </button>
      </div>
    </Modal>
  )
}

export default WelcomeModal
