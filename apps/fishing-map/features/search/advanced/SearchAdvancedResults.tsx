import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'
import type { MRT_ColumnDef } from 'material-react-table'
import { MaterialReactTable } from 'material-react-table'

import type { Dataset } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { IconButton, Tooltip, TransmissionsTimeline } from '@globalfishingwatch/ui-components'

import { FIRST_YEAR_OF_DATA } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import I18nNumber from 'features/i18n/i18nNumber'
import AdvancedResultCellWithFilter from 'features/search/advanced/AdvancedResultCellWithFilter'
import type { SearchComponentProps } from 'features/search/basic/SearchBasic'
import { useSearchFiltersConnect } from 'features/search/search.hook'
import type { VesselLastIdentity } from 'features/search/search.slice'
import {
  cleanVesselSearchResults,
  selectSearchResults,
  selectSearchStatus,
  selectSelectedVessels,
  setSelectedVessels,
} from 'features/search/search.slice'
import type { VesselSearchState } from 'features/search/search.types'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import type { VesselIdentityProperty } from 'features/vessel/vessel.utils'
import {
  getBestMatchCriteriaIdentity,
  getOtherVesselNames,
  getSearchIdentityResolved,
  getVesselProperty,
} from 'features/vessel/vessel.utils'
import VesselLink from 'features/vessel/VesselLink'
import { selectIsStandaloneSearchLocation } from 'routes/routes.selectors'
import type { Locale } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  EMPTY_FIELD_PLACEHOLDER,
  formatInfoField,
  getVesselGearTypeLabel,
  getVesselOtherNamesLabel,
  getVesselShipTypeLabel,
} from 'utils/info'

import styles from '../basic/SearchBasicResult.module.css'

const PINNED_COLUMN = 'shipname'
const TOOLTIP_LABEL_CHARACTERS = 25

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
            <AdvancedResultCellWithFilter vessel={vessel} column="shiptypes" onClick={fetchResults}>
              {label || EMPTY_FIELD_PLACEHOLDER}
            </AdvancedResultCellWithFilter>
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
            <AdvancedResultCellWithFilter vessel={vessel} column="geartypes" onClick={fetchResults}>
              <Tooltip content={label?.length > TOOLTIP_LABEL_CHARACTERS ? label : ''}>
                <span>{label}</span>
              </Tooltip>
            </AdvancedResultCellWithFilter>
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
            <AdvancedResultCellWithFilter
              vessel={vessel}
              column="geartypes"
              onClick={fetchResults}
              identitySource={VesselIdentitySourceEnum.Registry}
            >
              <Tooltip content={label?.length > TOOLTIP_LABEL_CHARACTERS ? label : ''}>
                <span>{label}</span>
              </Tooltip>
            </AdvancedResultCellWithFilter>
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
          const name = shipname ? formatInfoField(shipname, 'shipname') : EMPTY_FIELD_PLACEHOLDER
          const label = `${name} ${otherNamesLabel || ''}`
          const vesselQuery = { start: transmissionDateFrom, end: transmissionDateTo }

          return (
            <VesselLink
              vesselId={vesselData.id}
              datasetId={(dataset as Dataset)?.id}
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
            <AdvancedResultCellWithFilter vessel={vessel} column="flag" onClick={fetchResults}>
              <I18nFlag iso={getVesselProperty(vessel, 'flag')} />
            </AdvancedResultCellWithFilter>
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
            <AdvancedResultCellWithFilter vessel={vessel} column="owner" onClick={fetchResults}>
              <Tooltip
                content={(label as string[])?.length > TOOLTIP_LABEL_CHARACTERS ? label : ''}
              >
                <span>{label}</span>
              </Tooltip>
            </AdvancedResultCellWithFilter>
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
