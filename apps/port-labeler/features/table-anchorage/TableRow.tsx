import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { InputText, Select, SelectOption } from '@globalfishingwatch/ui-components'
import useMapInstance from 'features/map/map-context.hooks'
import { PortPosition, PortSubarea } from 'types'
import { selectCountry, selectHoverPoint, selectPorts, selectSubareas, setHoverPoint, setPorts, setSubareas } from 'features/labeler/labeler.slice'
import { getFixedColorForUnknownLabel } from 'utils/colors'
import { selectPointValuesByCountry, selectPortValuesByCountry, selectSubareaValuesByCountry } from 'features/labeler/labeler.selectors'
import styles from './TableAnchorage.module.css'
import SubareaSelector, { SubareaSelectOption } from './components/SubareaSelector'
import { useValueManagerConnect } from './TableAnchorage.hooks'

type TableRowProps = {
  record: PortPosition
}

function TableRow({
  record,
}: TableRowProps) {
  const map = useMapInstance()
  const dispatch = useDispatch()

  const {
    onSubareaChange,
    onPointValueChange,
    onPortChange
  } = useValueManagerConnect()

  const onRowHover = useCallback((id: string, hover: boolean) => {
    dispatch(setHoverPoint(id))
    map.setFeatureState(
      { source: 'pointsLayer', id: parseInt(id, 16) },
      { hover }
    );
  }, [dispatch, map])

  const country = useSelector(selectCountry)
  const pointValues = useSelector(selectPointValuesByCountry)
  const pointValue = pointValues[record.s2id] ?? ''
  const portValues = useSelector(selectPortValuesByCountry)
  const selectedPort = portValues[record.s2id]

  const subareaValues = useSelector(selectSubareaValuesByCountry)
  const selectedSubarea = subareaValues[record.s2id]
  const hoverPoint = useSelector(selectHoverPoint)

  const ports = useSelector(selectPorts)
  const subareas = useSelector(selectSubareas)
  const subareaOptions: SubareaSelectOption[] = useMemo(() => {
    return subareas.map((subarea: PortSubarea) => ({
      label: subarea.name,
      id: subarea.id,
      color: subarea.color
    }))
  }, [subareas])

  const portOptions: SubareaSelectOption[] = useMemo(() => {
    return ports.map((port: PortSubarea) => ({
      label: port.name,
      id: port.id
    }))
  }, [ports])

  const onSubareaAdded = useCallback(() => {
    console.log('Adding a new subarea')
    const newId = Math.max.apply(null, subareas.map((subarea) => parseInt(subarea.id.replace(country + '-', ''))).filter(number => !isNaN(number))) + 1
    dispatch(setSubareas([...subareas, {
      id: country + '-' + newId,
      name: country + '-' + newId,
      color: getFixedColorForUnknownLabel(newId)
    }]))
  }, [country, dispatch, subareas])

  const onPortAdded = useCallback(() => {
    console.log('Adding a new port')
    dispatch(setPorts([...ports, {
      id: country + ' - ' + 'new port ' + ports.length,
      name: country + ' - ' + 'new port ' + ports.length,
    }]))
  }, [country, dispatch, subareas])

  const onSubareaNameChange = useCallback((id, value) => {
    dispatch(setSubareas(subareas.map(subarea => ({
      ...subarea,
      name: subarea.id === id ? value : subarea.name
    }))))
  }, [dispatch, subareas])

  const onPortNameChange = useCallback((id, value) => {
    dispatch(setPorts(ports.map(port => ({
      ...port,
      name: port.id === id ? value : port.name
    }))))
  }, [dispatch, ports])

  return (
    <div
      className={cx(styles.row, {
        [styles.rowHover]: hoverPoint === record.s2id,
      })}
      onMouseEnter={() => onRowHover(record.s2id, true)}
      onMouseLeave={() => onRowHover(record.s2id, false)}
    >
      <div className={styles.col}>
        <SubareaSelector
          className={styles.portSelector}
          onRemove={() => { }}
          onSelect={(selected: SelectOption) => {
            onPortChange(record.s2id, selected.id)
          }}
          selectedOption={portOptions.find(port => port.id === selectedPort)}
          onAddNew={onPortAdded}
          onSelectedNameChange={onPortNameChange}
          options={portOptions}
          placeholder="Select a port"
        ></SubareaSelector>
      </div>
      <div className={styles.col}>
        <SubareaSelector
          onRemove={() => { }}
          onSelect={(selected: SelectOption) => {
            onSubareaChange(record.s2id, selected.id)
          }}
          selectedOption={subareaOptions.find(subarea => subarea.id === selectedSubarea)}
          onAddNew={onSubareaAdded}
          onSelectedNameChange={onSubareaNameChange}
          options={subareaOptions}
          placeholder="Select a community"
        ></SubareaSelector>
      </div>
      <div className={styles.col}>
        <InputText value={pointValue} onChange={(value) => {
          onPointValueChange(record.s2id, value.target.value)
        }}></InputText>

      </div>
      <div className={styles.col}>
        {record.top_destination}
      </div>
    </div>
  )
}

export default TableRow
