import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import type { PortPosition } from 'types'

import { flags } from '@globalfishingwatch/i18n-labels'
import type { SelectOption } from '@globalfishingwatch/ui-components';
import { IconButton, Modal, Select } from '@globalfishingwatch/ui-components'

import { selectFilteredPoints } from 'features/labeler/labeler.selectors'
import {
  changeAnchoragePort,
  selectCountries,
  selectDisplayExtraData,
  sortPoints,
  toogleExtraData,
} from 'features/labeler/labeler.slice'
import { useMapBounds } from 'features/map/controls/map-controls.hooks'

import TableHeader from './TableHeader'
import TableRow from './TableRow'

import styles from './TableAnchorage.module.css'

function TableAnchorage() {
  const { t } = useTranslation()
  const records = useSelector(selectFilteredPoints)
  const extraColumn = useSelector(selectDisplayExtraData)
  const countries: SelectOption[] = useSelector(selectCountries)
  const dispatch = useDispatch()
  type orderDirectionType = 'asc' | 'desc' | ''

  const [orderColumn, setOrderColumn] = useState(null)
  const [orderDirection, setOrderDirection] = useState<orderDirectionType>('')
  const [anchorageChangeCountryOpen, setAnchorageChangeCountryOpen] = useState<PortPosition>(null)

  const onToggleHeader = useCallback((column, order) => {
    setOrderColumn(column)
    setOrderDirection(order)
    dispatch(sortPoints({ orderColumn: column, orderDirection: order }))
  }, [])

  const mapBounds = useMapBounds()

  const pointInScreen = useCallback(
    (point: PortPosition) => {
      return (
        mapBounds &&
        mapBounds.north >= point.lat &&
        mapBounds.south <= point.lat &&
        mapBounds.west <= point.lon &&
        mapBounds.east >= point.lon
      )
    },
    [mapBounds]
  )

  const onSetCountryToChange = useCallback((point: PortPosition) => {
    setAnchorageChangeCountryOpen(point)
  }, [])

  const changeAnchorageCountry = useCallback(
    (newCountry) => {
      dispatch(
        changeAnchoragePort({
          id: anchorageChangeCountryOpen.s2id,
          iso3: newCountry,
        })
      )
      setAnchorageChangeCountryOpen({
        ...anchorageChangeCountryOpen,
        iso3: newCountry,
      })
    },
    [anchorageChangeCountryOpen]
  )

  const screenFilteredRecords = useMemo(() => {
    return records?.filter((record) => pointInScreen(record))
  }, [records, mapBounds])

  return (
    <div className={styles.table}>
      <div className={styles.head}>
        <TableHeader
          label={t('common.port', 'Port')}
          order={orderColumn === 'port' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('port', order)}
        />
        <TableHeader
          label={t('common.subarea', 'Subarea')}
          order={orderColumn === 'subarea' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('subarea', order)}
        />
        <TableHeader
          label={t('common.anchorage', 'Anchorage')}
          order={orderColumn === 'anchorage' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('anchorage', order)}
        />
        <TableHeader
          label={t('common.destination', 'Destination')}
          order={orderColumn === 'top_destination' ? orderDirection : ''}
          onToggle={(order) => onToggleHeader('top_destination', order)}
        />
        {extraColumn && <TableHeader label={t('common.anchorageId', 'Anchorage ID')} />}
        {extraColumn && <TableHeader label={t('common.country', 'Country')} />}
        <IconButton
          type="default"
          icon="more"
          tooltip="Toggle extra data"
          tooltipPlacement="bottom"
          className={styles.actionButton}
          onClick={() => dispatch(toogleExtraData())}
        />
      </div>

      {screenFilteredRecords && screenFilteredRecords.length ? (
        <div className={styles.body}>
          <AutoSizer disableWidth={true}>
            {(params: any) => (
              <List
                width={params.width}
                height={params.height}
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
                        onCountryChange={onSetCountryToChange}
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

      <Modal
        appSelector="__next"
        title={'Change anchorage country'}
        isOpen={!!anchorageChangeCountryOpen}
        onClose={() => setAnchorageChangeCountryOpen(null)}
      >
        <div>
          <Select
            options={countries}
            onRemove={() => {}}
            placeholder={t('messages.country_selection', 'Select a country')}
            selectedOption={
              anchorageChangeCountryOpen
                ? {
                    id: anchorageChangeCountryOpen.iso3,
                    label:
                      flags[anchorageChangeCountryOpen.iso3] ?? anchorageChangeCountryOpen.iso3,
                  }
                : undefined
            }
            onSelect={(selected: SelectOption) => {
              changeAnchorageCountry(selected.id)
            }}
          />
        </div>
      </Modal>
    </div>
  )
}

export default TableAnchorage
