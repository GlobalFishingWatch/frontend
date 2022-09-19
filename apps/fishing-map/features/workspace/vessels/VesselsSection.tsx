import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { useTranslation, Trans } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.slice'
import styles from 'features/workspace/shared/Sections.module.css'
import { selectHasTracksWithNoData } from 'features/timebar/timebar.selectors'
import { isBasicSearchAllowed } from 'features/search/search.selectors'
import { selectUserLogged } from 'features/user/user.slice'
import LocalStorageLoginLink from 'routes/LoginLink'
import VesselEventsLegend from './VesselEventsLegend'
import VesselLayerPanel from './VesselLayerPanel'

function VesselsSection(): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const dataviews = useSelector(selectVesselsDataviews)
  const userLogged = useSelector(selectUserLogged)
  const hasVesselsWithNoTrack = useSelector(selectHasTracksWithNoData)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const searchAllowed = useSelector(isBasicSearchAllowed)

  const onSearchClick = useCallback(() => {
    uaEvent({
      category: 'Search Vessel',
      action: 'Click search icon to open search panel',
    })
    dispatchQueryParams({ query: '' })
  }, [dispatchQueryParams])

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.vessel_other', 'Vessels')}</h2>
        <IconButton
          icon="search"
          type="border"
          size="medium"
          disabled={!searchAllowed}
          tooltip={
            searchAllowed
              ? t('search.vessels', 'Search vessels')
              : t('search.notAllowed', 'Search not allowed')
          }
          tooltipPlacement="top"
          className="print-hidden"
          onClick={onSearchClick}
        />
      </div>
      <SortableContext items={dataviews}>
        {dataviews.length > 0 ? (
          dataviews?.map((dataview) => <VesselLayerPanel key={dataview.id} dataview={dataview} />)
        ) : (
          <div className={styles.emptyState}>
            {t(
              'workspace.emptyStateVessels',
              'The vessels selected in the search or by clicking on activity grid cells will appear here.'
            )}
          </div>
        )}
      </SortableContext>
      {hasVesselsWithNoTrack && !userLogged && (
        <p className={styles.disclaimer}>
          <Trans i18nKey="vessel.trackLogin">
            One of your selected sources requires you to
            <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink> to see
            vessel tracks and events
          </Trans>
        </p>
      )}
      <VesselEventsLegend dataviews={dataviews} />
    </div>
  )
}

export default VesselsSection
