import React from 'react'
import GFWAPI from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import styles from './Splash.module.css'

// export default function Splash(WrappedComponent: React.ReactElement): React.ReactElement {
//   return (props: any) => {
//     const { loading } = useGFWLogin(GFWAPI)

//     return (
//       <React.Fragment>

//         {loading && (<div className={styles.splashContainer}></div>)}
//         {!loading && (<WrappedComponent {...props} />)}
//       </React.Fragment>
//     )
//   }
// }

function Splash() {
  return function <T>(
    Component: React.ComponentType<T>
  ) {
    return function (props: T): JSX.Element {
      const { loading } = useGFWLogin(GFWAPI)
      return (
        <React.Fragment>
          {loading && <div className={styles.splashContainer}></div>}
          {!loading && <Component {...props} />}
        </React.Fragment>
      );
    };
  };
}
export default Splash
