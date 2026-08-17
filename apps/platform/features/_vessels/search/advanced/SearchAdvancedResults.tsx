import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { ReactTable, Row } from '@tanstack/react-table'
import {
  columnOrderingFeature,
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type { Virtualizer } from '@tanstack/react-virtual'
import { useVirtualizer } from '@tanstack/react-virtual'
import cx from 'classnames'
import { uniq } from 'es-toolkit'

import type { Dataset } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import {
  getVesselDataviewInstanceId,
  getVesselIdFromInstanceId,
} from '@globalfishingwatch/dataviews-client'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { Tooltip, TransmissionsTimeline } from '@globalfishingwatch/ui-components'

import { FIRST_YEAR_OF_DATA, PRIVATE_ICON } from 'data/map/config'
import { isPrivateDataset } from 'features/_map/datasets/datasets.utils'
import { selectVesselsDataviews } from 'features/_map/dataviews/selectors/dataviews.instances.selectors'
import { useTimerangeConnect } from 'features/_map/timebar/timebar.hooks'
import { PRIVATE_SEARCH_DATASET_BY_GROUP } from 'features/_user/user.config'
import AdvancedResultCellWithFilter from 'features/_vessels/search/advanced/AdvancedResultCellWithFilter'
import type { SearchComponentProps } from 'features/_vessels/search/basic/SearchBasic'
import { selectSearchQuery } from 'features/_vessels/search/search.config.selectors'
import { useSearchFiltersConnect } from 'features/_vessels/search/search.hook'
import type { VesselLastIdentity } from 'features/_vessels/search/search.slice'
import {
  cleanVesselSearchResults,
  selectSearchPagination,
  selectSearchResults,
  selectSearchStatus,
  selectSelectedVessels,
  setSelectedVessels,
} from 'features/_vessels/search/search.slice'
import { getSearchVesselId } from 'features/_vessels/search/search.utils'
import type { IdentityVesselData } from 'features/_vessels/vessel/vessel.slice'
import {
  getBestMatchCriteriaIdentity,
  getOtherVesselNames,
  getSearchIdentityResolved,
  getVesselIdentityId,
  getVesselProperty,
} from 'features/_vessels/vessel/vessel.utils'
import VesselLink from 'features/_vessels/vessel/VesselLink'
import { useAppDispatch } from 'features/app/app.hooks'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import I18nNumber from 'features/i18n/i18nNumber'
import { selectIsStandaloneSearchLocation } from 'router/routes.selectors'
import type { Locale, QueryParam } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  EMPTY_FIELD_PLACEHOLDER,
  formatInfoField,
  getVesselGearTypeLabel,
  getVesselOtherNamesLabel,
  getVesselShipTypeLabel,
} from 'utils/info'
import { getHighlightedText } from 'utils/text'

import cellStyles from '../basic/SearchBasicResult.module.css'
import styles from './SearchAdvancedResults.module.css'

const PINNED_COLUMN = 'shipname'
const FIXED_COLUMNS = ['select', PINNED_COLUMN]
const COLUMN_ORDER_STORAGE_KEY = 'searchAdvancedColumnOrder'
const EMPTY_RESULTS: IdentityVesselData[] = []
const EMPTY_COLUMN_ORDER: string[] = []
const TOOLTIP_LABEL_CHARACTERS = 25
const ROW_HEIGHT_ESTIMATE = 80
const SELECT_COLUMN_SIZE = 48

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
  columnOrderingFeature,
})
const columnHelper = createColumnHelper<typeof features, IdentityVesselData>()

type SearchTable = ReactTable<typeof features, IdentityVesselData, {}>
type VesselDataviewRef = { id: string; config?: { info?: string } }

function isVesselInWorkspace(
  vessel: IdentityVesselData,
  vesselDataviews: VesselDataviewRef[] | undefined
) {
  const vesselId = getSearchIdentityResolved(vessel).id
  return vesselDataviews?.some(
    (vesselDataview) => vesselDataview.id === getVesselDataviewInstanceId(vesselId)
  )
}

function canSelectVessel(
  vessel: IdentityVesselData,
  vesselDataviews: VesselDataviewRef[] | undefined
) {
  return (
    !isVesselInWorkspace(vessel, vesselDataviews) &&
    vessel.identities.some(
      (identity) => identity.identitySource === VesselIdentitySourceEnum.SelfReported
    )
  )
}

function columnSizeStyle(columnId: string, kind: 'col' | 'header' = 'col') {
  return { width: `calc(var(--${kind}-${columnId}-size) * 1px)` }
}

function SelectAllCheckbox({
  checked,
  indeterminate,
  label,
  onChange,
}: {
  checked: boolean
  indeterminate: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <input
      type="checkbox"
      className={styles.checkbox}
      checked={checked}
      aria-label={label}
      data-testid="search-advanced-select-all"
      ref={(node) => {
        if (node) node.indeterminate = indeterminate
      }}
      onChange={(event) => onChange(event.target.checked)}
    />
  )
}

function SearchAdvancedResultRow({
  row,
  selected,
  table,
  virtualStart,
  virtualIndex,
  rowVirtualizer,
}: {
  row: Row<typeof features, IdentityVesselData>
  selected: boolean
  table: SearchTable
  virtualStart: number
  virtualIndex: number
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
}) {
  return (
    <tr
      role="row"
      data-index={virtualIndex}
      ref={(node) => rowVirtualizer.measureElement(node)}
      className={cx(styles.tr, { [styles.selected]: selected })}
      style={{ transform: `translateY(${virtualStart}px)` }}
    >
      {row.getAllCells().map((cell) => (
        <td
          key={cell.id}
          className={styles.td}
          data-column={cell.column.id}
          style={columnSizeStyle(cell.column.id)}
        >
          <table.FlexRender cell={cell} />
        </td>
      ))}
    </tr>
  )
}

function SearchAdvancedResultsBody({
  table,
  scrollElement,
  vesselSelectedIds,
}: {
  table: SearchTable
  scrollElement: HTMLDivElement | null
  vesselSelectedIds: string[]
}) {
  const { rows } = table.getRowModel()
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => ROW_HEIGHT_ESTIMATE,
    overscan: 10,
    measureElement:
      typeof window !== 'undefined'
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  })

  useEffect(() => {
    rowVirtualizer.measure()
  }, [rowVirtualizer, rows.length, scrollElement])

  return (
    <tbody className={styles.tbody} style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index]
        if (!row) return null
        const vessel = row.original
        const selected = vesselSelectedIds.includes(getSearchVesselId(vessel))
        return (
          <SearchAdvancedResultRow
            key={getSearchVesselId(vessel)}
            row={row}
            selected={selected}
            table={table}
            virtualStart={virtualRow.start}
            virtualIndex={virtualRow.index}
            rowVirtualizer={rowVirtualizer}
          />
        )
      })}
    </tbody>
  )
}

function SearchAdvancedResults({ fetchResults, fetchMoreResults }: SearchComponentProps) {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { searchFilters } = useSearchFiltersConnect()
  const sourceIsBrazilVMS = searchFilters?.sources?.every(
    (s) => s === PRIVATE_SEARCH_DATASET_BY_GROUP.brazil[0]
  )
  const searchQuery = useSelector(selectSearchQuery)
  const searchStatus = useSelector(selectSearchStatus)
  const searchPagination = useSelector(selectSearchPagination)
  const searchResults = useSelector(selectSearchResults)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const [tableContainer, setTableContainer] = useState<HTMLDivElement | null>(null)
  const [columnOrder, setColumnOrder] = useLocalStorage<string[]>(
    COLUMN_ORDER_STORAGE_KEY,
    EMPTY_COLUMN_ORDER
  )
  const [dropTargetColumn, setDropTargetColumn] = useState<string | null>(null)
  const draggedColumn = useRef<string | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const isSearchLocation = useSelector(selectIsStandaloneSearchLocation)
  const vesselDataviews = useSelector(selectVesselsDataviews)
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

  const onSelectHandler = useCallback(
    (vessels: IdentityVesselData[]) => {
      dispatch(setSelectedVessels(vessels.map(getSearchVesselId)))
    },
    [dispatch]
  )

  const vesselSelectedIds = useMemo(() => {
    const selectedIds = vesselsSelected.map((vessel) => getSearchVesselId(vessel))
    const workspaceIds =
      vesselDataviews?.map((vd) => `${vd.config?.info}-${getVesselIdFromInstanceId(vd.id)}`) ?? []
    return [...selectedIds, ...workspaceIds]
  }, [vesselsSelected, vesselDataviews])

  const selectableRows = useMemo(
    () => (searchResults ?? []).filter((vessel) => canSelectVessel(vessel, vesselDataviews)),
    [searchResults, vesselDataviews]
  )

  const allSelectableSelected =
    selectableRows.length > 0 &&
    selectableRows.every((vessel) => vesselSelectedIds.includes(getSearchVesselId(vessel)))
  const someSelectableSelected = selectableRows.some((vessel) =>
    vesselSelectedIds.includes(getSearchVesselId(vessel))
  )

  const columns = useMemo(() => {
    const selfReportedColumns = [
      columnHelper.display({
        id: 'gfw_shiptypes',
        header: sourceIsBrazilVMS ? t((t) => t.vessel.shiptype) : t((t) => t.vessel.gfw_shiptypes),
        cell: ({ row }) => {
          const vessel = row.original
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
      }),
      columnHelper.display({
        id: 'gfw_geartypes',
        header: sourceIsBrazilVMS ? t((t) => t.vessel.gearType) : t((t) => t.vessel.gfw_geartypes),
        cell: ({ row }) => {
          const vessel = row.original
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
      }),
    ]
    const registryColumns = [
      columnHelper.display({
        id: 'geartypes',
        header: t((t) => t.vessel.registryGeartype),
        cell: ({ row }) => {
          const vessel = row.original
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
      }),
    ]
    let columnsByInfoSource = [...selfReportedColumns, ...registryColumns]
    if (searchFilters?.infoSource) {
      columnsByInfoSource =
        searchFilters.infoSource === VesselIdentitySourceEnum.SelfReported
          ? selfReportedColumns
          : registryColumns
    }

    return [
      columnHelper.display({
        id: 'select',
        size: SELECT_COLUMN_SIZE,
        minSize: SELECT_COLUMN_SIZE,
        maxSize: SELECT_COLUMN_SIZE,
        enableResizing: false,
        header: () => (
          <SelectAllCheckbox
            checked={allSelectableSelected}
            indeterminate={someSelectableSelected && !allSelectableSelected}
            label={t((t) => t.search.selectVesselResults)}
            onChange={(checked) => onSelectHandler(checked ? selectableRows : [])}
          />
        ),
        cell: ({ row }) => {
          const vessel = row.original
          const disabled = !canSelectVessel(vessel, vesselDataviews)
          const checked = vesselSelectedIds.includes(getSearchVesselId(vessel))
          return (
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={checked}
              disabled={disabled}
              aria-label={t((t) => t.search.selectVessel)}
              onChange={() => {
                if (!disabled) onSelectHandler([vessel])
              }}
            />
          )
        },
      }),
      columnHelper.display({
        id: PINNED_COLUMN,
        size: 250,
        header: t((t) => t.common.name),
        cell: ({ row }) => {
          const vessel = row.original
          const bestIdentityMatch = getBestMatchCriteriaIdentity(vessel)
          const vesselData = getSearchIdentityResolved(vessel)
          const { dataset, shipname, nShipname } = vesselData
          const otherNamesLabel = getVesselOtherNamesLabel(getOtherVesselNames(vessel, nShipname))
          const { transmissionDateFrom, transmissionDateTo } = vesselData
          const name = shipname
            ? (formatInfoField(shipname, 'shipname') as string)
            : EMPTY_FIELD_PLACEHOLDER
          const label = `${name} ${otherNamesLabel || ''}`
          const vesselQuery = {
            start: transmissionDateFrom,
            end: transmissionDateTo,
            includeRelatedIdentities: searchFilters.id ? false : true,
          } as Record<QueryParam, any>
          const inWorkspace = isVesselInWorkspace(vessel, vesselDataviews)

          return (
            <VesselLink
              vesselId={vesselData.id}
              datasetId={(dataset as Dataset)?.id}
              identity={bestIdentityMatch}
              onClick={(e) => onVesselClick(e, vesselData)}
              query={vesselQuery}
              className={`${cellStyles.advancedName}${inWorkspace ? ` ${cellStyles.inWorkspace}` : ''}`}
              fitBounds={isSearchLocation}
            >
              <Tooltip
                content={
                  (inWorkspace ? t((t) => t.vessel.inWorkspace) : '') +
                  (label?.length > TOOLTIP_LABEL_CHARACTERS ? label : '')
                }
              >
                <span>
                  {getHighlightedText(name, searchQuery || '', cellStyles)}{' '}
                  {otherNamesLabel && (
                    <span className={cellStyles.secondary}>{otherNamesLabel}</span>
                  )}
                </span>
              </Tooltip>
            </VesselLink>
          )
        },
      }),
      columnHelper.display({
        id: 'transmissionDates',
        header: t((t) => t.vessel.transmissionDates),
        cell: ({ row }) => {
          const { transmissionDateFrom, transmissionDateTo } = getSearchIdentityResolved(
            row.original
          )
          if (!transmissionDateFrom || !transmissionDateTo) return null
          return (
            <div className={cellStyles.transmissionDates}>
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
      }),
      columnHelper.display({
        id: 'flag',
        header: t((t) => t.vessel.flag),
        cell: ({ row }) => {
          const flags = uniq(row.original.identities.map((identity) => identity.flag))
          return flags.map((flag, index) => (
            <span key={flag}>
              <I18nFlag iso={flag} />
              {index < flags.length - 1 ? ', ' : ''}
            </span>
          ))
        },
      }),
      columnHelper.display({
        id: 'ssvid',
        size: 100,
        header: t((t) => t.vessel.mmsi),
        cell: ({ row }) => {
          const ssvid = getSearchIdentityResolved(row.original).ssvid || EMPTY_FIELD_PLACEHOLDER
          return searchFilters.ssvid
            ? getHighlightedText(ssvid, searchFilters.ssvid || '', cellStyles)
            : ssvid
        },
      }),
      columnHelper.display({
        id: 'imo',
        size: 100,
        header: t((t) => t.vessel.imo),
        cell: ({ row }) => {
          const imo = getSearchIdentityResolved(row.original).imo || EMPTY_FIELD_PLACEHOLDER
          return searchFilters.imo
            ? getHighlightedText(imo, searchFilters.imo || '', cellStyles)
            : imo
        },
      }),
      columnHelper.display({
        id: 'callsign',
        size: 100,
        header: t((t) => t.vessel.callsign),
        cell: ({ row }) => {
          const callsign =
            getSearchIdentityResolved(row.original).callsign || EMPTY_FIELD_PLACEHOLDER
          return searchFilters.callsign
            ? getHighlightedText(callsign, searchFilters.callsign || '', cellStyles)
            : callsign
        },
      }),
      ...columnsByInfoSource,
      columnHelper.display({
        id: 'owner',
        header: t((t) => t.vessel.owner),
        cell: ({ row }) => {
          const vessel = row.original
          const bestIdentityMatch = getBestMatchCriteriaIdentity(vessel)
          const label =
            formatInfoField(
              getVesselProperty(
                vessel,
                'owner',
                bestIdentityMatch
                  ? {
                      identityId: getVesselIdentityId(bestIdentityMatch),
                      identitySource: bestIdentityMatch.identitySource,
                    }
                  : undefined
              ),
              'owner'
            ) || EMPTY_FIELD_PLACEHOLDER
          return (
            <AdvancedResultCellWithFilter vessel={vessel} column="owner" onClick={fetchResults}>
              <Tooltip
                content={(label as string[])?.length > TOOLTIP_LABEL_CHARACTERS ? label : ''}
              >
                <span>
                  {getHighlightedText(label as string, searchFilters.owner || '', cellStyles)}
                </span>
              </Tooltip>
            </AdvancedResultCellWithFilter>
          )
        },
      }),
      columnHelper.display({
        id: 'infoSource',
        size: 250,
        header: t((t) => t.vessel.infoSource),
        cell: ({ row }) => {
          const vessel = row.original
          const registryIdentities = vessel.identities.filter(
            ({ identitySource }) => identitySource === VesselIdentitySourceEnum.Registry
          )
          const selfReportedIdentities = vessel.identities.filter(
            ({ identitySource }) => identitySource === VesselIdentitySourceEnum.SelfReported
          )
          const selfReportedIdentitiesSources = uniq(
            selfReportedIdentities.flatMap(({ sourceCode }) => sourceCode || [])
          )
          if (registryIdentities.length && selfReportedIdentities.length) {
            return `${t((t) => t.vessel.infoSources.both)} (${isPrivateDataset(vessel.dataset) ? `${PRIVATE_ICON} ` : ''}${selfReportedIdentitiesSources.join(', ')})`
          }
          if (registryIdentities.length) return t((t) => t.vessel.infoSources.registry)
          if (selfReportedIdentities.length) {
            return `${t(
              (t) => t.vessel.infoSources.selfReported
            )} (${isPrivateDataset(vessel.dataset) ? `${PRIVATE_ICON} ` : ''}${selfReportedIdentitiesSources.join(', ')})`
          }
          return EMPTY_FIELD_PLACEHOLDER
        },
      }),
      columnHelper.display({
        id: 'transmissionCount',
        header: t((t) => t.vessel.transmissions),
        cell: ({ row }) => {
          const { positionsCounter } = getSearchIdentityResolved(row.original)
          if (positionsCounter) {
            return <I18nNumber number={positionsCounter} />
          }
          return null
        },
      }),
    ]
  }, [
    allSelectableSelected,
    fetchResults,
    i18n.language,
    isSearchLocation,
    onSelectHandler,
    onVesselClick,
    searchFilters,
    searchQuery,
    selectableRows,
    someSelectableSelected,
    sourceIsBrazilVMS,
    t,
    vesselDataviews,
    vesselSelectedIds,
  ])

  const table = useTable(
    {
      features,
      columns,
      data: searchResults ?? EMPTY_RESULTS,
      defaultColumn: { size: 150, minSize: 60 },
      columnResizeMode: 'onChange',
      state: { columnOrder },
    },
    () => ({})
  )

  const moveColumn = useCallback(
    (fromId: string, toId: string) => {
      if (fromId === toId || FIXED_COLUMNS.includes(fromId)) return
      const currentIds = table.getAllLeafColumns().map((column) => column.id)
      const orderedIds = [
        ...columnOrder.filter((id) => currentIds.includes(id)),
        ...currentIds.filter((id) => !columnOrder.includes(id)),
      ]
      const fromIndex = orderedIds.indexOf(fromId)
      const targetIndex = orderedIds.indexOf(toId)
      if (fromIndex === -1 || targetIndex === -1) return
      orderedIds.splice(fromIndex, 1)
      const insertAt = orderedIds.indexOf(toId) + (fromIndex < targetIndex ? 1 : 0)
      orderedIds.splice(Math.max(insertAt, FIXED_COLUMNS.length), 0, fromId)
      setColumnOrder(orderedIds)
    },
    [columnOrder, setColumnOrder, table]
  )

  useLayoutEffect(() => {
    const writeColumnSizeVars = () => {
      const tableEl = tableRef.current
      if (!tableEl) return
      for (const header of table.getFlatHeaders()) {
        tableEl.style.setProperty(`--header-${header.id}-size`, String(header.getSize()))
        tableEl.style.setProperty(`--col-${header.column.id}-size`, String(header.column.getSize()))
      }
      tableEl.style.width = `${table.getTotalSize()}px`
    }
    writeColumnSizeVars()
    const subscription = table.atoms.columnSizing.subscribe(writeColumnSizeVars)
    return typeof subscription === 'function' ? subscription : subscription.unsubscribe
  }, [table, columns])

  const fetchMoreOnBottomReached = useCallback(() => {
    if (tableContainer) {
      const { scrollHeight, scrollTop, clientHeight } = tableContainer
      if (
        scrollHeight - scrollTop - clientHeight < 50 &&
        searchStatus === AsyncReducerStatus.Finished
      ) {
        fetchMoreResults()
      }
    }
  }, [fetchMoreResults, searchStatus, tableContainer])

  useEffect(() => {
    fetchMoreOnBottomReached()
    window.addEventListener('resize', fetchMoreOnBottomReached)
    return () => window.removeEventListener('resize', fetchMoreOnBottomReached)
  }, [fetchMoreOnBottomReached])

  const isSearching =
    searchStatus === AsyncReducerStatus.Loading || searchStatus === AsyncReducerStatus.Aborted
  const isFetchingMore = searchPagination.loading

  if (!searchResults?.length || (isSearching && !isFetchingMore)) {
    return null
  }

  return (
    <div
      ref={setTableContainer}
      className={styles.container}
      data-testid="search-advanced-table"
      onScroll={fetchMoreOnBottomReached}
    >
      <table ref={tableRef} className={styles.table} role="table">
        <thead className={styles.thead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} role="row" className={styles.headerRow}>
              {headerGroup.headers.map((header) => {
                const columnId = header.column.id
                const draggable = !FIXED_COLUMNS.includes(columnId)
                return (
                  <th
                    key={header.id}
                    role="columnheader"
                    className={cx(styles.th, {
                      [styles.dropTarget]: dropTargetColumn === columnId,
                    })}
                    data-column={columnId}
                    style={columnSizeStyle(header.id, 'header')}
                    onDragOver={(e) => {
                      if (!draggedColumn.current || draggedColumn.current === columnId) return
                      e.preventDefault()
                      setDropTargetColumn(columnId)
                    }}
                    onDragLeave={() => setDropTargetColumn(null)}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (draggedColumn.current) moveColumn(draggedColumn.current, columnId)
                      draggedColumn.current = null
                      setDropTargetColumn(null)
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <span
                        className={cx(styles.headerLabel, { [styles.dragHandle]: draggable })}
                        draggable={draggable}
                        aria-label={draggable ? t((t) => t.search.reorderColumn) : undefined}
                        title={draggable ? t((t) => t.search.reorderColumn) : undefined}
                        onDragStart={() => {
                          draggedColumn.current = columnId
                        }}
                        onDragEnd={() => {
                          draggedColumn.current = null
                          setDropTargetColumn(null)
                        }}
                      >
                        <table.FlexRender header={header} />
                      </span>
                    )}
                    {header.column.getCanResize() && (
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label={`Resize ${header.column.id}`}
                        className={styles.resizer}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                      />
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <SearchAdvancedResultsBody
          table={table}
          scrollElement={tableContainer}
          vesselSelectedIds={vesselSelectedIds}
        />
      </table>
      {searchPagination.loading && (
        <div className={styles.progress} role="progressbar" aria-busy="true">
          <div className={styles.progressBar} />
        </div>
      )}
    </div>
  )
}

export default SearchAdvancedResults
