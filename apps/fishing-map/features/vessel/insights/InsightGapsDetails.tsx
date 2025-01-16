import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useGetVesselEventsQuery } from 'queries/vessel-events-api'

import type { InsightResponse } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { removeNonTunaRFMO } from 'features/vessel/insights/insights.utils'
import { getVesselIdentities } from 'features/vessel/vessel.utils'

import type VesselEvent from '../activity/event/Event'
import Event from '../activity/event/Event'
import { selectVesselInfoData } from '../selectors/vessel.selectors'

import styles from './Insights.module.css'

const InsightGapsDetails = ({
  insightData,
  toggleVisibility,
  visible,
}: {
  insightData?: InsightResponse
  toggleVisibility: () => void
  visible: boolean
}) => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const identities = getVesselIdentities(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })

  const { data, isLoading } = useGetVesselEventsQuery(
    {
      vessels: identities?.map((i) => i.id),
      datasets: insightData?.gap?.datasets || [],
      'start-date': start,
      'end-date': end,
    },
    { skip: !visible }
  )

  return (
    <Fragment>
      <IconButton
        size="small"
        onClick={toggleVisibility}
        className={styles.seeMoreBtn}
        loading={isLoading}
        tooltip={
          visible
            ? t('vessel.insights.gapsSeeLess', 'See less')
            : t('vessel.insights.gapsSeeMore', 'See more')
        }
        icon={visible ? 'arrow-top' : 'arrow-down'}
      />
      {visible && data?.entries && data?.entries?.length > 0 && (
        <ul className={styles.eventDetailsList}>
          {[...data.entries]
            .reverse()
            .map(removeNonTunaRFMO)
            .map((event: VesselEvent) => (
              <Event key={event.id} event={event} className={styles.event} />
            ))}
        </ul>
      )}
    </Fragment>
  )
}

export default InsightGapsDetails
