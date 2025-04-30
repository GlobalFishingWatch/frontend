import { Fragment, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'
import { Login, useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks/use-login'
import { Button, Icon, InputText, Tag } from '@globalfishingwatch/ui-components'

import Loader from '../../components/loader/loader'
import { getUTCString } from '../../utils/dates'

import styles from './home.module.css'

function HomePage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { logged, user } = useGFWLogin(GFWAPI)
  const loginRedirect = useGFWLoginRedirect(useGFWLogin(GFWAPI))

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
      <div className={styles.topBar}>
        <div>
          <InputText
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery || ''}
            className={styles.searchInput}
            type="search"
            placeholder="Search datasets..."
          />
        </div>
        <div>
          {logged ? (
            <p className={styles.loggedIn}>
              You’re logged in as {user?.email}, <br />
              <Button
                type="border-secondary"
                size="tiny"
                onClick={async () => await GFWAPI.logout()}
              >
                log out
              </Button>
              and try a different account if you can't find a dataset.
            </p>
          ) : (
            <div className={styles.loggedOut}>
              <p className={styles.loggedIn}>Can’t find a dataset you’re looking for?</p>
              <Button
                onClick={() => {
                  if (!logged && !loading && typeof window !== 'undefined') {
                    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
                  }
                }}
                type="secondary"
                size="medium"
              >
                <Icon icon={'user'} /> LOG IN
              </Button>
            </div>
          )}
        </div>
      </div>
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
                <h2 className={styles.title}>{name}</h2>
                <div className={styles.description}>
                  <p> {description}</p>
                  {/* TODO add monthly/daily updates when attribute is created V*/}
                  {lastUpdated && <Tag className={styles.tag}>MONTHLY UPDATES</Tag>}
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.lastUpdate}>
                    <label>Last Update</label>
                    <span>{lastUpdated ? getUTCString(lastUpdated) : '---'}</span>
                  </div>
                  <span className={styles.seeMore}>SEE MORE</span>
                </div>
              </Link>
            )
          })}
      </div>
    </Fragment>
  )
}

export default HomePage
