import React, { useMemo, useCallback } from 'react'
import cx from 'classnames'
import Downshift from 'downshift'
import { GraphType, GraphOption } from 'types/app.types'
import Tooltip from 'components/tooltip/tooltip'
import styles from './graph-select.module.css'

interface GraphProps {
  options: GraphOption[]
  selectedIndex: number
  setGraph: (type: GraphType) => void
}

const itemToString = (item: GraphOption | null) => (item ? item.label : '')

const GraphSelect: React.FC<GraphProps> = (props): React.ReactElement => {
  const { options, selectedIndex, setGraph } = props

  const handleChange = useCallback(
    (item: GraphOption | null) => {
      if (item) setGraph(item.value)
    },
    [setGraph]
  )

  const selectedOption = useMemo(() => options[selectedIndex], [options, selectedIndex])

  return (
    <Downshift onSelect={handleChange} itemToString={itemToString} selectedItem={selectedOption}>
      {(downshift: any) => {
        const {
          getToggleButtonProps,
          getMenuProps,
          getLabelProps,
          isOpen,
          getItemProps,
          highlightedIndex,
          selectedItem,
        } = downshift
        return (
          <div className={cx(styles.graphSelector, { [styles.isOpen]: isOpen })}>
            <button
              {...getToggleButtonProps()}
              aria-label="Change visualization metric"
              className={styles.toggleBtn}
            >
              <span {...getLabelProps()}>{selectedItem && selectedItem.label}</span>
            </button>
            <ul
              {...getMenuProps()}
              className={styles.listContainer}
              style={{ top: `-${selectedIndex * 3}rem` }}
            >
              {isOpen &&
                options.map((item, index) => (
                  <Tooltip content={item.tooltip} placement="top" key={item.value}>
                    <li
                      className={cx(
                        styles.listItem,
                        { [styles.highlighted]: highlightedIndex === index },
                        { [styles.disabled]: item.disabled === true },
                        { [styles.selected]: selectedItem && selectedItem.value === item.value }
                      )}
                      key={item.value}
                      {...getItemProps({ item, index })}
                    >
                      {item.label}
                    </li>
                  </Tooltip>
                ))}
            </ul>
          </div>
        )
      }}
    </Downshift>
  )
}

export default GraphSelect
