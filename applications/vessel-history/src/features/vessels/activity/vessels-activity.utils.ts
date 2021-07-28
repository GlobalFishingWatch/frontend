import { ActivityEvent } from 'types/activity'

export const groupEvents = (events: ActivityEvent[]) => {
  console.error('not implemented yet')
}

export const getEncounterStatus = (event: ActivityEvent): string => {
  return event.encounter?.authorizationStatus || ''
}


// const equals = (a: GroupRegions[], b: GroupRegions[]) =>
//   a.length === b.length && a.every((v, i) => v.type === b[i].type && v.id === b[i].id)

// export const groupEvents = (events: ActivityEvent[]) => {
//   const groups: ActivityEventGroup[] = []
//   events.forEach((event) => {
//     const places: GroupRegions[] = []
//     if (event.regions.eez[0]) {
//       const place: GroupRegions = {
//         id: event.regions.eez[0],
//         type: MarineRegionType.eez,
//       }
//       places.push(place)
//     }
//     if (event.regions.rfmo[0]) {
//       const place: GroupRegions = {
//         id: event.regions.rfmo[0],
//         type: MarineRegionType.rfmo,
//       }
//       places.push(place)
//     }

//     if (
//       !groups.length ||
//       groups[groups.length - 1].event_type !== event.type ||
//       !equals(groups[groups.length - 1].event_places, places)
//     ) {
//       const newGroup = {
//         event_type: event.type,
//         event_places: places,
//         ocean: event.regions.ocean[0],
//         start: event.start,
//         end: event.end,
//         open: true,
//         entries: [event],
//       }
//       groups.push(newGroup)
//     } else if (
//       groups[groups.length - 1].event_type === event.type &&
//       equals(groups[groups.length - 1].event_places, places)
//     ) {
//       groups[groups.length - 1].entries.push(event)
//       groups[groups.length - 1].end = event.end
//       groups[groups.length - 1].open = false
//     }
//   })
//   return groups
// }
