import { Fragment, useCallback } from 'react'
import { useUser } from 'features/user/user.hooks'
import RiskSection from 'features/risk-section/risk-section'
import RiskIndicator from 'features/risk-indicator/risk-indicator'
import useRisk from 'features/risk/risk.hook'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import styles from './risk-summary.module.css'

/* eslint-disable-next-line */
export interface RiskSummaryProps {}

export function RiskSummary(props: RiskSummaryProps) {
  const { authorizedInsurer } = useUser()
  const { encountersInMPA, fishingInMPA, loiteringInMPA } = useRisk()

  const openModal = useCallback((event: RenderedEvent) => {
    console.log('info', event)
  }, [])
  const onEventMapClick = useCallback((event: RenderedEvent) => {
    console.log('display in map', event)
  }, [])

  if (!authorizedInsurer) return <Fragment />
  return (
    <div className={styles['container']}>
      {fishingInMPA.length > 0 && (
        <RiskSection severity="medium" title="Fishing">
          <RiskIndicator
            title="fishing in an MPA"
            events={fishingInMPA}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {encountersInMPA.length > 0 && (
        <RiskSection severity="medium" title="Encounters">
          <RiskIndicator
            title="encounters in an MPA"
            events={encountersInMPA}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {loiteringInMPA.length > 0 && (
        <RiskSection severity="medium" title="Loitering">
          <RiskIndicator
            title="loitering in an MPA"
            events={loiteringInMPA}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {/* <RiskSection severity="med" title="Med">
        Med
      </RiskSection>
      <RiskSection severity="low" title="Low" titleInfo={<Fragment>some info</Fragment>}>
        Low
      </RiskSection>
      <RiskSection severity="none" title="None">
        None
      </RiskSection> */}
    </div>
  )
}

export default RiskSummary
