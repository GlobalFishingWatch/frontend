import { useMutation } from 'react-query'

const useAuthedMutation = (...options) => {
  const mutation: any = (<any>useMutation)(...options)
  if (mutation?.error?.response?.status === 401) {
    // Insert custom access-token refresh logic here. For now, we are
    // just refreshing the page here, so as to redirect them to the
    // login page since their token is now expired.
    window.location.reload()
  }
  return mutation
}

export default useAuthedMutation
