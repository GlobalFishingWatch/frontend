import React from 'react'
import cx from 'classnames'
import styles from './MapButtton.module.css'

const MapButtton = (props) => {
  return (
    <button
      title="Explore on map"
      className={cx(styles.MapButtton, { [styles.secondary]: props.secondary })}
      onClick={props.link}
    ></button>
  )
}

export default MapButtton
