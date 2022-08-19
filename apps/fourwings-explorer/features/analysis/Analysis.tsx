import { useRouter } from 'next/router'
import Link from 'next/link'
import { IconButton } from '@globalfishingwatch/ui-components'
import styles from './Analysis.module.css'

const Analysis = () => {
  const router = useRouter()
  const { id, areaId, ...rest } = router.query

  return (
    <div className={styles.main}>
      <div className={styles.mapContainer}>
        <Link
          href={{
            pathname: '/',
            query: rest,
          }}
        >
          <IconButton icon="close" />
        </Link>
        <h2>
          Analysis for:
          <br />
          datasetId:{id}
          <br />
          areaId: {areaId}
        </h2>
      </div>
    </div>
  )
}

export default Analysis
