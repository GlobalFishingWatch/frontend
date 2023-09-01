import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import styles from './RelatedVessels.module.css'

type RelatedOwnerVesselsProps = {
  owner: string
}

const RelatedOwnerVessels = ({ owner }: RelatedOwnerVesselsProps) => {
  const { t } = useTranslation()
  const ownerLoading = true

  if (ownerLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  return <div className={styles.vesselsList}>List of owners</div>
}

export default RelatedOwnerVessels
