import React, { Fragment,useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { GFWAPI } from '@globalfishingwatch/api-client'

import Loader from '../../components/loader/loader'

import styles from './report.module.scss'

function ReportPage() {
  const { reportId } = useParams()
  const [reportUrl, setReportUrl] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    GFWAPI.fetch(`/reports/${reportId}/url`)
      .then(({ url }) => {
        setReportUrl(url)
        window.location.href = url
        setLoading(false)
      })
      .catch((e) => {
        console.log(e)
        setError(true)
        setLoading(false)
      })
  }, [reportId])

  return (
    <Fragment>
      {loading && <Loader />}
      {(reportUrl || error) && (
        <div className={styles.twoColumns}>
          <div className={styles.description}>
            <label>Report Download</label>
            {reportUrl && (
              <span>
                Your download will start soon, if it does not you can{' '}
                <a href={reportUrl} target="_blank" rel="noreferrer">
                  click here
                </a>
                .
              </span>
            )}
            {error && (
              <span>There was a problem and we could not find the report you requested. 🙈</span>
            )}
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default ReportPage
