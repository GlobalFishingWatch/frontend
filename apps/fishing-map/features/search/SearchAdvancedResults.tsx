import { useSelector } from 'react-redux'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip, TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import {
  selectSearchResults,
  selectSearchStatus,
  selectSelectedVessels,
  setSelectedVessels,
} from 'features/search/search.slice'
import { formatInfoField, EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import I18nFlag from 'features/i18n/i18nFlag'
import { AsyncReducerStatus } from 'utils/async-slice'
import { SearchComponentProps } from 'features/search/SearchBasic'
import { useAppDispatch } from 'features/app/app.hooks'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import { Locale } from 'types'
import I18nDate from 'features/i18n/i18nDate'
import {
  getSelfReportedVesselIdentityResolved,
  getVesselIdentities,
  getVesselIdentityProperties,
  getVesselProperty,
} from 'features/vessel/vessel.utils'
import { IdentityVesselData } from 'features/vessel/vessel.slice'
import { VesselIdentitySourceEnum } from 'features/search/search.config'
import I18nNumber from 'features/i18n/i18nNumber'

const PINNED_COLUMN = 'shipname'
const TOOLTIP_LABEL_CHARACTERS = 25

function SearchAdvancedResults({ fetchMoreResults }: SearchComponentProps) {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const searchStatus = useSelector(selectSearchStatus)
  const searchResults = useSelector(selectSearchResults)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const columns = useMemo((): MRT_ColumnDef<IdentityVesselData>[] => {
    return [
      {
        accessorKey: PINNED_COLUMN as any,
        accessorFn: (vessel) => {
          const [shipname, ...names] = getVesselIdentityProperties(vessel, 'shipname')
          const name = shipname ? formatInfoField(shipname, 'name') : EMPTY_FIELD_PLACEHOLDER
          const label = names?.length
            ? `${name} (${t('common.previously', 'Previously')}: ${names
                .map((name) => formatInfoField(name, 'name'))
                .join(', ')})`
            : name
          return label?.length > TOOLTIP_LABEL_CHARACTERS ? (
            <Tooltip content={label}>
              <span>{label}</span>
            </Tooltip>
          ) : (
            label
          )
        },
        header: t('common.name', 'Name'),
        enableColumnDragging: false,
        enableColumnActions: false,
      },
      {
        accessorFn: (vessel) => <I18nFlag iso={getVesselProperty(vessel, 'flag')} />,
        header: t('vessel.flag', 'Flag'),
      },
      {
        accessorFn: (vessel) => getVesselProperty(vessel, 'ssvid') || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.mmsi', 'MMSI'),
      },
      {
        accessorFn: (vessel) => getVesselProperty(vessel, 'imo') || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.imo', 'IMO'),
      },
      {
        accessorFn: (vessel) => getVesselProperty(vessel, 'callsign') || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.callsign', 'Callsign'),
      },
      {
        accessorFn: (vessel) => {
          const shiptype = getVesselProperty(vessel, 'shiptype')
          return t(`vessel.vesselTypes.${shiptype?.toLowerCase()}` as any, EMPTY_FIELD_PLACEHOLDER)
        },
        header: t('vessel.vesselType', 'Vessel Type'),
      },
      {
        accessorFn: (vessel) => {
          const geartypes = getVesselProperty<string[]>(vessel, 'geartype')
          const label = geartypes
            ?.map((gear) =>
              t(`vessel.gearTypes.${gear.toLowerCase()}` as any, EMPTY_FIELD_PLACEHOLDER)
            )
            .join(', ')
          return label?.length > TOOLTIP_LABEL_CHARACTERS ? (
            <Tooltip content={label}>
              <span>{label}</span>
            </Tooltip>
          ) : (
            label
          )
        },
        header: t('vessel.geartype', 'Gear Type'),
      },
      {
        accessorFn: (vessel) => {
          const hasRegistryIdentity = vessel.identities.some(
            ({ identitySource }) => identitySource === VesselIdentitySourceEnum.Registry
          )
          const hasSelfReportedIdentity = vessel.identities.some(
            ({ identitySource }) => identitySource === VesselIdentitySourceEnum.SelfReported
          )
          if (hasRegistryIdentity && hasSelfReportedIdentity)
            return t('vessel.infoSources.both', 'Registry and self reported')
          if (hasRegistryIdentity) return t('vessel.infoSources.registry', 'Registry')
          if (hasSelfReportedIdentity) return t('vessel.infoSources.self-reported', 'Self reported')

          return EMPTY_FIELD_PLACEHOLDER
        },
        header: t('vessel.infoSource', 'Info Source'),
      },
      // {
      //   accessorFn: ({ dataset }) => <DatasetLabel dataset={dataset} />,
      //   header: t('vessel.source', 'Source'),
      // },
      {
        accessorFn: (vessel) => {
          const vesselSelfReportedIdentities = getVesselIdentities(vessel, {
            identitySource: VesselIdentitySourceEnum.SelfReported,
          })
          const messagesCounter = vesselSelfReportedIdentities.reduce((acc, identity) => {
            return acc + identity.messagesCounter
          }, 0)
          return <I18nNumber number={messagesCounter} />
        },
        header: t('vessel.transmission_other', 'Transmissions'),
      },
      {
        accessorFn: (vessel) => {
          const transmissionDateFrom = getVesselProperty(vessel, 'transmissionDateFrom')
          const transmissionDateTo = getVesselProperty(vessel, 'transmissionDateTo')
          return (
            <div>
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
    (vessels: IdentityVesselData[]) => {
      const vessesSelected = vessels
        .map(getSelfReportedVesselIdentityResolved)
        .flatMap((v) => v.id || [])
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
      enableRowVirtualization
      enableRowSelection={(row) =>
        row.original.identities.some(
          (i) => i.identitySource === VesselIdentitySourceEnum.SelfReported
        )
      }
      onRowSelectionChange={undefined}
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
      muiSelectCheckboxProps={{
        sx: {
          '&.Mui-checked': { color: 'var(--color-secondary-blue)' },
          color: 'var(--color-secondary-blue)',
          pointerEvents: 'none',
        },
      }}
      muiTableBodyRowProps={({ row }) => ({
        onClick: () => {
          if (row.getCanSelect()) {
            onSelectHandler([row.original])
          }
        },
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
          padding: '0.5rem 1.1rem',
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
