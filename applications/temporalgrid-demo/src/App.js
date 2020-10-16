/* eslint max-statements: 0 */
import React, {useState, useMemo, useCallback} from 'react';
import {render} from 'react-dom';
import { DateTime } from 'luxon'
import { Generators } from '@globalfishingwatch/layer-composer';
import { useLayerComposer, useDebounce, useMapClick, useMapHover } from '@globalfishingwatch/react-hooks';
import TimebarComponent from '@globalfishingwatch/timebar';
import Tilesets from './tilesets';
import Map from './map';

import './App.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

export const DEFAULT_SUBLAYERS = [
  {
    id: 0,
    // tileset: 'carriers_v8',
    datasets: 'fishing_v4',
    // filter: ''
    filter: "flag='ESP'",
    active: true
  },
  {
    id: 1,
    datasets: 'fishing_v4',
    filter: "flag='FRA'",
    active: false
  },
  {
    id: 2,
    datasets: 'fishing_v4',
    filter: "flag='ITA'",
    active: false
  },
  {
    id: 3,
    datasets: 'fishing_v4',
    filter: "flag='GBR'",
    active: false
  },
  {
    id: 4,
    datasets: 'fishing_v4',
    filter: "flag='PRT'",
    active: false
  }
]

const DATAVIEWS = [
  {id: 'background', type: Generators.Type.Background, color: '#00265c'},
  {id: 'basemap', type: Generators.Type.Basemap },
  {
    id: 'eez',
    type: Generators.Type.CartoPolygons,
    color: 'red'
  },
  {
    id: 0,
    type: Generators.Type.HeatmapAnimated,
    colorRamp: 'teal',
    color: '#00FFBC',
    unit: 'fishing hours'
  },
  {
    id: 1,
    title: 'that second thing',
    type: Generators.Type.HeatmapAnimated,
    colorRamp: 'magenta',
    color: '#FF64CE',
    unit: 'fishing hours'
  },
  {
    id: 2,
    type: Generators.Type.HeatmapAnimated,
    colorRamp: 'yellow',
    color: '#FFEA00',
    unit: 'fishing hours'
  },
  {
    id: 3,
    type: Generators.Type.HeatmapAnimated,
    colorRamp: 'salmon',
    color: '#FFAE9B',
    unit: 'fishing hours'
  },
  {
    id: 4,
    type: Generators.Type.HeatmapAnimated,
    colorRamp: 'green',
    color: '#A6FF59',
    unit: 'fishing hours'
  }
]

export default function App() {
  const [time, setTime] = useState({
    start: '2012-10-01T00:00:00.000Z',
    end: '2012-11-01T00:00:00.000Z',
  })
  const debouncedTime = useDebounce(time, 1000)

  const [sublayers, setSublayers] = useState(DEFAULT_SUBLAYERS)
  const [combinationMode, setCombinationMode] = useState('add')

  const [showBasemap, setShowBasemap] = useState(true)
  const [animated, setAnimated] = useState(true)
  const [debug, setDebug] = useState(false)
  const [debugLabels, setDebugLabels] = useState(false)
  const [geomTypeMode, setGeomTypeMode] = useState('gridded')

  const [showInfo, setShowInfo] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)

  const [isLoading, setLoading] = useState(false)

  const layers = useMemo(
    () => {
      const generators = [{...DATAVIEWS.find(dv => dv.id === 'background')}, {...DATAVIEWS.find(dv => dv.id === 'eez')}]

      if (showBasemap) {
        generators.push({...DATAVIEWS.find(dv => dv.id === 'basemap')})
      }

      if (animated) {
        const heatmapSublayers = sublayers.filter(t => t.active).map((sublayer) => {
          const heatmapSublayer = {...DATAVIEWS.find(dv => dv.id === sublayer.id)}
          let colorRamp = heatmapSublayer.colorRamp
          if (sublayers.filter(t => t.active).length === 1) {
            colorRamp = 'presence'
          } else if (combinationMode === 'bivariate') {
            colorRamp = 'bivariate'
          }
          return {
            id: sublayer.id,
            colorRamp,
            // TODO API should support an array of tilesets for each sublayer
            datasets: sublayer.datasets.split(','),
            filter: sublayer.filter,
          }
        })

        let geomType = geomTypeMode
        if (geomType === 'blobOnPlay') {
          geomType = (isPlaying) ? 'blob' : 'gridded'
        }

        generators.push({
          id: 'heatmap-animated',
          type: Generators.Type.HeatmapAnimated,
          sublayers: heatmapSublayers,
          combinationMode,
          debug,
          debugLabels,
          geomType,
          // tilesAPI: 'https://fourwings.api.dev.globalfishingwatch.org/v1'
          // tilesAPI: ' https://fourwings-tile-server-jzzp2ui3wq-uc.a.run.app/v1/datasets',
          tilesAPI: ' https://fourwings-tile-server-jzzp2ui3wq-uc.a.run.app/v1',
          interactive: true,
        })
      } else {
        generators.push({
          id: 'heatmap',
          type: Generators.Type.Heatmap,
          tileset: sublayers.datasets[0][0],
          visible: true,
          geomType: 'gridded',
          serverSideFilter: undefined,
          // serverSideFilter: `vesselid IN ('ddef384a3-330b-0511-5c1d-6f8ed78de0ca')`,
          // zoom: viewport.zoom,
          fetchStats: true
        })
      }
    return generators
  },
    [animated, showBasemap, debug, debugLabels, sublayers, geomTypeMode, isPlaying, combinationMode]
  );

  const [mapRef, setMapRef] = useState(null)

  const clickCallback = useCallback((event) => {
    console.log(event)
  }, [])
  const hoverCallback = useCallback((event) => {
    console.log(event)
  }, [])

  // TODO useMapInteraction has been removed
  // const { onMapClick, onMapHover } = useMapInteraction(clickCallback, hoverCallback, mapRef)
  const onMapClick = useMapClick(clickCallback)
  const onMapHover = useMapHover(null, hoverCallback, mapRef)

  const globalConfig = useMemo(() => {
    const finalTime = (animated) ? time: debouncedTime
    return { ...finalTime }
  }, [animated, time, debouncedTime])

  const { style } = useLayerComposer(layers, globalConfig)

  if (mapRef) {
    mapRef.showTileBoundaries = debug
    mapRef.on('idle', () =>  {
      setLoading(false)
    })
    mapRef.on('dataloading', () =>  {
      setLoading(true)
    })
  }

  return (
    <div className="container">
      {isLoading && <div className="loading">loading</div>}
      <div className="map">
        {style && <Map style={style} onMapClick={onMapClick} onMapHover={onMapHover} onSetMapRef={setMapRef} />}
      </div>
      <div className="timebar">
        <TimebarComponent
          start={time.start}
          end={time.end}
          absoluteStart={'2012-01-01T00:00:00.000Z'}
          absoluteEnd={'2020-01-01T00:00:00.000Z'}
          onChange={(start, end) => {
            setTime({start,end})
          }}
          enablePlayback
          onTogglePlay={setIsPlaying}
        />
      </div>
      <div className="control-buttons">
        <Tilesets onChange={(newTilesets, newCombinationMode) => { setSublayers(newTilesets); setCombinationMode(newCombinationMode) }} />
        <hr />
        <fieldset>
          <input type="checkbox" id="showBasemap" checked={showBasemap} onChange={(e) => {
            setShowBasemap(e.target.checked)
          }} />
          <label htmlFor="showBasemap">basemap</label>
        </fieldset>
        <fieldset>
          <input type="checkbox" id="animated" checked={animated} onChange={(e) => {
            setAnimated(e.target.checked)
          }} />
          <label htmlFor="animated">animated</label>
        </fieldset>
        <fieldset>
          <input type="checkbox" id="debug" checked={debug} onChange={(e) => {
            setDebug(e.target.checked)
          }} />
          <label htmlFor="debug">debug</label>
        </fieldset>
        <fieldset>
          <input type="checkbox" id="debugLabels" checked={debugLabels} onChange={(e) => {
            setDebugLabels(e.target.checked)
          }} />
          <label htmlFor="debugLabels">debugLabels</label>
        </fieldset>

        <fieldset>
          <select id="geom" onChange={(event) => { setGeomTypeMode(event.target.value)}}>
            <option value="gridded">geom:gridded</option>
            <option value="blob">geom:blob</option>
            <option value="blobOnPlay">geom:blob on play</option>
          </select>
        </fieldset>
        <hr />

        <div className="info">
          <div>{DateTime.fromISO(time.start).toUTC().toLocaleString(DateTime.DATETIME_MED)} ↦ {DateTime.fromISO(time.end).toUTC().toLocaleString(DateTime.DATETIME_MED)}</div>
          <button onClick={() => setShowInfo(!showInfo)}>more info ▾</button>
        </div>
        {showInfo && <div>
          <div><b>Active time chunks:</b></div>
          {style && style.metadata && style.metadata.layers['heatmap-animated'] && <pre>{JSON.stringify(style.metadata.layers['heatmap-animated'].timeChunks, null, 2)}</pre>}
        </div>}
      </div>
    </div>
  );
}

export function renderToDom(container) {
  render(<App />, container);
}
