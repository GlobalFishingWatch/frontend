import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { VesselLayer } from '@globalfishingwatch/deck-layers'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Select } from '@globalfishingwatch/ui-components'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'

type SelectOptionWithColor = SelectOption & { color: string }

const TrackCorrection = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const trackDataviews = useSelector(selectTrackDataviews)

  const vesselOptions = useMemo(() => {
    return trackDataviews.map(
      (dataview) =>
        ({
          id: dataview.id,
          label: dataview.config?.name,
          color: dataview.config?.color,
        }) as SelectOptionWithColor
    )
  }, [trackDataviews])

  const [selectedVessel, setSelectedVessel] = useState<SelectOptionWithColor | undefined>(
    vesselOptions?.length ? vesselOptions[0] : undefined
  )

  const vesselLayer = useGetDeckLayer<VesselLayer>(selectedVessel?.id)

  const trackData = useMemo(() => {
    return vesselLayer?.instance
      ?.getVesselTrackSegments({
        includeMiddlePoints: true,
        startTime: getUTCDateTime(start).toMillis(),
        endTime: getUTCDateTime(end).toMillis(),
      })
      .filter((segment) => segment.length > 0)
  }, [end, start, vesselLayer?.instance])

  return (
    <div>
      <Select
        label={t('common.vessel', 'Vessel')}
        options={vesselOptions}
        disabled={vesselOptions?.length <= 1}
        selectedOption={selectedVessel}
        onSelect={(option) => setSelectedVessel(option as SelectOptionWithColor)}
      />
    </div>
  )
}

export default TrackCorrection
