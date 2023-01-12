import { forwardRef, useCallback, useMemo } from 'react'
import { getProviders, signIn } from 'next-auth/react'
import { useLoginRedirect } from '@globalfishingwatch/react-hooks'

type LocalStorageLoginLinkProps = {
  children: React.ReactNode
  className?: string
}

function LocalStorageLoginLink({ children, className = '' }: LocalStorageLoginLinkProps, ref: any) {
  const { saveRedirectUrl } = useLoginRedirect()

  const providers = useMemo(async () => Object.keys((await getProviders()) ?? {}), [])

  const onLoginClick = useCallback(
    (e) => {
      e.preventDefault()
      saveRedirectUrl()
      providers.then((providerIds) =>
        // When only one provider is set, then signIn with it directly
        // instead of displaying the signIn page with multiple buttons
        providerIds.length === 1 ? signIn(providerIds[0]) : signIn()
      )
    },
    [providers, saveRedirectUrl]
  )

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a ref={ref} href="#" onClick={onLoginClick} className={className} title="Login">
      {children}
    </a>
  )
}

export default forwardRef(LocalStorageLoginLink)
