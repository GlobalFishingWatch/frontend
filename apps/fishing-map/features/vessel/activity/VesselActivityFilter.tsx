import { useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { IconButton } from '@globalfishingwatch/ui-components'
import VesselEventsLegend from 'features/workspace/vessels/VesselEventsLegend'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.slice'
import TooltipContainer from 'features/workspace/shared/TooltipContainer'
import { selectVisibleEvents } from 'features/app/app.selectors'
import styles from './VesselActivityFilter.module.css'

const VesselActivityFilter = () => {
  const [showEventsLegend, setShowEventsLegend] = useState(false)
  const visibleEvents = useSelector(selectVisibleEvents)
  const dataviews = useSelector(selectVesselsDataviews)
  const toggleEventsLegend = () => {
    setShowEventsLegend(!showEventsLegend)
  }
  return (
    <TooltipContainer
      visible={showEventsLegend}
      className={styles.eventsLegendContainer}
      arrowClass={styles.arrow}
      onClickOutside={toggleEventsLegend}
      placement="left-start"
      component={
        <div className={styles.eventsLegendOptions}>
          <VesselEventsLegend dataviews={dataviews} />
        </div>
      }
    >
      <IconButton
        className={cx(styles.eventsLegendButton, 'print-hidden')}
        size="medium"
        type="border"
        icon={visibleEvents === 'all' ? 'filter-off' : 'filter-on'}
        onClick={toggleEventsLegend}
      />
    </TooltipContainer>
  )
}

export default VesselActivityFilter
