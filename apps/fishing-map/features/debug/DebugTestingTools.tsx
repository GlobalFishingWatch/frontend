import { useStore } from 'react-redux'

import { IconButton } from '@globalfishingwatch/ui-components'

import copyToClipboard from 'utils/clipboard'

import styles from './DebugMenu.module.css'

const DebugTestingTools: React.FC = () => {
  const store = useStore()

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <label>Global state extractor</label>
        <IconButton
          icon="copy"
          tooltip="Copy global state to clipboard"
          onClick={() => {
            copyToClipboard(JSON.stringify(store.getState()))
          }}
        />
      </div>
    </section>
  )
}

export default DebugTestingTools
