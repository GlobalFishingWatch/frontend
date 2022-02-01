import React, { Fragment, useState, useCallback, useRef } from 'react'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import GFWAPI from '@globalfishingwatch/api-client'
import { useSmallScreen } from 'hooks/screen.hooks'
import { formatUTCDate } from 'utils'
import { transformDownloadEvent } from 'utils/events'
import Filters from 'components/filters/filters.container'
import Search from 'components/search/search.container'
import Loader from 'components/loader/loader'
import { ReactComponent as IconMenu } from 'assets/icons/menu.svg'
import { ReactComponent as IconHome } from 'assets/icons/home.svg'
import { ReactComponent as IconLogo } from 'assets/images/gfw-carrier-vessels.svg'
import { ReactComponent as IconFilter } from 'assets/icons/filter.svg'
import { ReactComponent as IconClose } from 'assets/icons/close.svg'
import { ReactComponent as IconLink } from 'assets/icons/link.svg'
import { ReactComponent as IconDownload } from 'assets/icons/download.svg'
import { ReactComponent as IconQuestion } from 'assets/icons/question.svg'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import IconButton from 'components/icon-button/icon-button'
import {
  DOWNLOAD_NAME_PREFIX,
  DOWNLOAD_DATE_FORMAT,
  INFO_LINKS,
  DATA_DOWNLOAD_URL,
} from 'data/constants'
import { Event } from 'types/api/models'
import styles from './header.module.css'

interface HeaderProps {
  datasetId: string
  showMenu: (show: boolean) => void
  setSearchFields: typeof updateQueryParams
  hasVessel: boolean
  infoLinks: typeof INFO_LINKS
  hasDatasetError: boolean
  datasetLabel: string
  downloadUrl: string
}

type Drawer = 'filters' | 'download' | 'info'

const Header: React.FC<HeaderProps> = (props): React.ReactElement => {
  const {
    datasetId,
    hasVessel,
    showMenu,
    setSearchFields,
    infoLinks,
    datasetLabel,
    downloadUrl,
    hasDatasetError,
  } = props
  const [drawerOpen, setDrawerOpen] = useState<Drawer | null>(null)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const smallScreen = useSmallScreen()
  const CSVParser = useRef<any>(null)

  const handleDrawerOpenClick = useCallback((drawer: Drawer) => {
    setDrawerOpen(drawer)
  }, [])

  const handleDrawerCloseClick = useCallback(() => {
    setDrawerOpen(null)
  }, [])

  const handleDrawerToggleClick = useCallback(
    (drawer: Drawer) => {
      if (drawer === drawerOpen) {
        handleDrawerCloseClick()
      } else {
        handleDrawerOpenClick(drawer)
      }
    },
    [drawerOpen, handleDrawerCloseClick, handleDrawerOpenClick]
  )

  const trackAndDownloadClick = useCallback(() => {
    if ('download' !== drawerOpen) {
      uaEvent({
        category: 'CVP - General Actions',
        action: 'Open Download data',
      })
    }
    handleDrawerToggleClick('download')
  }, [drawerOpen, handleDrawerToggleClick])

  const trackDownloadDataset = useCallback(() => {
    uaEvent({
      category: 'CVP - General Actions',
      action: 'Download entire dataset',
    })
  }, [])

  const trackDownloadReadme = useCallback(() => {
    uaEvent({
      category: 'CVP - General Actions',
      action: 'Download README',
    })
  }, [])

  const onDownloadClick = useCallback(
    async (downloadUrl) => {
      setDownloadLoading(true)
      const date = formatUTCDate(Date.now(), DOWNLOAD_DATE_FORMAT)
      const fileName = `${DOWNLOAD_NAME_PREFIX}-${datasetLabel}-dataset-${date}.csv`
      try {
        if (!CSVParser.current) {
          const node = await import('json2csv')
          CSVParser.current = node
        }
        const data = await GFWAPI.fetch<Event[]>(downloadUrl).then((events) =>
          events.map(transformDownloadEvent)
        )
        const { parse, transforms } = CSVParser.current
        const csv = parse(data, {
          transforms: [transforms.flatten({ objects: true, arrays: true })],
        })

        const { saveAs } = await import('file-saver')
        saveAs(new Blob([csv], { type: 'text/plain;charset=utf-8' }), fileName)
      } catch (e) {
        console.warn(e)
      }
      uaEvent({
        category: 'CVP - General Actions',
        action: 'Download vessel dataset with current filters',
      })
      setDownloadLoading(false)
    },
    [datasetLabel]
  )

  const handleHomeClick = useCallback(() => {
    setSearchFields({ vessel: undefined, timestamp: undefined })
  }, [setSearchFields])

  return (
    <header className={styles.headerContainer}>
      <div
        className={cx(styles.headerBannerContainer, {
          [styles.expanded]: drawerOpen === 'filters',
        })}
      >
        {hasVessel ? (
          <IconButton
            className={styles.back}
            onClick={handleHomeClick}
            aria-label="Go to home"
            data-tip-pos="right"
          >
            <IconHome />
          </IconButton>
        ) : (
          <IconButton
            className={styles.menu}
            onClick={() => showMenu(true)}
            aria-label="Open menu"
            data-tip-pos="right"
          >
            <IconMenu />
          </IconButton>
        )}
        <div
          className={cx(styles.headerContent, {
            [styles.eventsDisabled]: hasDatasetError,
            [styles.headerContentCenter]: smallScreen,
          })}
        >
          <IconLogo className={styles.logoIcon} />
          {!smallScreen && <Search />}
        </div>
        <IconButton
          id={drawerOpen === 'filters' ? 'close-filters' : 'open-filters'}
          onClick={() => handleDrawerToggleClick('filters')}
          className={cx(styles.searchButton, { [styles.eventsDisabled]: hasDatasetError })}
          aria-label={drawerOpen === 'filters' ? 'Close filters' : 'Open filters'}
          data-tip-pos="left"
        >
          {drawerOpen === 'filters' ? <IconClose /> : <IconFilter className={styles.iconColor} />}
        </IconButton>
        {!smallScreen && (
          <IconButton
            id="download-data"
            onClick={() => trackAndDownloadClick()}
            className={cx(styles.download, { [styles.eventsDisabled]: hasDatasetError })}
            aria-label={drawerOpen === 'download' ? 'Close' : 'Download data'}
            data-tip-pos="left"
          >
            {drawerOpen === 'download' ? <IconClose /> : <IconDownload />}
          </IconButton>
        )}
        <IconButton
          id="get-more-info"
          onClick={() => handleDrawerToggleClick('info')}
          className={cx(styles.download, { [styles.eventsDisabled]: hasDatasetError })}
          aria-label={drawerOpen === 'info' ? 'Close' : 'Get more info'}
          data-tip-pos="left"
        >
          {drawerOpen === 'info' ? <IconClose /> : <IconQuestion />}
        </IconButton>
      </div>
      {drawerOpen === 'download' && (
        <Fragment>
          <div className={styles.downloadDrawer}>
            <a
              target="_blank"
              href={`${DATA_DOWNLOAD_URL}/datasets/${datasetId}`}
              rel="noopener noreferrer"
              className={styles.downloadLink}
              id="data-download-link"
              onClick={trackDownloadDataset}
            >
              Download entire dataset
              <IconLink className={styles.iconLink} />
            </a>
            <button
              className={cx(styles.downloadLink, {
                [styles.downloadLinkDisabled]: !downloadUrl || downloadLoading,
              })}
              id="download-data-filtered"
              onClick={() => onDownloadClick(downloadUrl)}
            >
              Download {datasetLabel} dataset with current filters
              <span className={styles.downloadSpinner}>
                {downloadLoading ? <Loader mini /> : <IconDownload />}
              </span>
            </button>
            <a
              target="_blank"
              href="download-readme.md"
              rel="noopener noreferrer"
              className={styles.downloadLink}
              id="download-data-readme"
              onClick={trackDownloadReadme}
            >
              README.md
              <IconDownload className={styles.iconColor} />
            </a>
          </div>
        </Fragment>
      )}
      {drawerOpen === 'info' && (
        <ul className={styles.downloadDrawer}>
          {infoLinks.map((infoLink) => (
            <a
              id={infoLink.id}
              target="_blank"
              key={infoLink.id}
              href={infoLink.link}
              rel="noopener noreferrer"
              className={styles.downloadLink}
            >
              {infoLink.label}
              <IconLink className={styles.iconLink} />
            </a>
          ))}
        </ul>
      )}
      {drawerOpen === 'filters' && (
        <Fragment>
          <div className={styles.filtersDrawer}>
            <Filters onActionClickCb={handleDrawerCloseClick} />
          </div>
          <div className="veil" onClick={handleDrawerCloseClick} />
        </Fragment>
      )}
    </header>
  )
}

export default Header
