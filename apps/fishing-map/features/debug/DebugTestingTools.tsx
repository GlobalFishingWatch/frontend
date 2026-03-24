import { useStore } from 'react-redux'

import { IconButton } from '@globalfishingwatch/ui-components'

import { debugInitialState } from 'features/debug/debug.slice'
import copyToClipboard from 'utils/clipboard'

import styles from './DebugMenu.module.css'

function sortObjectKeysDeep(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    const isPrimitiveArray = obj.every(
      (item) => typeof item === 'string' || typeof item === 'number'
    )
    if (isPrimitiveArray) {
      return [...obj].sort()
    }
    return obj.map(sortObjectKeysDeep)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj as object)
      .sort()
      .reduce(
        (sorted, key) => {
          sorted[key] = sortObjectKeysDeep((obj as Record<string, unknown>)[key])
          return sorted
        },
        {} as Record<string, unknown>
      )
  }
  return obj
}

const DebugTestingTools: React.FC = () => {
  const store = useStore()

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <label>Global state extractor</label>
        <IconButton
          icon="copy"
          tooltip="Copy entire redux state to clipboard"
          onClick={() => {
            copyToClipboard(
              JSON.stringify(
                sortObjectKeysDeep({ ...(store.getState() as any), debug: debugInitialState })
              )
            )
          }}
        />
      </div>
    </section>
  )
}

export default DebugTestingTools
