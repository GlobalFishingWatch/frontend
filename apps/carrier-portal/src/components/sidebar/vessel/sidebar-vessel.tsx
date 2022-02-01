import React, { useRef, useEffect, useState, useCallback, Fragment, useMemo } from 'react'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import debounce from 'lodash/debounce'
import CountryFlag from '@globalfishingwatch/ui-components/dist/countryflag'
import Tooltip from 'components/tooltip/tooltip'
import Timeline from 'components/timeline/timeline.container'
import EventsSummary from 'components/events-summary/events-summary.container'
import { ReactComponent as IconInfo } from 'assets/icons/info.svg'
import { Vessel } from 'types/api/models'
import { InfoField } from 'types/app.types'
import Loader from 'components/loader/loader'
import styles from './sidebar-vessel.module.css'
import InfoFieldComponent from './info-field/info-field'

interface ExtendedInfoField extends InfoField {
  grouped?: boolean
  tooltip?: string
}

interface SidebarVesselProps {
  vessel: Vessel | null
  vesselDetailsError: string | null
  detailsLoaded: boolean
  eventsLoaded: boolean
  sidebarSize: 'regular' | 'small'
  infoFields: ExtendedInfoField[] | null
  onReady: () => void
}

const timelineClassNames = {
  timeline: styles.timeline,
  events: styles.events,
}

const Sidebar: React.FC<SidebarVesselProps> = (props): React.ReactElement => {
  const {
    vessel,
    sidebarSize,
    infoFields,
    onReady,
    detailsLoaded,
    vesselDetailsError,
    eventsLoaded,
  } = props
  const scrollContainerRef = useRef<any>(null)
  const summaryStickyRef = useRef<any>(null)
  const [sticky, setSticky] = useState<boolean>(false)

  const scrollToTop = () => {
    if (scrollContainerRef.current !== undefined) scrollContainerRef.current.scrollTop = 0
    uaEvent({
      category: 'CVP - Vessel History',
      action: 'Click on vessel identity details',
      label: vessel?.type,
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onScroll = useCallback(
    debounce(
      () => {
        const ref = scrollContainerRef.current
        if (ref !== null && summaryStickyRef.current) {
          const { height } = summaryStickyRef.current.getBoundingClientRect()
          const top = summaryStickyRef.current.offsetTop
          const offset = 40
          const isSticky = ref.scrollTop + offset > top + height
          if (isSticky !== sticky) {
            setSticky(isSticky)
          }
        }
      },
      200,
      { leading: true }
    ),
    [sticky]
  )

  useEffect(() => {
    const ref = scrollContainerRef.current
    if (ref !== null) {
      ref.addEventListener('scroll', onScroll, { passive: true })
    }
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', onScroll)
      }
    }
  }, [onScroll, scrollContainerRef])

  const vesselFlag = vessel !== null && vessel.flags[0].value

  const vesselInfo = useMemo(() => {
    if (!vessel) return ''
    const mmsi = `MMSI: ${vessel.mmsi[0]?.value || 'Unknown'}`
    const imo = `IMO: ${vessel.imo || 'Unknown'}`
    const ircs = `IRCS: ${vessel.callsign[0]?.value || 'Unknown'}`
    return [mmsi, imo, ircs].join(' - ')
  }, [vessel])

  useEffect(() => {
    onReady()
  }, [onReady])

  return (
    <Fragment>
      {vessel && <h1 className="sr-only">{`${vessel.name} history`}</h1>}
      <div ref={scrollContainerRef} className={styles.container} data-size={sidebarSize}>
        <div className={styles.profile}>
          <h2 className={styles.profileTitle}>
            {vesselFlag && (
              <span className={styles.noEvents}>
                <CountryFlag iso={vesselFlag} />
              </span>
            )}
            {vessel && vessel.name}
          </h2>
          {detailsLoaded ? (
            <div className={styles.vesselInfo}>
              {infoFields !== null &&
                infoFields.map((field) => (
                  <InfoFieldComponent
                    infoField={field}
                    key={field.key}
                    grouped={field.grouped || false}
                  />
                ))}
            </div>
          ) : (
            eventsLoaded && (
              <div className={styles.vesselInfoPlaceholder}>
                {vesselDetailsError ? (
                  <p>
                    Something went wrong loading vessel information{' '}
                    <span role="img" aria-label="monete">
                      🙈
                    </span>
                  </p>
                ) : (
                  <Loader />
                )}
              </div>
            )
          )}
          {eventsLoaded && (
            <div ref={summaryStickyRef} className={styles.activityOverview}>
              <h3>
                <EventsSummary />
              </h3>
            </div>
          )}
          <div className={cx(styles.profileHeader, { [styles.visible]: sticky })}>
            <h3 className={styles.activityOverviewSticky}>
              <EventsSummary vesselTooltip={vesselInfo} />
            </h3>
            <Tooltip content={vesselInfo}>
              <button className={styles.infoBtn} onClick={scrollToTop}>
                <IconInfo />
              </button>
            </Tooltip>
          </div>
        </div>
        <Timeline scrollContainerRef={scrollContainerRef} classNames={timelineClassNames} />
      </div>
    </Fragment>
  )
}

export default Sidebar
