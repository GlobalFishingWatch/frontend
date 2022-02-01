import React, { useCallback, Fragment, useState, useEffect } from 'react'
import cx from 'classnames'
import { parse, stringify } from 'qs'
import { CurrentTab, EventType } from 'types/app.types'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { MAX_ACTORS_TO_DISPLAY } from 'data/constants'
import ActorListItemComponent, { ActorListItem } from './actorlist-item/actorlist-item'
import styles from './actorsList.module.css'

interface ActorsListProps {
  currentTab: CurrentTab
  eventType: EventType
  sidebarSize: number
  setCurrentTab: (tab: CurrentTab) => void
  setFlag: (flag: string[]) => void
  setPort: (port: string[]) => void
  goToVesselDetail: typeof updateQueryParams
  actorsCount: {
    flags: number | string
    ports: number | string
    carriers: number | string
  }
  actors: ActorListItem[]
}

const ActorsList: React.FC<ActorsListProps> = (props): React.ReactElement => {
  const [selection, setSelection] = useState<string[]>([])
  const [showAllActors, setShowAllActors] = useState<boolean>(false)
  const {
    actorsCount,
    currentTab,
    eventType,
    setCurrentTab,
    actors,
    goToVesselDetail,
    sidebarSize,
  } = props

  // Restore the selection on tab change
  useEffect(() => {
    setSelection([])
  }, [currentTab])

  const handleLinkClick = useCallback(
    (item: ActorListItem, event: React.MouseEvent) => {
      event.preventDefault()
      if (currentTab === 'carriers') {
        const query = { vessel: item.id }
        goToVesselDetail({ ...query })
      } else {
        setSelection((selection) => {
          if (selection.includes(item.id)) {
            return selection.filter((s) => s !== item.id)
          }
          return selection.concat(item.id)
        })
      }
    },
    [currentTab, goToVesselDetail]
  )

  const handleApplyClick = useCallback(() => {
    if (currentTab === 'flags') {
      props.setFlag(selection)
    } else if (currentTab === 'ports') {
      props.setPort(selection)
    }
    setSelection([])
  }, [currentTab, props, selection])

  const handleShowAll = useCallback(() => {
    setShowAllActors(!showAllActors)
  }, [showAllActors, setShowAllActors])

  const isSelecting = selection.length > 0

  return (
    <Fragment>
      <div className={styles.tabs}>
        <button
          onClick={() => setCurrentTab('carriers')}
          className={cx(styles.tab, { [styles.selected]: currentTab === 'carriers' })}
          aria-label={`See the carriers involved in the ${eventType} events that match your filters`}
          data-tip-pos="top-left"
          data-tip-wrap="multiline"
        >
          <span className={styles.label}>
            Carriers <span className={styles.number}>{actorsCount.carriers}</span>
          </span>
        </button>
        <button
          onClick={() => setCurrentTab('flags')}
          className={cx(styles.tab, { [styles.selected]: currentTab === 'flags' })}
          aria-label={`See the flag states of the carriers involved in the ${eventType} events that match your filters`}
          data-tip-wrap="multiline"
        >
          <span className={styles.label}>
            Flags <span className={styles.number}>{actorsCount.flags}</span>
          </span>
        </button>
        <button
          onClick={() => setCurrentTab('ports')}
          className={cx(styles.tab, { [styles.selected]: currentTab === 'ports' })}
          aria-label={`See the ports visited after the ${eventType} events that match your filters`}
          data-tip-pos="top-right"
          data-tip-wrap="multiline"
        >
          <span className={styles.label}>
            Ports <span className={styles.number}>{actorsCount.ports}</span>
          </span>
        </button>
      </div>
      <ul className={cx(styles.list, { [styles.selecting]: isSelecting }, styles[currentTab])}>
        {actors !== null &&
          actors.map((actor, i) => {
            const linkPath = stringify(
              {
                ...parse(window.location.search.replace('?', '')),
                vessel: actor.id,
                timestamp: undefined,
                eventType: undefined,
              },
              { encode: false }
            )
            return i < MAX_ACTORS_TO_DISPLAY || showAllActors ? (
              <ActorListItemComponent
                key={i}
                item={actor}
                isFirst={i === 0}
                eventType={eventType}
                onLinkClick={handleLinkClick}
                linkPath={currentTab === 'carriers' ? `?${linkPath}` : null}
                selected={selection.includes(actor.id)}
              />
            ) : null
          })}
        {actors !== null && actors.length > MAX_ACTORS_TO_DISPLAY && (
          <button className={styles.showAll} onClick={handleShowAll}>
            {showAllActors ? 'see less' : 'see all'}
          </button>
        )}
      </ul>
      {isSelecting && (
        <div className={styles.actionsContainer} style={{ width: `${sidebarSize}%` }}>
          <button className={styles.primaryBtn} onClick={handleApplyClick}>
            Apply filters
          </button>
        </div>
      )}
    </Fragment>
  )
}

export default ActorsList
