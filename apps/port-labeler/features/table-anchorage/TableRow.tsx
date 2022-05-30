import React, { useCallback } from 'react'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import { InputText, SelectOption } from '@globalfishingwatch/ui-components'
import useMapInstance from 'features/map/map-context.hooks'
import { PortPosition } from 'types'
import { selectCountry, selectHoverPoint, setHoverPoint, setPorts, setSubareas } from 'features/labeler/labeler.slice'
import { getFixedColorForUnknownLabel } from 'utils/colors'
import {
  selectPointValuesByCountry,
  selectPortsByCountry,
  selectPortsOptions,
  selectPortValuesByCountry,
  selectSubareaOptions,
  selectSubareasByCountry,
  selectSubareaValuesByCountry
} from 'features/labeler/labeler.selectors'
import styles from './TableAnchorage.module.css'
import SubareaSelector, { SubareaSelectOption } from './components/SubareaSelector'
import { useValueManagerConnect } from './TableAnchorage.hooks'

type TableRowProps = {
  record: PortPosition
  extra: boolean
}

function TableRow({
  record,
  extra
}: TableRowProps) {
  const map = useMapInstance()
  const dispatch = useDispatch()
  const { t } = useTranslation()
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

  const ports = useSelector(selectPortsByCountry)
  const subareas = useSelector(selectSubareasByCountry)
  const subareaOptions: SubareaSelectOption[] = useSelector(selectSubareaOptions)

  const portOptions: SubareaSelectOption[] = useSelector(selectPortsOptions)

  const onSubareaAdded = useCallback(() => {
    console.log('Adding a new subarea')
    const newId = Math.max.apply(null, subareas.map((subarea) => parseInt(subarea.id.replace(country + '-', ''))).filter(number => !isNaN(number))) + 1
    dispatch(setSubareas([...subareas, {
      id: uuidv4(),
      name: country + '-' + newId,
      color: getFixedColorForUnknownLabel(newId)
    }]))
  }, [country, dispatch, subareas])

  const onPortAdded = useCallback(() => {
    console.log('Adding a new port')
    const newPorts = [...ports, {
      id: uuidv4(),
      name: country + '-' + (ports.length + 1),
    }]
    dispatch(setPorts(newPorts))
  }, [country, dispatch, ports])

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
          placeholder={t('common.select_port', 'Select a port')}
          addButtonLabel={t('common.add_port', 'Add new port')}
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
          placeholder={t('common.select_subarea', 'Select a community')}
          addButtonLabel={t('common.select_subarea', 'Add new community')}
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
      {extra && <div className={styles.col}>
        {record.s2id}
      </div>}
    </div>
  )
}

export default TableRow
