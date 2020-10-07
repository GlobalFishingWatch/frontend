import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { selectDataviews } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'

export const useDataviewsConnect = () => {
  const urlDataviews = useSelector(selectDataviews)
  const { dispatchQueryParams } = useLocationConnect()
  const updateUrlDataview = useCallback(
    (dataview: Partial<Dataview>) => {
      const currentDataview = urlDataviews?.find((urlDataview) => urlDataview.uid === dataview.uid)
      if (currentDataview) {
        const dataviews = urlDataviews.map((urlDataview) => {
          if (urlDataview.uid !== dataview.uid) return urlDataview
          return {
            ...urlDataview,
            ...dataview,
          }
        })
        dispatchQueryParams({ dataviews })
      } else {
        dispatchQueryParams({ dataviews: [...(urlDataviews || []), dataview] })
      }
    },
    [dispatchQueryParams, urlDataviews]
  )
  return { updateUrlDataview }
}
