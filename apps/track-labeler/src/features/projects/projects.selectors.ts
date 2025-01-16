import { createSelector } from 'reselect'

import { selectProject } from '../../routes/routes.selectors'
import { ActionType } from '../../types'

type ActionShortcutsType = {
  [A in string]: ActionType
}

export const getActionShortcuts = createSelector([selectProject], (project) => {
  const actionShortcuts: ActionShortcutsType = {
    u: ActionType.untracked,
    f: ActionType.fishing,
    n: ActionType.notfishing,
    t: ActionType.transiting,
    d: ActionType.dredging,
    e: ActionType.nondredging,
    r: ActionType.transporting,
    i: ActionType.discharging,
    s: ActionType.setting,
    m: ActionType.dumping,
    h: ActionType.hauling,
    b: ActionType.btw_set_haul,
    z: ActionType.encounter_other,
    o: ActionType.other,
  }
  const found: string[] = Object.values(actionShortcuts)
  const max =
    project?.labels.reduce((a, b) => {
      return a.name.length > b.name.length ? a : b
    }).name.length || 0
  for (let i = 0; i < max; i++) {
    project?.labels.forEach((label) => {
      if (
        label.name[i] &&
        label.name[i].match(/[a-z]/i) &&
        !actionShortcuts[label.name[i].toLocaleLowerCase()] &&
        !found.includes(label.id)
      ) {
        found.push(label.id)
        actionShortcuts[label.name[i].toLocaleLowerCase()] = label.id as ActionType
      }
    })
  }
  return actionShortcuts
})
