import React from 'react'
import { Generators } from '@globalfishingwatch/layer-composer'
import fieldStyles from 'common/Field.module.css'
import styles from './EditorViewParams.module.css'
import { useViewParamsConnect } from './dataview.hooks'

const Dropdown = () => {
  const { type, setDataviewType } = useViewParamsConnect()
  return (
    <div className={fieldStyles.field}>
      <span className={fieldStyles.fieldkey}>type</span>
      <select
        className={fieldStyles.value}
        value={type}
        onChange={(event) => {
          setDataviewType(event.target.value)
        }}
      >
        {Object.entries(Generators.Type).map(([t, v]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </div>
  )
}

const EditorViewParams = () => {
  const { type, description, options, setLocalParamValue } = useViewParamsConnect()

  return (
    <div>
      <Dropdown selected={type} />
      <div className={styles.description}>{description}</div>
      {options.map((option) => (
        <div>
          <div>
            {option.key} ({option.type})
          </div>
          <input
            type="text"
            value={option.value}
            onChange={(event) => {
              setLocalParamValue(option.key, event.target.value)
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default EditorViewParams
