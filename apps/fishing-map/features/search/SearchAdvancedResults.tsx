import { useSelector } from 'react-redux'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  VesselWithDatasets,
  selectSearchResults,
  selectSearchStatus,
} from 'features/search/search.slice'
import { formatInfoField, EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import DatasetLabel from 'features/datasets/DatasetLabel'
import I18nFlag from 'features/i18n/i18nFlag'
import { AsyncReducerStatus } from 'utils/async-slice'
import { SearchComponentProps } from 'features/search/SearchBasic'

const PINNED_COLUMN = 'shipname'

function SearchAdvancedResults({
  onSelect,
  vesselsSelected,
  fetchMoreResults,
}: SearchComponentProps) {
  const { t } = useTranslation()
  const searchStatus = useSelector(selectSearchStatus)
  const searchResults = useSelector(selectSearchResults)
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
        accessorFn: ({ mmsi }: VesselWithDatasets) => mmsi || EMPTY_FIELD_PLACEHOLDER,
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
        accessorFn: ({ vesselType }: VesselWithDatasets) =>
          t(`vessel.vesselTypes.${vesselType}` as any, EMPTY_FIELD_PLACEHOLDER),
        header: t('vessel.vesselType', 'Vessel Type'),
      },
      {
        accessorFn: ({ geartype }: VesselWithDatasets) =>
          t(`vessel.gearTypes.${geartype}` as any, EMPTY_FIELD_PLACEHOLDER),
        header: t('vessel.geartype', 'Gear Type'),
      },
      {
        accessorFn: ({ dataset }: VesselWithDatasets) => <DatasetLabel dataset={dataset} />,
        header: t('vessel.source', 'Source'),
      },
    ]
  }, [t])

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        if (
          scrollHeight - scrollTop - clientHeight < 50 &&
          searchStatus === AsyncReducerStatus.Finished
        ) {
          fetchMoreResults()
        }
      }
    },
    [fetchMoreResults, searchStatus]
  )

  const onSelectAllHandler = useCallback(
    (selected: boolean) => {
      onSelect(selected ? searchResults : [])
    },
    [onSelect, searchResults]
  )

  const onSelectHandler = useCallback(
    (vessel: VesselWithDatasets) => {
      onSelect([vessel])
    },
    [onSelect]
  )

  const rowSelection = useMemo(() => {
    const selectedIds = vesselsSelected.map((vessel) => vessel.id)
    return Object.fromEntries(
      (searchResults || []).map((vessel) => [vessel.id, selectedIds.includes(vessel.id)])
    )
  }, [searchResults, vesselsSelected])

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
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
      renderToolbarInternalActions={null}
      enableColumnFilters={false}
      enablePagination={false}
      enableColumnActions
      enableColumnOrdering
      enableColumnDragging
      enableStickyHeader
      enableMultiRowSelection
      enableRowSelection
      onRowSelectionChange={null}
      selectAllMode="all"
      getRowId={(row) => row.id}
      initialState={{ columnPinning: { left: [PINNED_COLUMN] } }}
      state={{ showProgressBars, rowSelection }}
      muiTablePaperProps={{
        sx: { backgroundColor: 'transparent', boxShadow: 'none' },
      }}
      muiTableContainerProps={{
        ref: tableContainerRef,
        sx: {
          height: 'calc(100vh - 112px)',
          transition: 'height 0.2s',
        },
        onScroll: (event) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
      }}
      muiSelectAllCheckboxProps={{
        sx: { color: 'var(--color-secondary-blue)' },
        onChange: (e) => onSelectAllHandler(e.target.checked),
      }}
      muiSelectCheckboxProps={{
        sx: {
          '&.Mui-checked': { color: 'var(--color-secondary-blue)' },
          color: 'var(--color-secondary-blue)',
          pointerEvents: 'none',
        },
      }}
      muiTableBodyRowProps={({ row }) => ({
        onClick: () => onSelectHandler(row.original),
        sx: {
          backgroundColor: 'transparent',
          cursor: 'pointer',
          ':hover': {
            td: { backgroundColor: 'white' },
            'td ~ td': { backgroundColor: 'var(--color-terthiary-blue)' },
          },
        },
      })}
      muiTableHeadCellProps={(cell) => ({
        sx: {
          font: 'var(--font-S-bold)',
          color: 'var(--color-primary-blue)',
          borderRight: 'var(--border)',
          borderBottom: 'var(--border)',
          backgroundColor: 'var(--color-white)',
          boxShadow:
            cell.column.id === 'shipname' ? '5px 0 5px -3px var(--color-terthiary-blue)' : '',
        },
      })}
      muiTableBodyCellProps={({ row, cell }) => {
        return {
          sx: {
            font: 'var(--font-S)',
            color: 'var(--color-primary-blue)',
            backgroundColor:
              cell.column.id === 'shipname'
                ? 'var(--color-white)'
                : vesselsSelected.includes(row.original)
                ? 'var(--color-terthiary-blue)'
                : 'transparent',
            borderRight: 'var(--border)',
            borderBottom: 'var(--border)',
            boxShadow:
              cell.column.id === 'shipname' ? '5px 0 5px -3px var(--color-terthiary-blue)' : '',
            whiteSpace: 'nowrap',
            maxWidth: '20rem',
          },
        }
      }}
      muiBottomToolbarProps={{
        sx: { overflow: 'visible' },
      }}
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
