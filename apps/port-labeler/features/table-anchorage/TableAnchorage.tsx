import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { SelectOption } from '@globalfishingwatch/ui-components'
import { selectPorts, sortPoints } from 'features/labeler/labeler.slice'
import { useMapBounds } from 'features/map/controls/map-controls.hooks'
import { PortPosition } from 'types'
import styles from './TableAnchorage.module.css'
import TableHeader from './TableHeader'
import TableRow from './TableRow'
import { selectFilteredPoints } from 'features/labeler/labeler.selectors'

function TableAnchorage() {

  const ports = useSelector(selectPorts)

  const records = useSelector(selectFilteredPoints)
  const dispatch = useDispatch()



  const portOptions: SelectOption[] = useMemo(() => {
    return ports.map(e => {
      return {
        id: e,
        label: e,
      }
    })
  }, [ports])

  type orderDirectionType = 'asc' | 'desc' | ''

  const [orderColumn, setOrderColumn] = useState(null)
  const [orderDirection, setOrderDirection] = useState<orderDirectionType>('')

  const onToggleHeader = useCallback((column, order) => {
    setOrderColumn(column)
    setOrderDirection(order)
    dispatch(sortPoints({ orderColumn: column, orderDirection: order }))
  }, [])

  const mapBounds = useMapBounds()

  const pointInScreen = useCallback((point: PortPosition) => {

    return mapBounds && mapBounds.north >= point.lat && mapBounds.south <= point.lat
      && mapBounds.west <= point.lon && mapBounds.east >= point.lon
  }, [mapBounds])

  const screenFilteredRecords = useMemo(() => {
    return records?.filter((record) => (pointInScreen(record)))
  }, [records, mapBounds])


  return (
    <div className={styles.table}>
      <div className={styles.head}>
        <TableHeader
          label="Port" order={orderColumn === 'port' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('port', order)}
        />
        <TableHeader
          label="Subarea" order={orderColumn === 'subarea' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('subarea', order)} />
        <TableHeader
          label="Anchorage" order={orderColumn === 'anchorage' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('anchorage', order)} />
        <TableHeader
          label="Destination" order={orderColumn === 'top_destination' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('top_destination', order)} />
      </div>

      {screenFilteredRecords && screenFilteredRecords.length ? (
        <div className={styles.body}>
          <AutoSizer disableWidth={true}>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                itemCount={screenFilteredRecords.length}
                itemData={screenFilteredRecords}
                itemSize={() => 40}
              >
                {({ index, style }) => {
                  const record = screenFilteredRecords[index]
                  return (
                    <div style={style}>
                      <TableRow
                        key={record.s2id}
                        ports={portOptions}
                        //pointValue={pointValues[record.s2id]}
                        record={record}
                      ></TableRow>
                    </div>
                  )
                }}
              </List>
            )}
          </AutoSizer>
        </div>
      ) : (
        <p>No points found</p>
      )}
    </div>

  )
}

export default TableAnchorage

