import { Spinner } from '@globalfishingwatch/ui-components'

import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { useVesselProfileEncounterLayer } from 'features/vessel/vessel.hooks'

import type VesselEvent from './Event'

interface EventEncounterIconProps {
  event: VesselEvent
  className?: string
}

const EventEncounterIcon = ({ event, className = '' }: EventEncounterIconProps) => {
  const encounterLayer = useVesselProfileEncounterLayer()

  if (event.type !== 'encounter') {
    return null
  }

  if (!encounterLayer?.instance?.getVesselTracksLayersLoaded()) {
    return <Spinner size="tiny" inline className={className} />
  }

  return (
    <svg className={className} width="16" height="16">
      <path
        fill={encounterLayer.instance.getColor() || COLOR_PRIMARY_BLUE}
        stroke={COLOR_PRIMARY_BLUE}
        strokeOpacity=".5"
        d="M15.23.75v6.36l-7.8 7.8-1.58-4.78-4.78-1.59L8.87.75h6.36Z"
      />
    </svg>
  )
}

export default EventEncounterIcon
