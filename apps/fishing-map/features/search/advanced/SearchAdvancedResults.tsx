import { useSelector } from 'react-redux'
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { uniq } from 'es-toolkit'
import { IconButton, Tooltip, TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import {
  VesselLastIdentity,
  cleanVesselSearchResults,
  selectSearchResults,
  selectSearchStatus,
  selectSelectedVessels,
  setSelectedVessels,
} from 'features/search/search.slice'
import {
  formatInfoField,
  EMPTY_FIELD_PLACEHOLDER,
  getVesselGearTypeLabel,
  getVesselShipTypeLabel,
  getVesselOtherNamesLabel,
} from 'utils/info'
import I18nFlag from 'features/i18n/i18nFlag'
import { AsyncReducerStatus } from 'utils/async-slice'
import { SearchComponentProps } from 'features/search/basic/SearchBasic'
import { useAppDispatch } from 'features/app/app.hooks'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import { Locale } from 'types'
import { VesselSearchState } from 'features/search/search.types'
import I18nDate from 'features/i18n/i18nDate'
import {
  VesselIdentityProperty,
  getBestMatchCriteriaIdentity,
  getOtherVesselNames,
  getSearchIdentityResolved,
  getVesselProperty,
} from 'features/vessel/vessel.utils'
import { IdentityVesselData } from 'features/vessel/vessel.slice'
import I18nNumber from 'features/i18n/i18nNumber'
import VesselLink from 'features/vessel/VesselLink'
import { selectIsStandaloneSearchLocation } from 'routes/routes.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useSearchFiltersConnect } from 'features/search/search.hook'
import styles from '../basic/SearchBasicResult.module.css'

const PINNED_COLUMN = 'shipname'
const TOOLTIP_LABEL_CHARACTERS = 25
const MULTIPLE_SELECTION_FILTERS_COLUMN = ['flag', 'shiptypes', 'geartypes', 'owner']

type CellWithFilterProps = {
  vessel: IdentityVesselData
  column: VesselIdentityProperty
  children: React.ReactNode
  identitySource?: VesselIdentitySourceEnum
  onClick?: (params: { query?: string; filters?: VesselSearchState }) => void
}
function CellWithFilter({
  vessel,
  column,
  children,
  identitySource,
  onClick,
}: CellWithFilterProps) {
  const { setSearchFilters, searchFilters } = useSearchFiltersConnect()
  const value = getVesselProperty(vessel, column, { identitySource }) as string
  const onFilterClick = useCallback(() => {
    let filter: string | string[] = value
    if (MULTIPLE_SELECTION_FILTERS_COLUMN.includes(column)) {
      filter = column === 'owner' ? value.split(', ') : Array.isArray(value) ? value : [value]
    }
    setSearchFilters({ [column]: filter })
    if (onClick) {
      onClick({
        filters: { ...searchFilters, [column]: filter },
      })
    }
  }, [column, onClick, searchFilters, setSearchFilters, value])

  const showFilter = value && !(searchFilters as any)[column]?.includes(value)

  if (!showFilter) return children

  return (
    <div className={styles.cellFilter}>
      {value && (
        <IconButton
          className={styles.cellFilterBtn}
          size="small"
          onClick={onFilterClick}
          icon="filter-off"
        />
      )}
      {children}
    </div>
  )
}

function SearchAdvancedResults({ fetchResults, fetchMoreResults }: SearchComponentProps) {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { searchFilters } = useSearchFiltersConnect()
  const searchStatus = useSelector(selectSearchStatus)
  const searchResults = useSelector(selectSearchResults)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const isSearchLocation = useSelector(selectIsStandaloneSearchLocation)
  const { setTimerange } = useTimerangeConnect()

  const onVesselClick = useCallback(
    (e: MouseEvent, vessel: VesselLastIdentity) => {
      if (!e.ctrlKey && !e.shiftKey && !e.metaKey) {
        dispatch(cleanVesselSearchResults())
      }
      if (isSearchLocation) {
        setTimerange({ start: vessel.transmissionDateFrom, end: vessel.transmissionDateTo })
      }
    },
    [dispatch, isSearchLocation, setTimerange]
  )

  const columns = useMemo((): MRT_ColumnDef<any>[] => {
    const selfReportedColums: MRT_ColumnDef<any>[] = [
      {
        id: 'gfw_shiptypes',
        accessorFn: (vessel: IdentityVesselData) => {
          const shiptypes = getVesselProperty(vessel, 'shiptypes', {
            identitySource: VesselIdentitySourceEnum.SelfReported,
          })
          const label = getVesselShipTypeLabel({ shiptypes })
          return (
            <CellWithFilter vessel={vessel} column="shiptypes" onClick={fetchResults}>
              {label || EMPTY_FIELD_PLACEHOLDER}
            </CellWithFilter>
          )
        },
        header: t('vessel.gfw_shiptypes', 'GFW Vessel Type'),
      },
      {
        id: 'gfw_geartypes',
        accessorFn: (vessel: IdentityVesselData) => {
          const geartypes = getVesselProperty(vessel, 'geartypes', {
            identitySource: VesselIdentitySourceEnum.SelfReported,
          })
          const label = getVesselGearTypeLabel({ geartypes })
          return (
            <CellWithFilter vessel={vessel} column="geartypes" onClick={fetchResults}>
              <Tooltip content={label?.length > TOOLTIP_LABEL_CHARACTERS ? label : ''}>
                <span>{label}</span>
              </Tooltip>
            </CellWithFilter>
          )
        },
        header: t('vessel.gfw_geartypes', 'GFW Gear Type'),
      },
    ]
    const registryColumns: MRT_ColumnDef<any>[] = [
      {
        id: 'geartypes',
        accessorFn: (vessel: IdentityVesselData) => {
          const geartypes = getVesselProperty(vessel, 'geartypes', {
            identitySource: VesselIdentitySourceEnum.Registry,
          })
          const label = getVesselGearTypeLabel({ geartypes })
          return (
            <CellWithFilter
              vessel={vessel}
              column="geartypes"
              onClick={fetchResults}
              identitySource={VesselIdentitySourceEnum.Registry}
            >
              <Tooltip content={label?.length > TOOLTIP_LABEL_CHARACTERS ? label : ''}>
                <span>{label}</span>
              </Tooltip>
            </CellWithFilter>
          )
        },
        header: t('vessel.registryGeartype', 'Registry Gear Type'),
      },
    ]
    let columnsByInfoSource = [...selfReportedColums, ...registryColumns]
    if (searchFilters?.infoSource) {
      columnsByInfoSource =
        searchFilters?.infoSource === VesselIdentitySourceEnum.SelfReported
          ? selfReportedColums
          : registryColumns
    }

    return [
      {
        id: PINNED_COLUMN,
        accessorKey: PINNED_COLUMN,
        accessorFn: (vessel: IdentityVesselData) => {
          const bestIdentityMatch = getBestMatchCriteriaIdentity(vessel)
          const vesselData = getSearchIdentityResolved(vessel)
          const { dataset, shipname, nShipname } = vesselData
          const otherNamesLabel = getVesselOtherNamesLabel(getOtherVesselNames(vessel, nShipname))
          const { transmissionDateFrom, transmissionDateTo } = vesselData
          const name = shipname ? formatInfoField(shipname, 'name') : EMPTY_FIELD_PLACEHOLDER
          const label = `${name} ${otherNamesLabel || ''}`
          const vesselQuery = { start: transmissionDateFrom, end: transmissionDateTo }

          return (
            <VesselLink
              vesselId={vesselData.id}
              datasetId={dataset}
              identity={bestIdentityMatch}
              onClick={(e) => onVesselClick(e, vesselData)}
              query={vesselQuery}
              className={styles.advancedName}
              fitBounds={isSearchLocation}
            >
              <Tooltip content={label?.length > TOOLTIP_LABEL_CHARACTERS && label}>
                <span>
                  {name}{' '}
                  {otherNamesLabel && <span className={styles.secondary}>{otherNamesLabel}</span>}
                </span>
              </Tooltip>
            </VesselLink>
          )
        },
        header: t('common.name', 'Name'),
        enableColumnDragging: false,
        enableColumnActions: false,
      },
      {
        id: 'transmissionDates',
        accessorFn: (vessel: IdentityVesselData) => {
          const { transmissionDateFrom, transmissionDateTo } = getSearchIdentityResolved(vessel)
          if (!transmissionDateFrom || !transmissionDateTo) return
          return (
            <div className={styles.transmissionDates}>
              <span style={{ font: 'var(--font-XS)' }}>
                <I18nDate date={transmissionDateFrom} /> - <I18nDate date={transmissionDateTo} />
              </span>
              <TransmissionsTimeline
                firstTransmissionDate={transmissionDateFrom}
                lastTransmissionDate={transmissionDateTo}
                firstYearOfData={FIRST_YEAR_OF_DATA}
                locale={i18n.language as Locale}
              />
            </div>
          )
        },
        header: t('vessel.transmissionDates', 'Transmission Dates'),
      },
      {
        id: 'flag',
        accessorFn: (vessel: IdentityVesselData) => {
          return (
            <CellWithFilter vessel={vessel} column="flag" onClick={fetchResults}>
              <I18nFlag iso={getVesselProperty(vessel, 'flag')} />
            </CellWithFilter>
          )
        },
        header: t('vessel.flag', 'Flag'),
      },
      {
        id: 'ssvid',
        accessorFn: (vessel: IdentityVesselData) =>
          getVesselProperty(vessel, 'ssvid') || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.mmsi', 'MMSI'),
      },
      {
        id: 'imo',
        accessorFn: (vessel: IdentityVesselData) =>
          getVesselProperty(vessel, 'imo') || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.imo', 'IMO'),
      },
      {
        id: 'callsign',
        accessorFn: (vessel: IdentityVesselData) =>
          getVesselProperty(vessel, 'callsign') || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.callsign', 'Callsign'),
      },
      ...columnsByInfoSource,
      {
        id: 'owner',
        accessorFn: (vessel: IdentityVesselData) => {
          const label =
            formatInfoField(getVesselProperty(vessel, 'owner'), 'owner') || EMPTY_FIELD_PLACEHOLDER
          return (
            <CellWithFilter vessel={vessel} column="owner" onClick={fetchResults}>
              <Tooltip
                content={(label as string[])?.length > TOOLTIP_LABEL_CHARACTERS ? label : ''}
              >
                <span>{label}</span>
              </Tooltip>
            </CellWithFilter>
          )
        },
        header: t('vessel.owner', 'Owner'),
      },
      {
        id: 'infoSource',
        accessorFn: (vessel: IdentityVesselData) => {
          const registryIdentities = vessel.identities.filter(
            ({ identitySource }) => identitySource === VesselIdentitySourceEnum.Registry
          )
          const selfReportedIdentities = vessel.identities.filter(
            ({ identitySource }) => identitySource === VesselIdentitySourceEnum.SelfReported
          )
          const selfReportedIdentitiesSources = uniq(
            selfReportedIdentities.flatMap(({ sourceCode }) => sourceCode || [])
          )
          if (registryIdentities.length && selfReportedIdentities.length)
            return `${t(
              'vessel.infoSources.both',
              'Registry and self reported'
            )} (${selfReportedIdentitiesSources.join(', ')})`
          if (registryIdentities.length) return t('vessel.infoSources.registry', 'Registry')
          if (selfReportedIdentities.length)
            return `${t(
              'vessel.infoSources.selfReported',
              'Self reported'
            )} (${selfReportedIdentitiesSources.join(', ')})`

          return EMPTY_FIELD_PLACEHOLDER
        },
        header: t('vessel.infoSource', 'Info Source'),
      },
      {
        id: 'transmissionCount',
        accessorFn: (vessel: IdentityVesselData) => {
          const { positionsCounter } = getSearchIdentityResolved(vessel)
          if (positionsCounter) {
            return <I18nNumber number={positionsCounter} />
          }
        },
        header: t('vessel.transmission_other', 'Transmissions'),
      },
    ]
  }, [fetchResults, i18n.language, isSearchLocation, onVesselClick, searchFilters?.infoSource, t])

  const fetchMoreOnBottomReached = useCallback(() => {
    if (tableContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = tableContainerRef.current
      if (
        scrollHeight - scrollTop - clientHeight < 50 &&
        searchStatus === AsyncReducerStatus.Finished
      ) {
        fetchMoreResults()
      }
    }
  }, [fetchMoreResults, searchStatus])

  const onSelectHandler = useCallback(
    (vessels: IdentityVesselData[]) => {
      const vessesSelected = vessels.map(getSearchIdentityResolved).flatMap((v) => v.id || [])
      dispatch(setSelectedVessels(vessesSelected))
    },
    [dispatch]
  )

  const vesselSelectedIds = useMemo(
    () => vesselsSelected.map((vessel) => vessel.id),
    [vesselsSelected]
  )

  const rowSelection = useMemo(() => {
    return Object.fromEntries(
      (searchResults || []).map((vessel, index) => {
        return [`${index}-${vessel.id}`, vesselSelectedIds.includes(vessel.id)]
      })
    )
  }, [searchResults, vesselSelectedIds])

  useEffect(() => {
    fetchMoreOnBottomReached()
    window.addEventListener('resize', fetchMoreOnBottomReached)
    return () => window.removeEventListener('resize', fetchMoreOnBottomReached)
  }, [fetchMoreOnBottomReached])

  if (!searchResults?.length) {
    return null
  }

  const showProgressBars = searchStatus !== AsyncReducerStatus.Finished

  return (
    <MaterialReactTable
      columns={columns}
      data={searchResults as any}
      enableSorting={false}
      enableTopToolbar={false}
      renderToolbarInternalActions={undefined}
      enableColumnFilters={false}
      enablePagination={false}
      enableColumnActions
      enableColumnOrdering
      enableColumnDragging
      enableStickyHeader
      enableMultiRowSelection
      enableRowVirtualization
      enableRowSelection={(row) =>
        row.original.identities.some(
          (i: any) => i.identitySource === VesselIdentitySourceEnum.SelfReported
        )
      }
      onRowSelectionChange={undefined}
      enableColumnResizing
      selectAllMode="all"
      getRowId={(row, index) => `${index}-${row.id}`}
      initialState={{ columnPinning: { left: [PINNED_COLUMN] } }}
      state={{ showProgressBars, rowSelection }}
      muiTablePaperProps={{
        sx: { backgroundColor: 'transparent', boxShadow: 'none' },
      }}
      muiTableContainerProps={{
        ref: tableContainerRef,
        sx: { height: 'calc(100vh - 104px)' },
        onScroll: fetchMoreOnBottomReached,
      }}
      muiSelectAllCheckboxProps={({ table }) => ({
        sx: { color: 'var(--color-secondary-blue)' },
        onChange: (_, checked) => {
          onSelectHandler(checked ? table.getRowModel().rows.map(({ original }) => original) : [])
        },
      })}
      muiSelectCheckboxProps={({ row }) => ({
        onClick: () => {
          if (row.getCanSelect()) {
            onSelectHandler([row.original])
          }
        },
        sx: {
          '&.Mui-checked': { color: 'var(--color-secondary-blue)' },
          color: 'var(--color-secondary-blue)',
        },
      })}
      muiTableBodyRowProps={({ row }) => ({
        sx: {
          backgroundColor: 'transparent',
          ':hover': {
            td: { backgroundColor: 'white' },
            'td ~ td': { backgroundColor: 'var(--color-terthiary-blue)' },
          },
        },
      })}
      muiTableProps={{
        style: {
          ['--header-ssvid-size' as any]: 100,
          ['--header-imo-size' as any]: 100,
          ['--header-callsign-size' as any]: 100,
          ['--col-ssvid-size' as any]: 100,
          ['--col-imo-size' as any]: 100,
          ['--col-shipname-size' as any]: 250,
          ['--col-infoSource-size' as any]: 250,
          ['--col-callsign-size' as any]: 100,
          ['--header-mrt_row_select-size' as any]: 10,
          ['--col-mrt_row_select-size' as any]: 10,
          ['--header-mrt_row_select-size' as any]: 10,
          ['--header-shipname-size' as any]: 250,
          ['--header-infoSource-size' as any]: 250,
        },
      }}
      muiTableHeadCellProps={(cell) => ({
        sx: {
          font: 'var(--font-S-bold)',
          color: 'var(--color-primary-blue)',
          borderRight: 'var(--border)',
          borderBottom: 'var(--border)',
          backgroundColor: 'var(--color-white)',
          boxShadow:
            cell.column.id === 'shipname' ? '5px 0 5px -3px var(--color-terthiary-blue)' : '',
          div: { justifyContent: cell.column.id === 'mrt-row-select' ? 'center' : 'flex-start' },
          '.Mui-TableHeadCell-Content-Wrapper': { minWidth: '1rem' },
        },
      })}
      muiTableBodyCellProps={({ row, cell }) => ({
        sx: {
          font: 'var(--font-S)',
          color: 'var(--color-primary-blue)',
          backgroundColor:
            cell.column.id === 'shipname'
              ? 'var(--color-white)'
              : vesselSelectedIds.includes(getVesselProperty(row.original, 'id'))
              ? 'var(--color-terthiary-blue)'
              : 'transparent',
          textAlign: cell.column.id === 'mrt-row-select' ? 'center' : 'left',
          borderRight: 'var(--border)',
          borderBottom: 'var(--border)',
          boxShadow:
            cell.column.id === 'shipname' ? '5px 0 5px -3px var(--color-terthiary-blue)' : '',
          whiteSpace: 'nowrap',
          '.Mui-TableHeadCell-Content-Wrapper': { minWidth: '2rem' },
          minHeight: '5rem',
          padding: '0 1.1rem',
          ' a': {
            cursor: 'pointer',
            textDecoration: 'underline',
          },
        },
      })}
      muiBottomToolbarProps={{ sx: { overflow: 'visible' } }}
      muiLinearProgressProps={{
        sx: {
          height: '6px',
          backgroundColor: 'var(--color-white)',
          transform: 'translateY(-6px)',
          span: { backgroundColor: 'var(--color-secondary-blue)' },
        },
      }}
    />
  )
}

export default SearchAdvancedResults
