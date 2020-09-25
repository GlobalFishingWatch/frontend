import React, { Fragment } from 'react'
import Switch from '@globalfishingwatch/ui-components/dist/switch'
import { useGeneratorsConnect } from 'features/map/map.hooks'
import styles from './Sidebar.module.css'

function Sidebar(): React.ReactElement {
  const { generatorsConfig, updateGenerator } = useGeneratorsConnect()
  return (
    <div className={styles.aside}>
      <h2>Sidebar</h2>
      {generatorsConfig.map(({ id, visible = true }) => {
        return (
          <Fragment key={id}>
            <label>Toggle {id} layer visibility</label>
            <Switch
              active={visible}
              onClick={() => updateGenerator({ id, config: { visible: !visible } })}
            ></Switch>
          </Fragment>
        )
      })}
    </div>
  )
}

export default Sidebar
