import React, {useCallback} from 'react'

import styles from './api-banner.module.css'


function ApiBanner() {

    const openApiUrl = useCallback(() => {
      window.open('https://globalfishingwatch.org/our-apis/documentation?utm_source=data_download_portal&utm_medium=banner&utm_campaign=download_fishing_effort#create-a-report-of-a-specified-region', '_blank')
    }, [])

    return (
      <div className={styles.bannerContainer}>
        <h3 className={styles.title}>Your application needs constantly updated data?</h3>
        <button className={styles.apiLink} onClick={openApiUrl}>CHECK OUR APIS HERE</button>
      </div>
    )
  }

export default ApiBanner
