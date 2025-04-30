import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'
import { logoutUser, useGFWLogin } from '@globalfishingwatch/react-hooks/use-login'
import { Button, Icon, IconButton, InputText, Tag } from '@globalfishingwatch/ui-components'

import Loader from '../../components/loader/loader'
import { getUTCString } from '../../utils/dates'
import { sortByLastUpdated, sortDatasets } from '../../utils/sorting'
import { getHighlightedText } from '../../utils/text'

import styles from './home.module.css'

function HomePage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { logged, user, loading: loginLoading } = useGFWLogin(GFWAPI)
  const handleLoginRedirect = () => {
    if (!logged && typeof window !== 'undefined') {
      window.location.href = GFWAPI.getLoginUrl(window.location.toString())
    }
  }

  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc')
  const [sortBy, setSortBy] = useState<'name' | 'lastUpdated'>('lastUpdated')

  const handleSortClick = (direction: 'asc' | 'desc', sortBy: 'name' | 'lastUpdated') => {
    setSortBy(sortBy)
    setOrderDirection(direction)
  }

  useEffect(() => {
    setLoading(true)
    GFWAPI.fetch<Dataset[]>(`/download/datasets`)
      .then((data) => {
        const sortedData = sortByLastUpdated(data)
        setDatasets(sortedData)
        setLoading(false)
      })
      .catch((e) => {
        console.warn(e)
      })
  }, [])

  const filteredDatasets = useMemo(() => {
    const filtered = datasets.filter((dataset) => {
      const name = dataset.name.toLowerCase()
      const description = dataset.description.toLowerCase()
      return (
        name.includes(searchQuery.toLowerCase()) || description.includes(searchQuery.toLowerCase())
      )
    })

    return sortDatasets(filtered, sortBy, orderDirection)
  }, [datasets, searchQuery, sortBy, orderDirection])

  return (
    <Fragment>
      <div className={styles.topBar}>
        <div className={styles.container}>
          <InputText
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery || ''}
            className={styles.searchInput}
            type="search"
            placeholder="Search datasets..."
          />
          <IconButton
            type="border"
            icon={orderDirection === 'asc' ? 'sort-asc' : 'sort-desc'}
            onClick={() => handleSortClick(orderDirection === 'asc' ? 'desc' : 'asc', 'name')}
            className={styles.sortIcon}
          />
        </div>
        <div>
          {loginLoading ? (
            <Loader />
          ) : logged || user ? (
            <div className={styles.loggedIn}>
              <p>
                You’re logged in as {user?.email},<br />
                and try a different account if you can't find a dataset.
              </p>
              <button
                type="button"
                className={styles.logoutButton}
                onClick={() => {
                  logoutUser()
                }}
              >
                log out
              </button>
            </div>
          ) : (
            <div className={styles.container}>
              <p className={styles.loggedIn}>Can’t find a dataset you’re looking for?</p>
              <Button onClick={() => handleLoginRedirect()} type="secondary" size="medium">
                <Icon icon={'user'} /> LOG IN
              </Button>
            </div>
          )}
        </div>
      </div>
      {(loading || loginLoading) && <Loader />}
      <div className={styles.cardsContainer}>
        {filteredDatasets &&
          filteredDatasets.map((dataset) => {
            const { id, name, description, lastUpdated } = dataset
            return (
              <Link
                key={name}
                to="/datasets/$datasetId"
                params={{ datasetId: id }}
                className={styles.card}
              >
                <h2 className={styles.title}>
                  {getHighlightedText(name as string, searchQuery, styles)}
                </h2>
                <div>
                  <p className={styles.description}>
                    {' '}
                    {getHighlightedText(description as string, searchQuery, styles)}
                  </p>
                  {/* TODO add update frequency when attribute is created V*/}
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
