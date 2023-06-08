import { EventTypes } from '@globalfishingwatch/api-types'
export const FEATURE_ROW_INDEX = 0
export const FEATURE_COL_INDEX = 1
export const FEATURE_CELLS_START_INDEX = 2

export const CELL_NUM_INDEX = 0
export const CELL_START_INDEX = 1
export const CELL_END_INDEX = 2
export const CELL_VALUES_START_INDEX = 3

// Values from the 4wings API in intArray form can't be floats, so they are multiplied by a factor, here we get back to the original value
export const VALUE_MULTIPLIER = 100

// Because timestamps are stored as 32-bit floating numbers, raw unix epoch time can not be used.
// You may test the validity of a timestamp by calling Math.fround(t) to check if there would be any loss of precision.
// Also deduct start timestamp from each data point to avoid overflow
export const START_TIMESTAMP = new Date('2012-01-01T00:00:00.000Z').getTime()

export const EVENT_TYPES_ORDINALS: { [key in EventTypes]: number } = {
  port_visit: 0,
  encounter: 1,
  fishing: 2,
  gap: 3,
  loitering: 4,
}
