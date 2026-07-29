import { describe, expect, it } from 'vitest'

import { getVesselsFiltered } from './area-reports.utils'

// ponytail: only covers the whole-label gear/type matching, the part with a real branch
describe('getVesselsFiltered', () => {
  const vessels = [
    { id: '1', geartype: 'Palangre a la deriva' },
    { id: '2', geartype: 'Jiggers de calamar' },
    { id: '3', geartype: 'Jiggers de calamar, Palangre a la deriva' },
    { id: '4', geartype: 'Palangres' },
  ]

  it('matches whole gear labels, primary or secondary, never word fragments', () => {
    const filtered = getVesselsFiltered(vessels, 'gear:Palangre a la deriva')
    // '2' has no such label, '4' ('Palangres') must not match on shared word fragments
    expect(filtered.map((v) => v.id)).toEqual(['1', '3'])
  })

  it('excludes matching vessels when negated', () => {
    const filtered = getVesselsFiltered(vessels, '-gear:Palangres')
    expect(filtered.map((v) => v.id)).toEqual(['1', '2', '3'])
  })
})
