import React, { useState, useEffect, Fragment, useMemo } from 'react'
import uniqBy from 'lodash/uniqBy'
import { event as uaEvent } from 'react-ga'
import Daterange from 'components/filters/daterange/daterange'
import Slider, { SliderRange } from 'components/filters/slider/slider'
import Select, { SelectOptions } from 'components/filters/select/select'
import { SearchItem, DatasetDates, ValueOf } from 'types/app.types'
import { useSmallScreen } from 'hooks/screen.hooks'
import Loader from 'components/loader/loader'
import { SEARCH_TYPES_MUTUALLY_EXCLUSIVE, EVENT_DURATION_RANGE, TOOLTIPS } from 'data/constants'
import styles from './filters.module.css'

export interface DateRange {
  start: string | null
  end: string | null
}

interface FiltersProps {
  isLoading: boolean
  datasetDates: DatasetDates
  vessel: SearchItem | null
  filters: {
    dateRange: DateRange
    flag: SearchItem[]
    flagDonor: SearchItem[]
    eez: SearchItem[]
    rfmo: SearchItem[]
    port: SearchItem[]
    durationRange: SliderRange
  }
  vesselOptions: SelectOptions[] | null
  eezOptions: SelectOptions[] | null
  rfmosOptions: SelectOptions[] | null
  flagsOptions: SelectOptions[] | null
  donorFlagsOptions: SelectOptions[] | null
  portsOptions: SelectOptions[] | null
  setFiltersSelection: (query: FiltersState, datasetDates: DatasetDates) => void
  onActionClickCb: (query?: FiltersState) => void
}

type arrayFilters = 'flag' | 'flagDonor' | 'port' | 'rfmo' | 'eez'
export interface FiltersState {
  dateRange: DateRange
  rfmo: SearchItem[]
  eez: SearchItem[]
  flag: SearchItem[]
  flagDonor: SearchItem[]
  port: SearchItem[]
  durationRange: SliderRange
  vessel?: SearchItem
}

const sliderConfig = {
  step: 1,
  min: EVENT_DURATION_RANGE[0],
  max: EVENT_DURATION_RANGE[1],
}

const Filters: React.FC<FiltersProps> = (props): React.ReactElement => {
  const { isLoading, filters, datasetDates, vessel, setFiltersSelection, onActionClickCb } = props
  const { flag, flagDonor, rfmo, eez, port, dateRange, durationRange } = filters

  const [state, setState] = useState<FiltersState>(filters)

  const setDateRangeChange = (dateRange: DateRange) => {
    setState((prevState) => {
      return { ...prevState, dateRange }
    })
  }

  const handleDateAfterChange = (e: React.FormEvent<HTMLInputElement>) => {
    const start = new Date(e.currentTarget.value).toISOString()
    setState((prevState) => {
      const dateRange = {
        start: start,
        end: prevState.dateRange.end,
      }
      return { ...prevState, dateRange }
    })
  }

  const handleDateBeforeChange = (e: React.FormEvent<HTMLInputElement>) => {
    const end = new Date(e.currentTarget.value).toISOString()
    setState((prevState) => {
      const dateRange = {
        start: prevState.dateRange.start,
        end: end,
      }
      return { ...prevState, dateRange }
    })
  }

  const handleArrayFilterChange = (filter: arrayFilters, item: SelectOptions) => {
    setState((prevState: FiltersState) => {
      const state = { ...prevState }
      const mutuallyExclusiveFields = SEARCH_TYPES_MUTUALLY_EXCLUSIVE[filter]
      if (mutuallyExclusiveFields) {
        mutuallyExclusiveFields.forEach((field) => {
          ;(state as any)[field] = null
        })
      }
      const currentValues = prevState[filter] || []
      const values = item.values ? item.values : [item]

      return {
        ...state,
        [filter]: uniqBy([...currentValues, ...values], 'id'),
      }
    })
  }

  const handleArrayFilterRemove = (filter: arrayFilters, item: SelectOptions) => {
    setState((prevState: FiltersState) => {
      const currentValues = prevState[filter].filter((f) => f.id !== item.id)
      return { ...prevState, [filter]: currentValues }
    })
  }

  const handleDateClean = (date: 'start' | 'end') => {
    const dateRange =
      date === 'start'
        ? { start: datasetDates.start, end: state.dateRange.end }
        : { start: state.dateRange.start, end: datasetDates.end }
    setDateRangeChange(dateRange)
  }

  const setFilterValue = (filter: string, value?: ValueOf<FiltersState> | null) => {
    setState((prevState: FiltersState) => {
      return { ...prevState, [filter]: value }
    })
  }

  useEffect(() => {
    setDateRangeChange(dateRange)
  }, [dateRange])

  useEffect(() => {
    setFilterValue('flag', flag)
  }, [flag])

  useEffect(() => {
    setFilterValue('flagDonor', flagDonor)
  }, [flagDonor])

  useEffect(() => {
    setFilterValue('rfmo', rfmo)
  }, [rfmo])

  useEffect(() => {
    setFilterValue('port', port)
  }, [port])

  useEffect(() => {
    setFilterValue('eez', eez)
  }, [eez])

  useEffect(() => {
    setFilterValue('durationRange', durationRange)
  }, [durationRange])

  useEffect(() => {
    setFilterValue('vessel', vessel)
  }, [vessel])

  const onApplyFiltersClick = () => {
    uaEvent({
      category: 'CVP - Search Vessel',
      action: 'Apply filters',
      label: JSON.stringify(state),
    })
    setFiltersSelection(state, datasetDates)
    onActionClickCb()
  }

  const formatAsDate = (date: string | null) => {
    if (date === null) return ''
    return new Date(date).toISOString().slice(0, 10)
  }

  const smallScreen = useSmallScreen()
  const selectedVessel = useMemo(() => (state.vessel ? [state.vessel] : []), [state.vessel])
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobileDevice = userAgent.match(/android|iphone|ipad|ipod/i)

  const vesselOptionsMerged: SelectOptions[] = useMemo(() => {
    return props.vesselOptions !== null
      ? uniqBy([...props.vesselOptions, ...selectedVessel], 'id')
      : selectedVessel
  }, [props.vesselOptions, selectedVessel])

  if (isLoading) return <Loader />

  return (
    <div className={styles.filterSelectors}>
      {!smallScreen ? (
        <Daterange
          label="Time Range"
          className={styles.datePicker}
          dateRange={state.dateRange}
          datasetDates={datasetDates}
          setDateRange={setDateRangeChange}
          onCleanClick={handleDateClean}
        />
      ) : (
        <Fragment>
          <div>
            <label>start</label>
            <input
              className={styles.dateInput}
              type="date"
              min={formatAsDate(datasetDates.start)}
              max={formatAsDate(datasetDates.end)}
              onChange={handleDateAfterChange}
              value={formatAsDate(state.dateRange.start)}
            />
          </div>
          <div>
            <label>end</label>
            <input
              className={styles.dateInput}
              type="date"
              min={formatAsDate(datasetDates.start)}
              max={formatAsDate(datasetDates.end)}
              onChange={handleDateBeforeChange}
              value={formatAsDate(state.dateRange.end)}
            />
          </div>
        </Fragment>
      )}
      <Select
        label="Area of activity (RFMO)"
        typeLabel="area"
        options={props.rfmosOptions}
        selectedItems={state.rfmo}
        onSelectedItem={(rfmo) => handleArrayFilterChange('rfmo', rfmo)}
        onRemoveItem={(rfmo) => handleArrayFilterRemove('rfmo', rfmo)}
        onCleanClick={() => setFilterValue('rfmo', null)}
      />
      <Select
        label="Area of activity (EEZ)"
        typeLabel="area"
        options={props.eezOptions}
        selectedItems={state.eez}
        onSelectedItem={(eez) => handleArrayFilterChange('eez', eez)}
        onRemoveItem={(eez) => handleArrayFilterRemove('eez', eez)}
        onCleanClick={() => setFilterValue('eez', null)}
      />
      <Select
        label="Carriers flag States"
        typeLabel="flag State"
        tooltip={TOOLTIPS.flagStates}
        options={props.flagsOptions}
        selectedItems={state.flag}
        onSelectedItem={(flag) => handleArrayFilterChange('flag', flag)}
        onRemoveItem={(flag) => handleArrayFilterRemove('flag', flag)}
        onCleanClick={() => setFilterValue('flag', null)}
      />
      <Select
        label="Donor vessel flag States"
        typeLabel="flag State"
        tooltip={TOOLTIPS.flagStates}
        options={props.donorFlagsOptions}
        selectedItems={state.flagDonor}
        onSelectedItem={(flagDonor) => handleArrayFilterChange('flagDonor', flagDonor)}
        onRemoveItem={(flagDonor) => handleArrayFilterRemove('flagDonor', flagDonor)}
        onCleanClick={() => setFilterValue('flagDonor', null)}
      />
      <Select
        label="Ports visited after the event"
        typeLabel="port"
        options={props.portsOptions}
        selectedItems={state.port}
        onSelectedItem={(port) => handleArrayFilterChange('port', port)}
        onRemoveItem={(port) => handleArrayFilterRemove('port', port)}
        onCleanClick={() => setFilterValue('port', null)}
      />
      <Slider
        label="Event duration (hours)"
        config={sliderConfig}
        range={state.durationRange}
        onChange={(durationRange) => setFilterValue('durationRange', durationRange)}
      />
      <Select
        label="Vessels"
        typeLabel="vessel"
        options={vesselOptionsMerged}
        asyncUrl={`/vessels?query={{query}}&querySuggestions=true&offset=0`}
        selectedItems={selectedVessel}
        onSelectedItem={(vessel) => setFilterValue('vessel', vessel)}
        onRemoveItem={() => setFilterValue('vessel', null)}
        onCleanClick={() => setFilterValue('vessel', null)}
      />
      {!isMobileDevice && (
        <span className={styles.placeholder}>
          Press {userAgent.includes('mac') ? '⌘' : 'Ctrl'} + D after applying filters to bookmark
          this page with your selected filters.
        </span>
      )}
      <button className={styles.primaryBtn} onClick={onApplyFiltersClick}>
        Apply filters
      </button>
    </div>
  )
}

export default Filters
