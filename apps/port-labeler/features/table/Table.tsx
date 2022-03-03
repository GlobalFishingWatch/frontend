import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { SelectOption } from '@globalfishingwatch/ui-components'
import { changePortValue, changeSubareaValue, selectCountry, selectHoverPoint, selectPorts, selectPortValues, selectSelectedPoints, selectSubareas, selectSubareaValues, setPorts, setPortValues, setSubareas, setSubareaValues } from 'features/labeler/labeler.slice'
import { useMapBounds } from 'features/map/controls/map-controls.hooks'
import { PortPosition, PortSubarea } from 'types'
import { selectPortPointsByCountry } from 'features/map/map.selectors'
import { getFixedColorForUnknownLabel } from 'utils/colors'
import styles from './Table.module.css'
import { SubareaSelectOption } from './components/SubareaSelector'
import TableHeader from './TableHeader'
import TableRow from './TableRow'

function Table() {

  const subareas = useSelector(selectSubareas)
  const ports = useSelector(selectPorts)
  const subareaValues = useSelector(selectSubareaValues)
  const portValues = useSelector(selectPortValues)

  const subareaOptions: SubareaSelectOption[] = useMemo(() => {
    return subareas.map((subarea: PortSubarea) => ({
      label: subarea.name,
      id: subarea.id,
      color: subarea.color
    }))
  }, [subareas])
  const country = useSelector(selectCountry)
  const records = useSelector(selectPortPointsByCountry)
  const dispatch = useDispatch()

  useEffect(() => {
    const tempPorts = []
    const tempSubareas = []
    if (!records?.length) {
      return
    }
    records.forEach(e => {
      tempPorts.push(e.label)
      tempSubareas.push(e.community_iso3)
    })
    const uniqueTempPorts = [...new Set(tempPorts)];
    const uniqueTempSubareas = [...new Set(tempSubareas)];

    dispatch(setSubareas(uniqueTempSubareas.map((e, index) => {
      const record = records.find(record => record.community_iso3 === e)
      return {
        id: e,
        name: record.sublabel ?? record.community_iso3,
        color: getFixedColorForUnknownLabel(index)
      }
    })))
    dispatch(setPorts(uniqueTempPorts))
    const portMap = records.reduce((ac, value, i, v) => {
      ac[value.s2id] = value.label
      return ac
    }, {})
    dispatch(setPortValues(portMap))
    const subareaMap = records.reduce((ac, value, i, v) => {
      ac[value.s2id] = value.community_iso3
      return ac
    }, {})
    dispatch(setSubareaValues(subareaMap))
  }, [country])

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
  }, [])

  const onSubareaAdded = useCallback(() => {
    console.log('Adding a new subarea')
    const newId = Math.max.apply(null, subareas.map((subarea) => parseInt(subarea.id.replace(country + '-', ''))).filter(number => !isNaN(number))) + 1
    dispatch(setSubareas([...subareas, {
      id: country + '-' + newId,
      name: country + '-' + newId,
      color: getFixedColorForUnknownLabel(newId)
    }]))
  }, [country, dispatch, subareas])
  const selected = useSelector(selectSelectedPoints)
  const onSubareaNameChange = useCallback((id, value) => {
    dispatch(setSubareas(subareas.map(subarea => ({
      ...subarea,
      name: subarea.id === id ? value : subarea.name
    }))))
  }, [dispatch, subareas])

  const onSubareaChange = useCallback((id, value) => {
    dispatch(changeSubareaValue({ id, value, selected }))
  }, [dispatch])

  const onPortChange = useCallback((id, value) => {
    dispatch(changePortValue({ id, value, selected }))
  }, [dispatch])

  const sortRecords = useMemo(() => {
    if (orderColumn === 'anchorage') {
      return records.sort((a, b) => {
        if (orderDirection === 'desc') {
          return (a.s2id < b.s2id) ? 1 : -1
        }
        return (a.s2id > b.s2id) ? 1 : -1
      })
    }
    if (orderColumn === 'port') {
      return records.sort((a, b) => {
        if (orderDirection === 'desc') {
          return (portValues[a.s2id] < portValues[b.s2id]) ? 1 : -1
        }
        return (portValues[a.s2id] > portValues[b.s2id]) ? 1 : -1
      })
    }
    if (orderColumn === 'subarea') {
      return records.sort((a, b) => {
        if (orderDirection === 'desc') {
          return (subareaValues[a.s2id] < subareaValues[b.s2id]) ? 1 : -1
        }
        return (subareaValues[a.s2id] > subareaValues[b.s2id]) ? 1 : -1
      })
    }
    if (orderColumn === 'top_destination') {
      return records.sort((a, b) => {
        if (orderDirection === 'desc') {
          return (a.top_destination < b.top_destination) ? 1 : -1
        }
        return (a.top_destination > b.top_destination) ? 1 : -1
      })
    }
    return records
  }, [records, orderDirection, orderColumn])

  const hoverPoint = useSelector(selectHoverPoint)
  const mapBounds = useMapBounds()

  const pointInScreen = useCallback((point: PortPosition) => {
    return mapBounds.north >= point.lat && mapBounds.south <= point.lat
      && mapBounds.west <= point.lon && mapBounds.east >= point.lon
  }, [mapBounds])

  const screenFilteredRecords = useMemo(() => {

    return sortRecords?.filter((record) => (selected.length && selected.indexOf(record.s2id) !== -1) ||
      (!selected.length && pointInScreen(record)))
  }, [sortRecords, selected, mapBounds, orderColumn, orderDirection])

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
      <div>
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
                          hover={record.s2id === hoverPoint}
                          ports={portOptions}
                          subareas={subareaOptions ?? []}
                          selectedPort={portValues[record.s2id]}
                          selectedSubarea={subareaValues[record.s2id]}
                          onNewSubareaAdded={onSubareaAdded}
                          onSubareaNameChange={onSubareaNameChange}
                          onSubareaChange={onSubareaChange}
                          onPortChange={onPortChange}
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
    </div>
  )
}

export default Table

