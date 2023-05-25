import { useSelector } from 'react-redux'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import {
  VesselWithDatasets,
  selectSearchResults,
  selectSearchStatus,
  selectSelectedVessels,
  setSelectedVessels,
} from 'features/search/search.slice'
import { formatInfoField, EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import DatasetLabel from 'features/datasets/DatasetLabel'
import I18nFlag from 'features/i18n/i18nFlag'
import { AsyncReducerStatus } from 'utils/async-slice'
import { SearchComponentProps } from 'features/search/SearchBasic'
import { useAppDispatch } from 'features/app/app.hooks'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import { Locale } from 'types'
import I18nDate from 'features/i18n/i18nDate'

const PINNED_COLUMN = 'shipname'

function SearchAdvancedResults({ fetchMoreResults }: SearchComponentProps) {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const searchStatus = useSelector(selectSearchStatus)
  const searchResults = useSelector(selectSearchResults)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const columns = useMemo((): MRT_ColumnDef<VesselWithDatasets>[] => {
    return [
      {
        accessorKey: PINNED_COLUMN,
        accessorFn: ({ shipname }: VesselWithDatasets) =>
          formatInfoField(shipname, 'name') || EMPTY_FIELD_PLACEHOLDER,
        header: t('common.name', 'Name'),
        enableColumnDragging: false,
        enableColumnActions: false,
      },
      {
        accessorFn: ({ flag }: VesselWithDatasets) => <I18nFlag iso={flag} />,
        header: t('vessel.flag', 'Flag'),
      },
      {
        accessorFn: ({ ssvid }: VesselWithDatasets) => ssvid || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.mmsi', 'MMSI'),
      },
      {
        accessorFn: ({ imo }: VesselWithDatasets) => imo || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.imo', 'IMO'),
      },
      {
        accessorFn: ({ callsign }: VesselWithDatasets) => callsign || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.callsign', 'Callsign'),
      },
      {
        accessorFn: ({ shiptype }: VesselWithDatasets) =>
          t(`vessel.vesselTypes.${shiptype?.toLowerCase()}` as any, EMPTY_FIELD_PLACEHOLDER),
        header: t('vessel.vesselType', 'Vessel Type'),
      },
      {
        accessorFn: ({ geartype }: VesselWithDatasets) =>
          t(`vessel.gearTypes.${geartype?.toLowerCase()}` as any, EMPTY_FIELD_PLACEHOLDER),
        header: t('vessel.geartype', 'Gear Type'),
      },
      {
        accessorFn: ({ dataset }: VesselWithDatasets) => <DatasetLabel dataset={dataset} />,
        header: t('vessel.source', 'Source'),
      },
      // {
      //   accessorFn: ({ msgCount }: VesselWithDatasets) => <I18nNumber number={msgCount} />,
      //   header: t('vessel.transmission_other', 'Transmissions'),
      // },
      {
        accessorFn: ({ firstTransmissionDate, lastTransmissionDate }: VesselWithDatasets) => (
          <div>
            <span style={{ font: 'var(--font-XS)' }}>
              <I18nDate date={firstTransmissionDate} /> - <I18nDate date={lastTransmissionDate} />
            </span>
            <TransmissionsTimeline
              firstTransmissionDate={firstTransmissionDate}
              lastTransmissionDate={lastTransmissionDate}
              firstYearOfData={FIRST_YEAR_OF_DATA}
              locale={i18n.language as Locale}
            />
          </div>
        ),
        header: t('vessel.transmissionDates', 'Transmission Dates'),
      },
    ]
  }, [i18n.language, t])

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
    (vessels: VesselWithDatasets[]) => {
      dispatch(setSelectedVessels(vessels))
    },
    [dispatch]
  )

  const rowSelection = useMemo(() => {
    const selectedIds = vesselsSelected.map((vessel) => vessel.id)
    return Object.fromEntries(
      (searchResults || []).map((vessel) => [vessel.id, selectedIds.includes(vessel.id)])
    )
  }, [searchResults, vesselsSelected])

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
      data={searchResults}
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
      enableRowSelection
      onRowSelectionChange={undefined}
      selectAllMode="all"
      getRowId={(row, index) => `${index} - ${row.dataset.id} - ${row.id}`}
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
        onChange: (_, checked) =>
          onSelectHandler(checked ? table.getRowModel().rows.map(({ original }) => original) : []),
      })}
      muiSelectCheckboxProps={{
        sx: {
          '&.Mui-checked': { color: 'var(--color-secondary-blue)' },
          color: 'var(--color-secondary-blue)',
          pointerEvents: 'none',
        },
      }}
      muiTableBodyRowProps={({ row }) => ({
        onClick: () => onSelectHandler([row.original]),
        sx: {
          backgroundColor: 'transparent',
          cursor: 'pointer',
          ':hover': {
            td: { backgroundColor: 'white' },
            'td ~ td': { backgroundColor: 'var(--color-terthiary-blue)' },
          },
        },
      })}
      muiTableProps={{
        style: {
          ['--col-mrt_row_select-size' as any]: 10,
          ['--header-mrt_row_select-size' as any]: 10,
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
              : vesselsSelected.includes(row.original)
              ? 'var(--color-terthiary-blue)'
              : 'transparent',
          textAlign: cell.column.id === 'mrt-row-select' ? 'center' : 'left',
          borderRight: 'var(--border)',
          borderBottom: 'var(--border)',
          boxShadow:
            cell.column.id === 'shipname' ? '5px 0 5px -3px var(--color-terthiary-blue)' : '',
          whiteSpace: 'nowrap',
          maxWidth: '20rem',
          '.Mui-TableHeadCell-Content-Wrapper': { minWidth: '2rem' },
          padding: '0.5rem',
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
