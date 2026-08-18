import { useStore } from 'react-redux'

import { Button, Icon } from '@globalfishingwatch/ui-components'

import { debugInitialState } from 'features/debug/debug.slice'
import { locationInitialState } from 'router/location.slice'
import type { RootState } from 'store'
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

  const getStringifyState = (
    { useInitialLocationState = true } = {} as {
      useInitialLocationState: boolean
    }
  ) => {
    const state = store.getState() as RootState
    return JSON.stringify(
      sortObjectKeysDeep({
        ...state,
        location: useInitialLocationState ? locationInitialState : state.location,
        debug: debugInitialState,
      })
    )
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <label>Global state extractor</label>
      </div>
      <div className={styles.row}>
        <Button
          size="medium"
          tooltip="Copy entire redux state with initial location state"
          onClick={() => {
            copyToClipboard(getStringifyState())
          }}
        >
          <Icon icon="copy" />
          With initial location state
        </Button>
        <Button
          size="medium"
          type="secondary"
          tooltip="Copy entire redux state to clipboard"
          className={styles.padding}
          onClick={() => {
            copyToClipboard(getStringifyState({ useInitialLocationState: false }))
          }}
        >
          With current location state
        </Button>
      </div>
    </section>
  )
}

export default DebugTestingTools
