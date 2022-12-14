import { signOut } from 'next-auth/react'
import { useQuery } from 'react-query'

const useAuthedQuery = (...options) => {
  const query: any = (<any>useQuery)(...options)
  if (query?.error?.statusCode === 401) {
    // Insert custom access-token refresh logic here. For now, we are
    // just refreshing the page here, so as to redirect them to the
    // login page since their token is now expired.
    // signOut()
    console.log('window.location.reload()')
  }
  return query
}

export default useAuthedQuery
