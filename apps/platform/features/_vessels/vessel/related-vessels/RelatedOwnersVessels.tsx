import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq, uniqBy } from 'es-toolkit'
import { useSearchByOwnerQuery } from 'queries/map/search-api'

import type { VesselRegistryOwner } from '@globalfishingwatch/api-types'
import { Spinner, Tooltip } from '@globalfishingwatch/ui-components'

import { useTimerangeConnect } from 'features/_map/timebar/timebar.hooks'
import RelatedVessel from 'features/_vessels/vessel/related-vessels/RelatedVessel'
import { selectVesselInfoData } from 'features/_vessels/vessel/selectors/vessel.selectors'
import { selectVesselDatasetId } from 'features/_vessels/vessel/vessel.config.selectors'
import {
  filterRegistryInfoByDateAndSSVID,
  getVesselId,
  getVesselProperty,
} from 'features/_vessels/vessel/vessel.utils'
import I18nDate from 'features/i18n/i18nDate'
import { formatInfoField } from 'utils/info'

import styles from './RelatedVessels.module.css'

type OwnerVesselsProps = {
  owner: string
  ownerFlag?: string
  dataset: string
  ignoreVessel?: string
}
const OwnerVessels = ({ owner, ownerFlag, dataset, ignoreVessel }: OwnerVesselsProps) => {
  const { t } = useTranslation()

  const { data, isFetching } = useSearchByOwnerQuery(
    {
      owner,
      ownerFlag,
      datasets: [dataset],
    },
    {
      skip: !owner || !dataset,
    }
  )

  if (isFetching) {
    return (
      <div className={styles.placeholder}>
        <Spinner size="small" />
      </div>
    )
  }

  const vessels = data?.entries?.filter((v) => getVesselProperty(v, 'id') !== ignoreVessel)

  if (!vessels?.length) {
    return (
      <p className={cx(styles.secondary, styles.ownersList)}>{t((t) => t.vessel.noOwnersMatch)}</p>
    )
  }

  return (
    <ul className={styles.ownersList}>
      {vessels?.map((vessel) => {
        return (
          <li key={getVesselId(vessel)} className={styles.vessel}>
            <RelatedVessel vessel={vessel} />
          </li>
        )
      })}
    </ul>
  )
}

const RelatedOwnerVessels = () => {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const dataset = useSelector(selectVesselDatasetId)
  const { timerange } = useTimerangeConnect()
  const filteredOwners = filterRegistryInfoByDateAndSSVID(
    vesselData?.registryOwners || [],
    timerange
  ) as VesselRegistryOwner[]
  const uniqOwners = uniqBy(filteredOwners, (o) => `${o.name}-${o.flag}`)
  const vesselId = getVesselProperty(vesselData, 'id')

  if (!uniqOwners?.length) {
    return <p className={styles.enptyState}>{t((t) => t.vessel.noOwners)}</p>
  }

  return (
    <ul className={styles.vesselsList}>
      {uniqOwners?.map((owner) => {
        const ownerRecords = filteredOwners.filter(
          (o) => o.name === owner.name && o.flag === owner.flag
        )
        const sources = uniq(ownerRecords.flatMap((o) => o.sourceCode ?? []))
        const ssvids = uniq(ownerRecords.map((o) => o.ssvid).filter(Boolean))
        const tooltip =
          sources.length || ssvids.length ? (
            <div>
              {sources.length > 0 && (
                <div>
                  {t((t) => t.vessel.source)}: {sources.join(', ')}
                </div>
              )}
              {ssvids.length > 0 && (
                <div>
                  {t((t) => t.vessel.mmsi)}: {ssvids.join(', ')}
                </div>
              )}
            </div>
          ) : null
        return (
          <li
            key={`${owner.name}-${owner.flag}-${owner.dateFrom}-${owner.dateTo}`}
            className={styles.vessel}
          >
            <Tooltip content={tooltip}>
              <span className={cx({ [styles.help]: tooltip !== null })}>
                {formatInfoField(owner.name, 'owner')} ({formatInfoField(owner.flag, 'flag')})
              </span>
            </Tooltip>{' '}
            <span className={styles.secondary}>
              <I18nDate date={owner.dateFrom} /> - <I18nDate date={owner.dateTo} />
            </span>
            <OwnerVessels
              owner={owner.name}
              ownerFlag={owner.flag}
              dataset={dataset}
              ignoreVessel={vesselId}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default RelatedOwnerVessels
