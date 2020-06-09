import React, { useMemo } from 'react'
import { omit } from 'lodash'
import generatorsSchema from '@globalfishingwatch/layer-composer/dist/json-schema.json'
// import styles from './Field.module.css'
import { Generators } from '@globalfishingwatch/layer-composer'
import fieldStyles from 'common/Field.module.css'

const Dropdown = ({ selected }) => {
  return (
    <div className={fieldStyles.field}>
      <span className={fieldStyles.fieldkey}>type</span>
      <select className={fieldStyles.value} value={selected}>
        {Object.entries(Generators.Type).map(([t, v]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </div>
  )
}

const EditorViewParams = ({ editorId, params }) => {
  const { generatorSchema, options } = useMemo(() => {
    const type = params?.type
    const globalConfigKeys = Object.keys(
      generatorsSchema.definitions.GlobalGeneratorConfig.properties
    )
    const generatorForTypeEntry = Object.entries(generatorsSchema.definitions).find(
      (generatorEntry) => {
        const generator = generatorEntry[1]
        return (
          generator.properties &&
          generator.properties.type &&
          generator.properties.type.enum &&
          generator.properties.type.enum[0] === type
        )
      }
    )
    if (!generatorForTypeEntry) return null
    const generatorForType = generatorForTypeEntry[1]
    const allOptions = generatorForType.properties
    const filteredOptions = omit(allOptions, ['id', 'type', 'data'].concat(globalConfigKeys))
    return { generatorSchema: generatorForType, options: filteredOptions }
  }, [params])
  console.log(generatorSchema, Object.entries(options))
  if (!generatorSchema) {
    return <div>error</div>
  }
  return (
    <div>
      <Dropdown selected={params.type} />
      {generatorSchema.description}
      {Object.entries(options).map(([optionKey, v]) => (
        <div>
          <div>
            {optionKey} ({v.type})
          </div>
          <input
            // className={styles.value}
            type="text"
            value={'lol'}
            // onChange={(event) => {
            //   if (onValueChange) onValueChange(event.target.value)
            // }}
          />
        </div>
      ))}
    </div>
  )
}

export default EditorViewParams
