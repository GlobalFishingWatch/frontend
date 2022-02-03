import dynamic from 'next/dynamic'

export const HeaderNoSSR = dynamic(() => import('@globalfishingwatch/ui-components/dist/header'), {
  ssr: false,
})

export const Button = dynamic(() => import('@globalfishingwatch/ui-components/dist/button'), {
  ssr: false,
})

export const IconButton = dynamic(
  () => import('@globalfishingwatch/ui-components/dist/icon-button'),
  {
    ssr: false,
  }
)
export const Spinner = dynamic(() => import('@globalfishingwatch/ui-components/dist/spinner'), {
  ssr: false,
})
