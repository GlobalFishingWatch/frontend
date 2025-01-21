import React, { useCallback, useMemo } from 'react'
import Hotkeys from 'react-hot-keys'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import cx from 'classnames'
import { DateTime } from 'luxon'
import { fitBounds } from 'viewport-mercator-project'

import { filterSegmentsByTimerange, segmentsToBbox } from '@globalfishingwatch/data-transforms'
import type { SelectOption } from '@globalfishingwatch/ui-components';
import { Button, IconButton, Select } from '@globalfishingwatch/ui-components'

import brand from '../../assets/images/brand.png'
import { LABEL_HOTKEYS, SUPPORT_EMAIL, UNDO_HOTKEYS } from '../../data/constants'
import ErrorPlaceHolder from '../../features/error/ErrorPlaceholder'
import { useMapboxInstance } from '../../features/map/map.context'
import { useViewport } from '../../features/map/map.hooks'
import { getActionShortcuts } from '../../features/projects/projects.selectors'
import {
  disableHighlightedEvent,
  setHighlightedEvent,
  setHighlightedTime,
} from '../../features/timebar/timebar.slice'
import {
  getVesselInfo,
  getVesselTrackGeojsonByDateRange,
} from '../../features/tracks/tracks.selectors'
import { useUser } from '../../features/user/user.hooks'
import type { SelectedTrackType } from '../../features/vessels/selectedTracks.slice';
import { selectedtracks } from '../../features/vessels/selectedTracks.slice'
import { selectTimestamps } from '../../features/vessels/vessels.slice'
import { updateQueryParams } from '../../routes/routes.actions'
import { selectProject } from '../../routes/routes.selectors'
import { useAppDispatch } from '../../store.hooks'
import { ActionType } from '../../types'
import { findPreviousTimestamp, isFiniteBbox } from '../../utils/shared'

import { useSelectedTracksConnect } from './sidebar.hooks'

import styles from './Sidebar.module.css'

const Sidebar: React.FC = (props): React.ReactElement<any> => {
  const {
    uploadingTrack,
    dispatchUpdateActionSelectedTrack,
    dispatchDeleteSelectedTrack,
    dispatchDownloadSelectedTracks,
    dispatchUploadSelectedTracks,
    dispatchImportHandler,
    dispatchUndo,
    dispatchRedo,
  } = useSelectedTracksConnect()
  const segments = useSelector(selectedtracks)
  const project = useSelector(selectProject)
  const vessel = useSelector(getVesselInfo)
  const actionShortcuts = useSelector(getActionShortcuts)
  const dispatch = useAppDispatch()
  const track = useSelector(getVesselTrackGeojsonByDateRange)
  const { allowedAppAccess, allowedProjectAccess, projects, user, logged } = useUser()
  const formatedDate = (timestamp: number | null | undefined) => {
    if (timestamp) {
      const date = DateTime.fromMillis(timestamp, { zone: 'UTC' })
      return [date.toLocaleString(DateTime.DATETIME_MED), 'UTC'].join(' ')
    }

    return ''
  }

  const { setMapCoordinates } = useViewport()
  const mapInstance = useMapboxInstance()
  const onFitBoundsClick = useCallback(() => {
    if (track) {
      const bbox = track?.length ? segmentsToBbox(track) : undefined
      const { width, height } = mapInstance?._canvas || {}
      if (width && height && bbox && isFiniteBbox(bbox)) {
        const [minLng, minLat, maxLng, maxLat] = bbox
        const padding = 60
        const targetSize = [width - padding - padding, height - padding - padding]
        const { latitude, longitude, zoom } = fitBounds({
          bounds: [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          width,
          height,
          padding: {
            // Adjust padding to not exceed width and height
            top: targetSize[1] > 0 ? padding : targetSize[1] + padding,
            bottom: targetSize[1] > 0 ? padding : targetSize[1] + padding,
            left: targetSize[0] > 0 ? padding : targetSize[0] + padding,
            right: targetSize[0] > 0 ? padding : targetSize[0] + padding,
          },
        })
        setMapCoordinates({ latitude, longitude, zoom })
      } else {
        // TODO use prompt to ask user if wants to update the timerange to fit the track
        alert('The vessel has no activity in your selected timerange')
      }
    }
  }, [mapInstance, setMapCoordinates, track])

  const onFitSelectedSegmentBoundsClick = useCallback(
    (selection: SelectedTrackType) => {
      if (track && selection && selection.start && selection.end) {
        const trackFragment = filterSegmentsByTimerange(track, {
          start: selection.start as number,
          end: selection.end as number,
        })
        const bbox = track?.length ? segmentsToBbox(trackFragment) : undefined
        if (!trackFragment || !trackFragment.length) {
          setMapCoordinates({
            latitude: selection.startLatitude ?? 0,
            longitude: selection.startLongitude ?? 0,
            zoom: 11,
          })
          return
        }
        const { width, height } = mapInstance?._canvas || {}
        if (width && height && bbox && isFiniteBbox(bbox)) {
          const [minLng, minLat, maxLng, maxLat] = bbox
          const padding = 60
          const targetSize = [width - padding - padding, height - padding - padding]
          const { latitude, longitude, zoom } = fitBounds({
            bounds: [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            width,
            height,
            padding: {
              // Adjust padding to not exceed width and height
              top: targetSize[1] > 0 ? padding : targetSize[1] + padding,
              bottom: targetSize[1] > 0 ? padding : targetSize[1] + padding,
              left: targetSize[0] > 0 ? padding : targetSize[0] + padding,
              right: targetSize[0] > 0 ? padding : targetSize[0] + padding,
            },
          })
          setMapCoordinates({ latitude, longitude, zoom })
        }
      }
    },
    [mapInstance, setMapCoordinates, track]
  )
  const timestamps = useSelector(selectTimestamps)
  const onSegmentOver = useCallback(
    (selection: SelectedTrackType) => {
      if (selection && selection.start && selection.end) {
        const start = new Date(findPreviousTimestamp(timestamps, selection.start))
        const end = new Date(selection.end)
        dispatch(setHighlightedEvent({ start: start.toISOString(), end: end.toISOString() }))
        dispatch(setHighlightedTime({ start: start.toISOString(), end: end.toISOString() }))
      }
    },
    [dispatch, timestamps]
  )

  const onShortcutPress = useCallback(
    (keyName: string, e: KeyboardEvent, handle: any) => {
      if (keyName === 'control+z' || keyName === 'command+z') {
        dispatchUndo()
      }
      if (
        keyName === 'control+y' ||
        keyName === 'command+y' ||
        keyName === 'control+shift+z' ||
        keyName === 'command+shift+z'
      ) {
        dispatchRedo()
      }
    },
    [dispatchRedo, dispatchUndo]
  )

  const onLabelShortcutPress = useCallback(
    (keyName: string) => {
      const key = keyName.replace('shift+', '')
      if (actionShortcuts[key]) {
        segments.forEach((segment, index) => {
          if (!segment.action) {
            if (actionShortcuts[key] === ActionType.untracked) {
              dispatchDeleteSelectedTrack(index)
            } else {
              dispatchUpdateActionSelectedTrack(index, actionShortcuts[key])
            }
          }
        })
      }
    },
    [actionShortcuts, dispatchDeleteSelectedTrack, dispatchUpdateActionSelectedTrack, segments]
  )

  const trackActions = useMemo(
    () =>
      project?.labels.map((label) => ({ id: label.id, label: label.name, tooltip: label.name })) ||
      [],
    [project]
  )
  const projectOptions: SelectOption[] = useMemo(
    () =>
      projects?.map((p) => ({
        id: p.id,
        label: p.name ?? p.id,
        tooltp: p.name ?? p.id,
      })) || [],
    [projects]
  )
  const onSelectProject = useCallback(
    (option: SelectOption) => {
      dispatch(updateQueryParams({ project: option.id }))
    },
    [dispatch]
  )

  if (logged && !allowedAppAccess) {
    return (
      <ErrorPlaceHolder
        title={`Only some specific registered users can use this product  (logged in as: ${user?.email})`}
      >
        <div className={styles.errorAction}>
          <Button href={`mailto:${SUPPORT_EMAIL}?subject=Requesting access to track labeler tool`}>
            {'Request access'}
          </Button>{' '}
        </div>
        <div className={styles.errorAction}>
          or <Button href={'/logout'}>{'Logout'}</Button>
        </div>
      </ErrorPlaceHolder>
    )
  }
  if (!allowedProjectAccess) {
    return (
      <ErrorPlaceHolder title="This is a private project">
        {!!projects && projects.length > 0 && (
          <div className={styles.errorAction}>
            <Select
              options={projectOptions}
              onSelect={onSelectProject}
              onRemove={() => {}}
              placeholder={'Switch to other project'}
            />
          </div>
        )}
        <div className={styles.errorAction}>
          <Button
            href={`mailto:${SUPPORT_EMAIL}?subject=Requesting access for ${project?.name} project`}
          >
            {'Request access'}
          </Button>{' '}
          or <Button href={'/logout'}>{'Logout'}</Button>
        </div>
      </ErrorPlaceHolder>
    )
  }

  return (
    <div className={styles.aside}>
      <div className={styles.brand}>
        <img src={brand} alt="Logo" className={styles.logoImage} />
        <div className={styles.projectDetails}>
          <label>PROJECT</label>
          {project?.name}
        </div>

        <a href="/logout" className={styles.logoutButton}>
          <IconButton icon="logout" type="default" data-tip-pos="left" />
        </a>
      </div>
      {vessel && (
        <div className={styles.vesselContainer}>
          <div className={styles.vesselDetail}>
            <label>VESSEL</label>
            {vessel.shipname}
          </div>
          <div className={styles.vesselDetail}>
            <label>MMSI</label>
            {vessel.mmsi}
          </div>
          <div className={styles.vesselDetail}>
            <label>IMO</label>
            {vessel.imo}
          </div>
          <div className={styles.vesselDetail}>
            <label>CALLSIGN</label>
            {vessel.callsign}
          </div>
          <div className={styles.vesselDetail}>
            <IconButton
              icon="target"
              type="default"
              data-tip-pos="left"
              onClick={onFitBoundsClick}
            />
          </div>
        </div>
      )}
      <div className={styles.segments} data-testid="segments">
        {segments && segments.length > 0 && (
          <AutoSizer disableWidth={true}>
            {({ width, height }: any) => (
              <List
                width={width}
                height={height}
                itemCount={segments.length}
                itemData={segments}
                itemSize={() => 61}
              >
                {({ index, style }) => {
                  const segment = segments[index]
                  const selectedAction =
                    trackActions.filter((action) => action.id === segment.action).shift() ||
                    undefined
                  return (
                    <div
                      key={`segment-${index}`}
                      data-testid={`segment-${index}`}
                      style={style}
                      className={cx(styles.segment, !selectedAction && styles.segmentActivityEmpty)}
                      onMouseEnter={() => onSegmentOver(segment)}
                      onMouseLeave={() => {
                        dispatch(disableHighlightedEvent())
                      }}
                    >
                      <div className={cx(styles.segmentField, styles.segmentTimestamp)}>
                        <button
                          onClick={() => onFitSelectedSegmentBoundsClick(segment)}
                          className={styles.segmentButton}
                        >
                          {formatedDate(segment.start)}
                        </button>
                        <button
                          onClick={() => onFitSelectedSegmentBoundsClick(segment)}
                          className={styles.segmentButton}
                        >
                          {formatedDate(segment.end)}
                        </button>
                      </div>
                      <div className={cx(styles.segmentField, styles.segmentActivity)}>
                        <Select
                          className={styles.shortSelect}
                          options={trackActions}
                          selectedOption={selectedAction}
                          onRemove={() => {
                            dispatchUpdateActionSelectedTrack(index, '')
                            return
                          }}
                          onSelect={(selected: SelectOption) => {
                            dispatchUpdateActionSelectedTrack(index, selected.id as string)
                            return
                          }}
                        />
                      </div>
                      <div className={cx(styles.segmentField, styles.segmentAction)}>
                        <IconButton
                          icon="delete"
                          type="warning"
                          onClick={() => dispatchDeleteSelectedTrack(index)}
                        />
                      </div>
                    </div>
                  )
                }}
              </List>
            )}
          </AutoSizer>
        )}
      </div>
      <div className={styles.actionButtons}>
        <label className={styles.importButton}>
          <input
            id="file-upload"
            type="file"
            style={{ display: 'none' }}
            onChange={dispatchImportHandler}
          />
          Import
        </label>

        <Button
          type="secondary"
          className={styles.actionButton}
          onClick={() => dispatchDownloadSelectedTracks()}
        >
          Export
        </Button>
        <Button
          type="default"
          loading={uploadingTrack}
          className={styles.actionButton}
          onClick={() => dispatchUploadSelectedTracks()}
        >
          Save
        </Button>
        <Hotkeys keyName={UNDO_HOTKEYS} onKeyUp={onShortcutPress}></Hotkeys>
        <Hotkeys keyName={LABEL_HOTKEYS} onKeyUp={onLabelShortcutPress}></Hotkeys>
      </div>
    </div>
  )
}
export default Sidebar
