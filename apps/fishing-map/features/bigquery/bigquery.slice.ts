import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { fetchDatasetByIdThunk } from 'features/datasets/datasets.slice'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'utils/async-slice'

interface DebugState {
  active: boolean
  creationStatus: AsyncReducerStatus
  runCostStatus: AsyncReducerStatus
  runCost: number | null
}

const initialState: DebugState = {
  active: false,
  creationStatus: AsyncReducerStatus.Idle,
  runCostStatus: AsyncReducerStatus.Idle,
  runCost: null,
}

export type CreateBigQueryDatasetResponse = {
  id: string
  startDate: string
  endDate: string
  tableRows: number
}

export const fetchBigQueryRunCostThunk = createAsyncThunk(
  'bigQuery/fetchRunCost',
  async ({ query }: { query: string }) => {
    const response = await GFWAPI.fetch<CreateBigQueryDatasetResponse>(
      '/v1/4wings/bq/create-temporal-dataset',
      {
        method: 'POST',
        body: {
          name: 'dryRun',
          ttl: 1,
          query:
            "WITH  total AS (SELECTsegment.vessel_id AS vessel_id,msg.hours AS hours,msg.elevation_m AS elevation_m,msg.lat AS lat,msg.lon AS lon,msg.distance_from_port_m AS distance_from_port_m,msg.distance_from_shore_m AS distance_from_shore_m,msg.nnet_score,'''CHL''' AS flag,msg.source AS fleet,TIMESTAMP_SECONDS(60*60 * DIV(UNIX_SECONDS(timestamp), 60*60)) AS timestampFROM `world-fishing-827.pipe_chile_production_v20200331.chile_fishing_positions_v20201110` msgLEFT JOIN `world-fishing-827.pipe_chile_production_v20200331.segment_vessel` segmentON (segment.seg_id = msg.seg_id AND segment.ssvid = msg.ssvid  AND segment.vessel_id_rank=1)WHERE nnet_score > 0.5AND DATE_TRUNC(EXTRACT(DATE FROM timestamp), YEAR) = '''2019-01-01'''),grouped AS (SELECTsum(IF(nnet_score > 0.5, hours, 0) ) AS hours,avg(elevation_m) AS elevation_m,avg(distance_from_shore_m) AS distance_from_shore_m,avg(distance_from_port_m) AS distance_from_port_m,vessel_id,flag,fleet,timestampFROM totalGROUP BY vessel_id, flag, fleet, timestamp),first AS (SELECTlat,lon,vessel_id,flag,timestamp,row_number() over (PARTITION BY vessel_id, flag, timestamp) AS rowFROM total)SELECTg.vessel_id as id,g.hours as value,g.timestamp,f.lat,f.lonFROM grouped gINNER JOIN first f ON f.vessel_id = g.vessel_id AND f.timestamp = g.timestamp AND f.row = 1 ORDER BY g.vessel_id,g.flag, g.timestamp",
          dryRun: true,
        } as any,
      }
    )
    console.log(response)
    debugger
    return 10
  }
)

export type CreateBigQueryDataset = {
  query: string
  name: string
  ttl?: number
  createAsPublic?: boolean
}

export const createBigQueryDatasetThunk = createAsyncThunk(
  'bigQuery/createDataset',
  async ({ query, name, ttl = 1, createAsPublic = true }: CreateBigQueryDataset, { dispatch }) => {
    const { id } = await GFWAPI.fetch<CreateBigQueryDatasetResponse>(
      '/v1/4wings/bq/create-temporal-dataset',
      {
        method: 'POST',
        body: { query, name, ttl, public: createAsPublic } as any,
      }
    )
    const dataset = await dispatch(fetchDatasetByIdThunk(id))
    return dataset
  }
)

const bigQuerySlice = createSlice({
  name: 'bigQuery',
  initialState,
  reducers: {
    toggleBigQueryMenu: (state) => {
      state.active = !state.active
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBigQueryRunCostThunk.pending, (state, action) => {
      state.runCostStatus = AsyncReducerStatus.Loading
      state.runCost = null
    })
    builder.addCase(fetchBigQueryRunCostThunk.fulfilled, (state, action) => {
      state.runCostStatus = AsyncReducerStatus.Finished
      state.runCost = action.payload
    })
    builder.addCase(fetchBigQueryRunCostThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.runCostStatus = AsyncReducerStatus.Idle
      } else {
        state.runCostStatus = AsyncReducerStatus.Error
      }
    })
    builder.addCase(createBigQueryDatasetThunk.pending, (state, action) => {
      state.creationStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(createBigQueryDatasetThunk.fulfilled, (state, action) => {
      state.creationStatus = AsyncReducerStatus.Finished
    })
    builder.addCase(createBigQueryDatasetThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.creationStatus = AsyncReducerStatus.Idle
      } else {
        state.creationStatus = AsyncReducerStatus.Error
      }
    })
  },
})

export const { toggleBigQueryMenu } = bigQuerySlice.actions

export const selectBigQueryActive = (state: RootState) => state.bigQuery.active
export const selectRunCost = (state: RootState) => state.bigQuery.runCost
export const selectRunCostStatus = (state: RootState) => state.bigQuery.runCostStatus
export const selectCreationStatus = (state: RootState) => state.bigQuery.creationStatus

export default bigQuerySlice.reducer
