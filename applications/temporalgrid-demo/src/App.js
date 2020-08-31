import 'babel-polyfill';
import React, {useState, useMemo, useRef, useCallback} from 'react';
import {render} from 'react-dom';
import MapGL from '@globalfishingwatch/react-map-gl';
import { DateTime } from 'luxon'
import { Generators } from '@globalfishingwatch/layer-composer';
import { useLayerComposer, useDebounce } from '@globalfishingwatch/react-hooks';
import TimebarComponent from '@globalfishingwatch/timebar';
import Tilesets from './Tilesets';

import './App.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

export const DEFAULT_TILESETS = [
  {
    // tileset: 'carriers_v8',
    tileset: 'fishing_v4',
    // filter: ''
    filter: "flag='ESP'",
    active: true
  },
  {
    tileset: 'fishing_v4',
    filter: "flag='FRA'",
    active: false
  },
  {
    tileset: 'fishing_v4',
    filter: "flag='ITA'",
    active: false
  },
  {
    tileset: 'fishing_v4',
    filter: "flag='GBR'",
    active: false
  },
  {
    tileset: 'fishing_v4',
    filter: "flag='PRT'",
    active: false
  }
]


export default function App() {
  const [viewport, setViewport] = useState({
    longitude: -6,
    latitude: 47,
    zoom: 4.6424032
  });

  const [time, setTime] = useState({
    start: '2012-10-01T00:00:00.000Z',
    end: '2012-11-01T00:00:00.000Z',
  })
  const debouncedTime = useDebounce(time, 1000)

  const [tilesets, setTilesets] = useState(DEFAULT_TILESETS)
  const [combinationMode, setCombinationMode] = useState('add')

  const [showBasemap, setShowBasemap] = useState(true)
  const [animated, setAnimated] = useState(true)
  const [debug, setDebug] = useState(true)
  const [debugLabels, setDebugLabels] = useState(true)
  const [geomTypeMode, setGeomTypeMode] = useState('gridded')

  const [showInfo, setShowInfo] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)

  const [isLoading, setLoading] = useState(false)

  const layers = useMemo(
    () => {
      const generators = [
        {id: 'background', type: Generators.Type.Background, color: '#00265c'}
      ]

      if (showBasemap) {
        generators.push({id: 'basemap', type: Generators.Type.Basemap, basemap: 'landmass' })
      }

      if (animated) {

        let geomType = geomTypeMode
        if (geomType === 'blobOnPlay') {
          geomType = (isPlaying) ? 'blob' : 'gridded'
        }
        const activeTilesets = tilesets.filter(t => t.active)
        const colorRamps = (activeTilesets.length === 1 || combinationMode === 'add')
          ? ['presence']
          : ['sky', 'magenta', 'yellow', 'salmon', 'green'].slice(0, activeTilesets.length)
        generators.push({
          id: 'heatmap-animated',
          type: Generators.Type.HeatmapAnimated,
          tilesets: activeTilesets.map(t => t.tileset),
          filters: activeTilesets.map(t => t.filter),
          debug,
          debugLabels,
          geomType,
          // tilesAPI: 'https://fourwings.api.dev.globalfishingwatch.org/v1'
          tilesAPI: ' https://fourwings-tile-server-jzzp2ui3wq-uc.a.run.app/v1/datasets',
          combinationMode,
          colorRamps,
        })
      } else {
        generators.push({
          id: 'heatmap',
          type: Generators.Type.Heatmap,
          tileset: tilesets.tileset[0],
          visible: true,
          geomType: 'gridded',
          serverSideFilter: undefined,
          // serverSideFilter: `vesselid IN ('ddef384a3-330b-0511-5c1d-6f8ed78de0ca')`,
          updateColorRampOnTimeChange: true,
          zoom: viewport.zoom,
          fetchStats: true
        })
      }

    return generators
  },
    [animated, viewport, showBasemap, debug, debugLabels, tilesets, geomTypeMode, isPlaying, combinationMode]
  );

  // TODO switch between debounced/immediate/throttled time when using animated
  const { style } = useLayerComposer(layers, (animated) ? time: debouncedTime)

  const mapRef = useRef(null)
  if (mapRef && mapRef.current) {
    mapRef.current.getMap().showTileBoundaries = debug
    mapRef.current.getMap().on('idle', () =>  {
      setLoading(false)
    })
    mapRef.current.getMap().on('dataloading', () =>  {
      setLoading(true)
    })
  }

  const onMapClick = useCallback((e) => {
    if (e.features && e.features.length) {
      console.log(e.features[0])
    }
  })

  return (
    <div className="container">
      {isLoading && <div className="loading">loading</div>}
      <div className="map">
        <MapGL
          {...viewport}
          ref={mapRef}
          width="100%"
          height="100%"
          mapStyle={style}
          onViewportChange={nextViewport => setViewport(nextViewport)}
          onClick={onMapClick}
          onData={() => { console.log('loafed') }}
        />
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
        >
          {/* TODO hack to shut up timebar warning, will need to fix in Timebar */}

        </TimebarComponent>
      </div>
      <div className="control-buttons">
        <Tilesets onChange={(tilesets, combinationMode) => { setTilesets(tilesets); setCombinationMode(combinationMode) }} />
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
