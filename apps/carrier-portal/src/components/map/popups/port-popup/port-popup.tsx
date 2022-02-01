import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import CountryFlag from '@globalfishingwatch/ui-components/dist/countryflag'
import { getEventType, getPorts } from 'redux-modules/router/route.selectors'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import styles from '../popups.module.css'

interface PortPopupProps {
  port: {
    id: string
    iso: string
    label: string
    events: number
  }
}

const PortPopup: React.FC<PortPopupProps> = ({ port }) => {
  const { id, iso, label, events } = port
  const eventType = useSelector(getEventType)
  const ports = useSelector(getPorts)
  const dispatch = useDispatch()
  const isPortSelected = useMemo(() => ports && ports.includes(id), [id, ports])
  const handleClick = useCallback(() => {
    const updatedPorts = isPortSelected
      ? ports.filter((p: string) => p !== id)
      : (ports || []).concat(id)
    dispatch(updateQueryParams({ port: updatedPorts }))
  }, [dispatch, id, ports, isPortSelected])

  return (
    <div className={styles.popup}>
      <div className={styles.infoField}>
        <label>Port</label>
        <div className={styles.infoFieldRow}>
          <span>
            {iso && <CountryFlag iso={iso} />}
            {label}
          </span>
          {events && <span className={cx(styles.numberOfEvents, styles[eventType])}>{events}</span>}
        </div>
      </div>
      <button className={styles.button} onClick={handleClick}>
        {isPortSelected ? 'Remove from filters' : 'Add to filters'}
      </button>
    </div>
  )
}

export default PortPopup
