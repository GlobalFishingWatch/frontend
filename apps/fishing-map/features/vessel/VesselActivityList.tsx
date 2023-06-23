import { useSelector } from 'react-redux'
import { selectVesselEventsFilteredByTimerange } from 'features/vessel/vessel.selectors'

export const VesselActivityList = () => {
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  console.log(events)
  if (!events?.length) return null
  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>{event.id}</li>
      ))}
    </ul>
  )
}
