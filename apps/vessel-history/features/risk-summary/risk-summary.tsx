import { Fragment } from 'react'
import { useUser } from 'features/user/user.hooks'
import styles from './risk-summary.module.css'

/* eslint-disable-next-line */
export interface RiskSummaryProps {}

export function RiskSummary(props: RiskSummaryProps) {
  const { authorizedInsurer } = useUser()
  if (!authorizedInsurer) return <Fragment />
  return (
    <div className={styles['container']}>
      <h1>Welcome to RiskSummary!</h1>
    </div>
  )
}

export default RiskSummary
