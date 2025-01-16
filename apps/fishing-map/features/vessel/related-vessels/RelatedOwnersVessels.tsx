import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniqBy } from 'es-toolkit'
import { useSearchByOwnerQuery } from 'queries/search-api'

import type { VesselRegistryOwner } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'

import I18nDate from 'features/i18n/i18nDate'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import RelatedVessel from 'features/vessel/related-vessels/RelatedVessel'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { selectVesselDatasetId } from 'features/vessel/vessel.config.selectors'
import {
  filterRegistryInfoByDateAndSSVID,
  getVesselId,
  getVesselProperty,
} from 'features/vessel/vessel.utils'
import { formatInfoField } from 'utils/info'

import styles from './RelatedVessels.module.css'

type OwnerVesselsProps = { owner: string; dataset: string; ignoreVessel?: string }
const OwnerVessels = ({ owner, dataset, ignoreVessel }: OwnerVesselsProps) => {
  const { t } = useTranslation()

  const { data, isFetching } = useSearchByOwnerQuery(
    {
      owner,
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
      <p className={cx(styles.secondary, styles.ownersList)}>
        {t('vessel.noOwnersMatch', "We can't find other vessels with this owner")}
      </p>
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
  const vesselData = useSelector(selectVesselInfoData)
  const dataset = useSelector(selectVesselDatasetId)
  const { timerange } = useTimerangeConnect()
  const filteredOwners = filterRegistryInfoByDateAndSSVID(
    vesselData?.registryOwners || [],
    timerange
  ) as VesselRegistryOwner[]
  const uniqOwners = uniqBy(filteredOwners, (o) => o.name)
  const vesselId = getVesselProperty(vesselData, 'id')

  return (
    <ul className={styles.vesselsList}>
      {uniqOwners?.map((owner) => {
        return (
          <li className={styles.vessel}>
            {formatInfoField(owner.name, 'owner')} ({formatInfoField(owner.flag, 'flag')}){' '}
            <span className={styles.secondary}>
              <I18nDate date={owner.dateFrom} /> - <I18nDate date={owner.dateTo} />
            </span>
            <OwnerVessels owner={owner.name} dataset={dataset} ignoreVessel={vesselId} />
          </li>
        )
      })}
    </ul>
  )
}

export default RelatedOwnerVessels
