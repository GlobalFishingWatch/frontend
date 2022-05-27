import { Fragment } from 'react'
import { useUser } from 'features/user/user.hooks'
import RiskSection from 'features/risk-section/risk-section'
import styles from './risk-summary.module.css'

/* eslint-disable-next-line */
export interface RiskSummaryProps {}

export function RiskSummary(props: RiskSummaryProps) {
  const { authorizedInsurer } = useUser()
  if (!authorizedInsurer) return <Fragment />
  return (
    <div className={styles['container']}>
      <RiskSection severity="high" title="IUU">
        High
      </RiskSection>
      <RiskSection severity="med" title="Med">
        Med
      </RiskSection>
      <RiskSection severity="low" title="Low" titleInfo={<Fragment>some info</Fragment>}>
        Low
      </RiskSection>
      <RiskSection severity="none" title="None">
        None
      </RiskSection>
    </div>
  )
}

export default RiskSummary
