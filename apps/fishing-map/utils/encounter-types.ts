export function getEncounterTypesFromId(encounterTypeId: string): string[] {
  const [first, second] = encounterTypeId.split('-')
  if (first && second) {
    if (first === second) {
      // when equal not need to add the reverse value
      return [`${first}-${second}`]
    }
    return [`${first}-${second}`, `${second}-${first}`]
  }
  return [encounterTypeId]
}

export function getEncounterTypesFromIds(encounterTypeIds?: string | string[]): string[] {
  if (!encounterTypeIds) {
    return []
  }
  const ids = Array.isArray(encounterTypeIds) ? encounterTypeIds : [encounterTypeIds]
  return [...new Set(ids.flatMap(getEncounterTypesFromId))]
}
