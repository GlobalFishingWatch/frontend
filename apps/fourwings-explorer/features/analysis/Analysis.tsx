import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import styles from './Analysis.module.css'

const Analysis = () => {
  const router = useRouter()
  const { id, areaId } = router.query

  const onCloseClick = useCallback(() => {
    const { id, areaId, ...rest } = router.query
    router.push({ pathname: '/', query: rest })
  }, [router])

  return (
    <div className={styles.main}>
      <div className={styles.mapContainer}>
        <IconButton icon="close" onClick={onCloseClick} />
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
