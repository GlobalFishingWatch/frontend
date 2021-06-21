import { getEEZ, getMPA } from './marine-regions'

test('list eez', () => {
  expect(Object.keys(getMPA())).toEqual([])
})
