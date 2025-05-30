import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'
import { useGFWLogin } from '@globalfishingwatch/react-hooks'
import { IconButton, InputText } from '@globalfishingwatch/ui-components'

import Loader from '../../components/loader/loader'
import TopBar from '../../components/topBar/topBar'
import { getUTCString } from '../../utils/dates'
import { sortByLastUpdated, sortDatasets } from '../../utils/sorting'
import { getHighlightedText } from '../../utils/text'

import styles from './home.module.css'

function HomePage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { logged } = useGFWLogin(GFWAPI)

  const [sortBy, setSortBy] = useState<'name' | 'lastUpdated'>('name')

  const handleSortClick = (sortBy: 'name' | 'lastUpdated') => {
    setSortBy(sortBy)
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

    return sortDatasets(filtered, sortBy, 'asc')
  }, [datasets, searchQuery, sortBy])

  return (
    <Fragment>
      <TopBar>
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
            icon={sortBy === 'name' ? 'history' : 'sort-desc'}
            onClick={() => handleSortClick(sortBy === 'name' ? 'lastUpdated' : 'name')}
            tooltip={sortBy === 'name' ? 'Sort by last updated' : 'Sort by name'}
            className={styles.sortIcon}
          />
        </div>
      </TopBar>
      <div className={styles.cardsContainer}>
        {!logged ? (
          <>Log in to view the datasets</>
        ) : loading ? (
          <Loader />
        ) : (
          filteredDatasets &&
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
                  {/* {lastUpdated && <Tag className={styles.tag}>MONTHLY UPDATES</Tag>} */}
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
          })
        )}
      </div>
    </Fragment>
  )
}

export default HomePage
