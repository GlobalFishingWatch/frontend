import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import type { PortPosition } from 'types'
import { v4 as uuidv4 } from 'uuid'

import { flags } from '@globalfishingwatch/i18n-labels'
import type { SelectOption} from '@globalfishingwatch/ui-components';
import { IconButton, InputText, Modal, Tooltip } from '@globalfishingwatch/ui-components'

import {
  selectPointValuesByCountry,
  selectPortsByCountry,
  selectPortsOptions,
  selectPortValuesByCountry,
  selectSubareaOptions,
  selectSubareasByCountry,
  selectSubareaValuesByCountry
} from 'features/labeler/labeler.selectors'
import { selectCountry, selectHoverPoint, setHoverPoint, setPorts, setSubareas } from 'features/labeler/labeler.slice'
import useMapInstance from 'features/map/map-context.hooks'
import { getFixedColorForUnknownLabel } from 'utils/colors'

import type { SubareaSelectOption } from './components/SubareaSelector';
import SubareaSelector from './components/SubareaSelector'
import { useValueManagerConnect } from './TableAnchorage.hooks'

import styles from './TableAnchorage.module.css'

type TableRowProps = {
  record: PortPosition
  extra: boolean
  onCountryChange: (point: PortPosition) => void
}

function TableRow({
  record,
  extra,
  onCountryChange
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
  const pointValue = country && pointValues ? pointValues[record.s2id] : ''
  const portValues = useSelector(selectPortValuesByCountry)
  const selectedPort = country && portValues ? portValues[record.s2id] : ''

  const subareaValues = useSelector(selectSubareaValuesByCountry)
  const selectedSubarea = country && subareaValues ? subareaValues[record.s2id] : ''
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
        [styles.rowBorder]: !country,
      })}
      onMouseEnter={() => onRowHover(record.s2id, true)}
      onMouseLeave={() => onRowHover(record.s2id, false)}
    >
      <div className={styles.col}>
        {country ? <SubareaSelector
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
          : <Tooltip content={record.port_label}><span>{record.port_label}</span></Tooltip>
        }
      </div>
      <div className={styles.col}>
        {country ? <SubareaSelector
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
          : <Tooltip content={record.community_label}><span>{record.community_label}</span></Tooltip>}
      </div>
      <div className={styles.col}>
        {country ? <InputText value={pointValue} onChange={(value) => {
          onPointValueChange(record.s2id, value.target.value)
        }}></InputText>
          : <Tooltip content={record.point_label}><span>{record.point_label}</span></Tooltip>}

      </div>
      <div className={styles.col}>
        <Tooltip content={record.top_destination}><span>{record.top_destination}</span></Tooltip>
      </div>
      {extra && <div className={styles.col}>
        <span>{record.s2id}</span>
      </div>}
      {extra && <div className={styles.col}>
        <span
          onClick={() => onCountryChange(record)}
          className={styles.actionButton}
        >{flags[record.iso3] ?? record.iso3}</span>
      </div>}
    </div>
  )
}

export default TableRow
