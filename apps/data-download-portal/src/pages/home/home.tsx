import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'
import { useGFWLogin } from '@globalfishingwatch/react-hooks/use-login'
import { Button, Icon, IconButton, InputText, Tag } from '@globalfishingwatch/ui-components'

import Loader from '../../components/loader/loader'
import { getUTCString } from '../../utils/dates'
import { getHighlightedText } from '../../utils/text'

import styles from './home.module.css'

function HomePage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc')
  const { logged, user } = useGFWLogin(GFWAPI)

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

  const handleSortClick = (direction: 'asc' | 'desc') => {
    setOrderDirection(direction)
    const sortedDatasets = [...datasets].sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (direction === 'asc') {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0
      }
    })
    setDatasets(sortedDatasets)
    // dispatchQueryParams({
    //   orderBy: 'name',
    // })
  }

  const filteredDatasets = useMemo(
    () =>
      datasets.filter((dataset) => {
        const name = dataset.name.toLowerCase()
        const description = dataset.description.toLowerCase()
        return (
          name.includes(searchQuery.toLowerCase()) ||
          description.includes(searchQuery.toLowerCase())
        )
      }),
    [datasets, searchQuery]
  )

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
            onClick={() => handleSortClick(orderDirection === 'asc' ? 'desc' : 'asc')}
            className={styles.sortIcon}
          />
        </div>
        <div>
          {logged ? (
            <div className={styles.loggedIn}>
              <p>
                You’re logged in as {user?.email},<br />
                and try a different account if you can't find a dataset.
              </p>
              <button
                type="button"
                className={styles.logoutButton}
                onClick={() => {
                  // TODO: Implement logout logic here
                }}
              >
                log out
              </button>
            </div>
          ) : (
            <div className={styles.container}>
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
                <h2 className={styles.title}>
                  {getHighlightedText(name as string, searchQuery, styles)}
                </h2>
                <div className={styles.description}>
                  <p> {getHighlightedText(description as string, searchQuery, styles)}</p>
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
