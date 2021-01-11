import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import vesselImage from 'assets/images/vessel-side@2x.png'
import styles from './SearchNoResultsState.module.css'

type SearchNoResultsProps = {
  className?: string
}

function SearchNoResultsState({ className = '' }: SearchNoResultsProps) {
  const { t } = useTranslation()
  return (
    <div className={cx(styles.emptyState, className)}>
      <div>
        <img src={vesselImage} alt="vessel" className={styles.vesselImage} />
        <p>
          {t(
            'vessel.search.no_results',
            "Can't find the vessel you are looking for? Try using MMSI, IMO or IRCS"
          )}
        </p>
      </div>
    </div>
  )
}

export default SearchNoResultsState
