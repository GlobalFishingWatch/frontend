import { useCallback } from 'react'

import type { EventType, EventTypes } from '@globalfishingwatch/api-types'
import type { SwitchEvent } from '@globalfishingwatch/ui-components'
import { Switch } from '@globalfishingwatch/ui-components'

import { EVENTS_COLORS } from 'data/map/config'
import {
  isVesselEventVisible,
  useVisibleVesselEvents,
} from 'features/_map/workspace/vessels/vessel-events.hooks'

type VesselEventToggleProps = {
  eventType: EventTypes | EventType
  color?: string
  className?: string
  onToggle?: (eventType: EventType) => void
}

function VesselEventToggle({
  eventType,
  color = EVENTS_COLORS[eventType],
  className,
  onToggle,
}: VesselEventToggleProps) {
  const { visibleEvents, setVesselEventVisibility } = useVisibleVesselEvents()

  const onEventChange = useCallback(
    (event: SwitchEvent) => {
      const eventTypeChanged = event.currentTarget.id as EventType
      setVesselEventVisibility({ event: eventTypeChanged, visible: !event.active })
      onToggle?.(eventTypeChanged)
    },
    [onToggle, setVesselEventVisibility]
  )

  return (
    <Switch
      active={isVesselEventVisible(visibleEvents, eventType)}
      onClick={onEventChange}
      id={eventType}
      color={color}
      className={className}
    />
  )
}

export default VesselEventToggle
