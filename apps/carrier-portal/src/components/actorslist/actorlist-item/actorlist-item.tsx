import React, { Fragment } from 'react'
import cx from 'classnames'
import CountryFlag from '@globalfishingwatch/ui-components/dist/countryflag'
import styles from 'components/actorslist/actorsList.module.css'
import { Vessel } from 'types/api/models'
import { EventType } from 'types/app.types'

export interface ActorListItem {
  id: string
  label: string
  events: number
  flag: string
  name?: string
  carrier?: Vessel
  vesselId?: string
}

export interface ActorListItemProps {
  isFirst: boolean
  item: ActorListItem
  eventType: EventType
  linkPath?: any
  onLinkClick: (item: ActorListItem, e: React.MouseEvent) => void
  selected: boolean
}

const ActorListItemComponent: React.FC<ActorListItemProps> = (props): React.ReactElement => {
  const { item, isFirst, eventType, selected, onLinkClick, linkPath } = props

  return (
    <li className={cx(styles.listItem, { [styles.listItemSelected]: selected })}>
      {linkPath ? (
        <a href={linkPath} onClick={(e) => onLinkClick(item, e)} className={styles.listItemLabel}>
          {item.flag && <span className={styles.flag}>{<CountryFlag iso={item.flag} />}</span>}
          {item.label && <span className={styles.name}>{item.label.toLowerCase()}</span>}
          {item.carrier && <span className={styles.id}>{item.carrier.ssvid}</span>}
        </a>
      ) : (
        <Fragment>
          <input
            readOnly
            type="checkbox"
            className={selected ? styles.selected : ''}
            name={item.label}
            id={item.label}
            onClick={(e) => onLinkClick(item, e)}
            checked={selected}
          />
          <label className={styles.listItemLabel} htmlFor={item.label}>
            {item.flag && <span className={styles.flag}>{<CountryFlag iso={item.flag} />}</span>}
            {item.label && <span className={styles.name}>{item.label.toLowerCase()}</span>}
            {item.carrier && <span className={styles.id}>{item.carrier.ssvid}</span>}
          </label>
        </Fragment>
      )}
      <span className={cx(styles.numberOfEvents, { [styles[eventType]]: isFirst })}>
        {item.events}
      </span>
    </li>
  )
}

export default ActorListItemComponent
