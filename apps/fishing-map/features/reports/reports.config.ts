import { BufferUnit, BufferOperation } from 'types'

export const DEFAULT_BUFFER_VALUE: number = 50
export const NAUTICAL_MILES: BufferUnit = 'nauticalmiles'
export const KILOMETERS: BufferUnit = 'kilometers'

export const DISSOLVE: BufferOperation = 'dissolve'
export const DIFFERENCE: BufferOperation = 'difference'
export const DEFAULT_BUFFER_OPERATION: BufferOperation = DISSOLVE

export const DEFAULT_POINT_BUFFER_UNIT: BufferUnit = NAUTICAL_MILES
export const DEFAULT_POINT_BUFFER_VALUE: number = 5
