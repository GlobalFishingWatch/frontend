import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components/icon'

import { useAppDispatch } from '../../store.hooks'

import { selectEditing, selectNumRulers } from './rulers.selectors'
import { resetRulers,toggleRulersEditing } from './rulers.slice'

import mapControlsStyles from '../map/map-controls/MapControls.module.css'
import styles from './Rulers.module.css'

const Rulers = () => {
  const editing = useSelector(selectEditing)
  const numRulers = useSelector(selectNumRulers)

  const dispatch = useAppDispatch()

  const [deleteVisible, setDeleteVisible] = useState(false)

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setDeleteVisible(true)}
      onMouseLeave={() => setDeleteVisible(false)}
    >
      <button
        className={cx(mapControlsStyles.mapControl, { [mapControlsStyles._active]: editing })}
        onClick={() => {
          dispatch(toggleRulersEditing())
        }}
        aria-label="Add rulers"
      >
        <Icon icon="ruler" className={styles.mapControl} />
        {numRulers > 0 && (
          <div className={cx(styles.num, { [styles._active]: editing })}>{numRulers}</div>
        )}
      </button>
      {deleteVisible && numRulers > 0 && (
        <button
          className={cx(mapControlsStyles.mapControl, styles.remove)}
          onClick={() => dispatch(resetRulers())}
        >
          <Icon icon="close" />
        </button>
      )}
    </div>
  )
}

export default Rulers
