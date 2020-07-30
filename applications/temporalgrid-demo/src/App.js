import './App.css';
import React, {useState, useMemo, useRef, useCallback} from 'react';
import MapGL from 'react-map-gl';
import { DateTime } from 'luxon'
import { Generators } from '@globalfishingwatch/layer-composer';
import { useLayerComposer, useDebounce } from '@globalfishingwatch/react-hooks';
import TimebarComponent from '@globalfishingwatch/timebar';

// const DEFAULT_TILESET = 'carriers_v8'
const DEFAULT_TILESET = 'fishing_v3'

console.log('??')

function App() {
  const [viewport, setViewport] = useState({
    longitude: -17.3163661,
    latitude: 16.3762596,
    zoom: 4.6424032
  });

  const [time, setTime] = useState({
    start: '2012-10-01T00:00:00.000Z',
    end: '2012-11-01T00:00:00.000Z',
  })
  const debouncedTime = useDebounce(time, 1000)

  const [tileset, setTileset] = useState(DEFAULT_TILESET)
  const [currentTileset, setCurrentTileset] = useState(DEFAULT_TILESET)

  const [showBasemap, setShowBasemap] = useState(true)
  const [animated, setAnimated] = useState(true)
  const [debug, setDebug] = useState(true)
  const [debugLabels, setDebugLabels] = useState(true)
  const [geomTypeMode, setGeomTypeMode] = useState('gridded')
  
  const [showInfo, setShowInfo] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)
  
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
        generators.push({
          id: 'heatmap-animated',
          type: Generators.Type.HeatmapAnimated,
          tileset,
          debug,
          debugLabels,
          geomType,
          // tilesAPI: 'https://fourwings.api.dev.globalfishingwatch.org/v1'
        })
      } else {
        generators.push({
          id: 'heatmap',
          type: Generators.Type.Heatmap,
          tileset,
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
    [viewport, showBasemap, debug, debugLabels, tileset, geomTypeMode, isPlaying]
  );

  // TODO switch between debounced/immediate/throttled time when using animated
  const { style } = useLayerComposer(layers, (animated) ? time: debouncedTime)

  const mapRef = useRef(null)
  if (mapRef && mapRef.current) {
    mapRef.current.getMap().showTileBoundaries = debug
  }

  const onMapClick = useCallback((e) => {
    if (e.features && e.features.length) {
      console.log(e.features[0])
    }
  })

  return (
    <div className="container">
      <div className="map">
        <MapGL
          {...viewport}
          ref={mapRef}
          width="100%"
          height="100%"
          mapStyle={style}
          onViewportChange={nextViewport => setViewport(nextViewport)}
          onClick={onMapClick}
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
        <fieldset>
          <input type="text" value={currentTileset} onChange={(event) => setCurrentTileset(event.target.value)} />
          <button onClick={() => setTileset(currentTileset)}>ok</button>
        </fieldset>
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

export default App;
