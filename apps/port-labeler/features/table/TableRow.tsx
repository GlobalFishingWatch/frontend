import React, { Fragment, useCallback } from 'react'
import { Select, SelectOption } from '@globalfishingwatch/ui-components'
import { PortPosition } from 'features/app/data'
import useMapInstance from 'features/map/map-context.hooks'
import styles from './Table.module.css'
import SubareaSelector, { SubareaSelectOption } from './components/SubareaSelector'

type SidebarProps = {
  ports: SelectOption[],
  hidden: boolean,
  subareas: SubareaSelectOption[],
  onSubareaChange: (id, value) => void
  onPortChange: (id, value) => void
  record: PortPosition
  onNewSubareaAdded: () => void
}

function TableRow({ 
  ports, 
  hidden, 
  subareas,
  record,
  onSubareaChange,
  onPortChange,
  onNewSubareaAdded 
}: SidebarProps) {

  const map = useMapInstance()
  const onRowHover = useCallback((id: string, hover: boolean) => {
    console.log(id, hover)
    map.setFeatureState(
      { source: 'pointsLayer', id: parseInt(id, 16) },
      { hover }
    );
  }, [map])

  return (
    <tr 
      style={{display: hidden ? 'none' : 'table-row'}}
      onMouseEnter={() => onRowHover(record.s2id, true)}
      onMouseLeave={() => onRowHover(record.s2id, false)}
    >
      <td>
        <Select
          className={styles.portSelector}
          options={ports}
          selectedOption={{id: record.label, label: record.label}}
          onRemove={() => {

          }}
          onSelect={(selected: SelectOption) => {
            onPortChange(record.s2id, selected.id)
          }}
        />
      </td>
      <td>
        <SubareaSelector
          onRemove={() => {

          }}
          onSelect={(selected: SelectOption) => {

          }}
          selectedOption={subareas.find(subarea => subarea.id === record.sublabel)}
          onAddNew={onNewSubareaAdded}
          onSubareaChange={onSubareaChange}
          options={subareas}
        ></SubareaSelector>
      </td>
      <td>
        {record.s2id}
      </td>
    </tr>
  )
}

export default TableRow
