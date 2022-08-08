import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectDisplayExtraData, sortPoints, toogleExtraData } from 'features/labeler/labeler.slice'
import { useMapBounds } from 'features/map/controls/map-controls.hooks'
import { PortPosition } from 'types'
import { selectFilteredPoints } from 'features/labeler/labeler.selectors'
import styles from './TableAnchorage.module.css'
import TableHeader from './TableHeader'
import TableRow from './TableRow'

function TableAnchorage() {

  const { t } = useTranslation()
  const records = useSelector(selectFilteredPoints)
  const extraColumn = useSelector(selectDisplayExtraData)
  const dispatch = useDispatch()
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
          label={t('common.port', 'Port')} order={orderColumn === 'port' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('port', order)}
        />
        <TableHeader
          label={t('common.subarea', 'Subarea')} order={orderColumn === 'subarea' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('subarea', order)} />
        <TableHeader
          label={t('common.anchorage', 'Anchorage')} order={orderColumn === 'anchorage' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('anchorage', order)} />
        <TableHeader
          label={t('common.destination', 'Destination')} order={orderColumn === 'top_destination' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('top_destination', order)} />
        {extraColumn && <TableHeader
          label={t('common.anchorageId', 'Anchorage ID')} />}
        <IconButton
          type="default"
          icon='more'
          tooltip="Toggle extra data"
          tooltipPlacement="bottom"
          className={styles.actionButton}
          onClick={() => dispatch(toogleExtraData())}
        />
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
                        record={record}
                        extra={extraColumn}
                      ></TableRow>
                    </div>
                  )
                }}
              </List>
            )}
          </AutoSizer>
        </div>
      ) : (
        <p className={styles.alert}>{t('messages.no_anchorages', 'No anchorages found')}</p>
      )}
    </div>

  )
}

export default TableAnchorage

