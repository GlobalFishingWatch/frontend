import React, { useMemo, useState } from 'react'
import ReactJson from 'react-json-view'
import {
  // BasemapGeneratorConfig,
  HeatmapAnimatedGeneratorConfig,
} from '@globalfishingwatch/layer-composer/src/generators/types'
import { useLayerComposer } from '@globalfishingwatch/react-hooks/src/index'

// const basemapGenerator = {
//   id: 'basemap',
//   type: 'BASEMAP',
//   basemap: 'basemap_default',
//   visible: true,
// } as BasemapGeneratorConfig

const heatmapGenerator = {
  id: 'mergedAnimatedHeatmap',
  type: 'HEATMAP_ANIMATED',
  sublayers: [
    {
      id: 'fishing-1',
      datasets: [
        'public-global-fishing-effort:v20201001',
        'public-chile-fishing-effort:v20200331',
        'public-indonesia-fishing-effort:v20200320',
        'public-panama-fishing-effort:v20200331',
        'public-peru-fishing-effort:v20200324',
      ],
      colorRamp: 'teal',
      visible: true,
      legend: {
        label: 'Apparent fishing effort',
        unit: 'hours',
        color: '#00FFBC',
      },
    },
  ],
  mode: 'compare',
  interval: ['hour', 'day', '10days'],
  visible: true,
  debug: false,
  debugLabels: false,
  staticStart: '2018-01-01T00:00:00.000Z',
  staticEnd: '2021-04-22T12:46:00.000Z',
} as HeatmapAnimatedGeneratorConfig

const generators = [heatmapGenerator]
const defaultConfig = {
  zoom: 1,
  start: '2019-01-01T00:00:00.000Z',
  end: '2020-01-01T00:00:00.000Z',
}

function App() {
  // Remember to use /src in hook to compile locally and avoid bundle waiting
  const [number, setNumber] = useState(0)
  const globalConfig = useMemo(() => ({ ...defaultConfig, zoom: number }), [number])
  const { style } = useLayerComposer(generators, globalConfig)

  return (
    <div className="App">
      <button onClick={() => setNumber((n) => n + 1)}>re-render ({number})</button>
      <main className="main">
        <ReactJson
          name="Mapbox gl style"
          src={style as any}
          indentWidth={2}
          collapsed={false}
          displayDataTypes={false}
        />
      </main>
    </div>
  )
}

export default App
