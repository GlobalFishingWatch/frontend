import React from 'react'
import { Button, Icon, InputText, Select, SelectOption } from '@globalfishingwatch/ui-components'
import { PortPosition } from 'features/app/data'
import styles from './Table.module.css'
import SubareaSelector, { SubareaSelectOption } from './components/SubareaSelector'

type SidebarProps = {
  ports: SelectOption[],
  subareas: SubareaSelectOption[],
  onSubareaChange: (id, value) => void
  onPortChange: (id, value) => void
  record: PortPosition
  onNewSubareaAdded: () => void
}

function TableRow({ 
  ports, 
  subareas,
  record,
  onSubareaChange,
  onPortChange,
  onNewSubareaAdded 
}: SidebarProps) {


  return (
    <tr>
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
