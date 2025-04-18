import { Fragment, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'

import Loader from '../../components/loader/loader'
import { getUTCString } from '../../utils/dates'

import styles from './home.module.css'

function HomePage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    GFWAPI.fetch<Dataset[]>(`/download/datasets`)
      .then((data) => {
        setDatasets(data)
        setLoading(false)
      })
      .catch((e) => {
        console.warn(e)
      })
  }, [])

  return (
    <Fragment>
      <label>Datasets</label>
      {loading && <Loader />}
      <div className={styles.cardsContainer}>
        {datasets &&
          datasets.map((dataset) => {
            const { id, name, description, lastUpdated } = dataset
            return (
              <Link
                key={name}
                to="/datasets/$datasetId"
                params={{ datasetId: id }}
                className={styles.card}
              >
                <div key={name}>
                  <h2 className={styles.title}>{name}</h2>
                  <p className={styles.description}>{description}</p>
                  <div className={styles.cardFooter}>
                    <div className={styles.lastUpdate}>
                      <label>Last Update</label>
                      <span>{lastUpdated ? getUTCString(lastUpdated) : '---'}</span>
                    </div>
                    <span className={styles.seeMore}>SEE MORE</span>
                  </div>
                </div>
              </Link>
            )
          })}
      </div>
    </Fragment>
  )
}

export default HomePage
