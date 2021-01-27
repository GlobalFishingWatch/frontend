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

const Splash = (WrappedComponent: any) => (props: any) => {
  const { loading } = useGFWLogin(GFWAPI)
  // const loading = true
  // const [loading, setLoading] = useState(true)
  // useEffect(() => {
  //   loading && setTimeout(()=>setLoading(false),)
  // } , [loading])
  return (
    <React.Fragment>
      {loading && <div className={styles.splashContainer}></div>}
      {!loading && <WrappedComponent {...props} />}
    </React.Fragment>
  )
}
export default Splash
