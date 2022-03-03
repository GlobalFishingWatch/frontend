import React, { useCallback } from 'react'
import cx from 'classnames'
import { useDispatch } from 'react-redux'
import { Select, SelectOption } from '@globalfishingwatch/ui-components'
import useMapInstance from 'features/map/map-context.hooks'
import { PortPosition } from 'types'
import { setHoverPoint } from 'features/labeler/labeler.slice'
import styles from './Table.module.css'
import SubareaSelector, { SubareaSelectOption } from './components/SubareaSelector'

type TableRowProps = {
  ports: SelectOption[],
  hover: boolean,
  subareas: SubareaSelectOption[],
  selectedPort: string,
  selectedSubarea: string,
  onSubareaNameChange: (id, value) => void
  onSubareaChange: (id, value) => void
  onPortChange: (id, value) => void
  record: PortPosition
  onNewSubareaAdded: () => void
}

function TableRow({
  ports,
  hover,
  subareas,
  record,
  selectedPort,
  selectedSubarea,
  onSubareaNameChange,
  onSubareaChange,
  onPortChange,
  onNewSubareaAdded
}: TableRowProps) {
  const map = useMapInstance()
  const dispatch = useDispatch()
  const onRowHover = useCallback((id: string, hover: boolean) => {
    dispatch(setHoverPoint(id))
    map.setFeatureState(
      { source: 'pointsLayer', id: parseInt(id, 16) },
      { hover }
    );
  }, [dispatch, map])

  return (
    <div
      className={cx(styles.row, {
        [styles.rowHover]: hover,
      })}
      onMouseEnter={() => onRowHover(record.s2id, true)}
      onMouseLeave={() => onRowHover(record.s2id, false)}
    >
      <div className={styles.col}>
        <Select
          className={styles.portSelector}
          options={ports}
          selectedOption={{ id: selectedPort, label: selectedPort }}
          onRemove={() => {

          }}
          onSelect={(selected: SelectOption) => {
            onPortChange(record.s2id, selected.id)
          }}
        />
      </div>
      <div className={styles.col}>
        <SubareaSelector
          onRemove={() => {

          }}
          onSelect={(selected: SelectOption) => {
            onSubareaChange(record.s2id, selected.id)
          }}
          selectedOption={subareas.find(subarea => subarea.id === selectedSubarea)}
          onAddNew={onNewSubareaAdded}
          onSubareaChange={onSubareaNameChange}
          options={subareas}
        ></SubareaSelector>
      </div>
      <div className={styles.col}>
        {record.community_iso3} ({record.s2id})
      </div>
      <div className={styles.col}>
        {record.top_destination}
      </div>
    </div>
  )
}

export default TableRow
