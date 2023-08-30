import { BufferUnit, BufferUnitOption } from 'types'

export const DEFAULT_BUFFER_VALUE: number = 50
export const NAUTICAL_MILES: BufferUnit = 'nauticalmiles'
const KILOMETERS: BufferUnit = 'kilometers'
export const BUFFER_UNIT_OPTIONS: BufferUnitOption[] = [
  { label: 'Nautical miles', id: NAUTICAL_MILES },
  { label: 'Kilometers', id: KILOMETERS },
]
export const DEFAULT_BUFFER_UNIT_OPTION: BufferUnitOption = {
  label: 'Nautical miles',
  id: NAUTICAL_MILES,
}

export const DEFAULT_POINT_BUFFER_UNIT: BufferUnit = NAUTICAL_MILES
export const DEFAULT_POINT_BUFFER_VALUE: number = 100
