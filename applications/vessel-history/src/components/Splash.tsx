import React from 'react'
import GFWAPI from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import styles from './Splash.module.css'

function Splash(Component: React.ComponentType) {
  return function (props: React.ComponentProps<typeof Component>): JSX.Element {
    const { loading } = useGFWLogin(GFWAPI)
    return (
      <React.Fragment>
        {loading && <div className={styles.splashContainer}></div>}
        {!loading && <Component {...props} />}
      </React.Fragment>
    );
  };
}
export default Splash
