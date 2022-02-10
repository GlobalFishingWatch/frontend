import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SelectOption } from '@globalfishingwatch/ui-components'
import { DATA } from 'features/app/data'
import { COLORS } from 'data/config'
import styles from './Table.module.css'
import { SubareaSelectOption } from './components/SubareaSelector'
import TableHeader from './TableHeader'
import TableRow from './TableRow'

interface TableProps {
  country?: string
}
function Table({
  country
}: TableProps) {

  const [subareas, setSubareas] = useState<SubareaSelectOption[]>()
  
  const records = useMemo(() => {
    return DATA.filter(item => item.iso3 === country)
  }, [country])

  const initialSubareas: SubareaSelectOption[] = useMemo(() => {
    const duplicated: string[] = records.map(e => {
        return e.sublabel
    })
    const pts = [...new Set(duplicated)];

    return pts.map((e,index) => {
        return {
            id: e,
            label: e,
            color: COLORS[index]
        }
    })
  }, [records])

  useEffect(() => setSubareas(initialSubareas), [initialSubareas, country])

  const ports: SelectOption[] = useMemo(() => {
    const portsDuplicated: string[] = records.map(e => {
        return e.label
    })
    const pts = [...new Set(portsDuplicated)];

    return pts.map(e => {
        return {
            id: e,
            label: e,
        }
    })
    
  }, [records])
  
  type orderDirectionType = 'asc' | 'desc' | ''

  const [orderColumn, setOrderColumn] = useState(null)
  const [orderDirection, setOrderDirection] = useState<orderDirectionType>('')

  
  const onToggleHeader = useCallback((column, order) => {
    setOrderColumn(column)
    setOrderDirection(order)
  }, [])

  const onSubareaAdded = useCallback(() => {
    console.log('Adding a new subarea')
    setSubareas([...subareas, {
      id: subareas.length + 1,
      label: '--- ' + (subareas.length + 1),
      color: COLORS[subareas.length]
    }])
  }, [subareas, setSubareas])

  const onSubareaChange = useCallback((id, value) => {
    setSubareas(subareas.map(subarea => ({
      ...subarea,
      label: subarea.id === id ? value: subarea.label
    })))
  }, [subareas, setSubareas])

  return (
    <table className={styles.table}>
      <thead>
        <tr>
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
        </tr>
      </thead>
      <tbody>
        {records && records.map(record => 
          <TableRow
            key={record.s2id}
            ports={ports}
            subareas={subareas ?? []}
            onNewSubareaAdded={onSubareaAdded}
            onSubareaChange={onSubareaChange}
            onPortChange={() => null}
            record={record}
            ></TableRow>
        )}
      </tbody>
    </table>
  )
}

export default Table
