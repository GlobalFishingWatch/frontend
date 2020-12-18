import { useRef, useState } from 'react'
import { BBox } from '@turf/turf'
import InteractiveMap from '@globalfishingwatch/react-map-gl'
import oceanAreas, { getOceanAreaName, searchOceanAreas } from '@globalfishingwatch/ocean-areas'

export const OceanAreas = () => {
  const mapRef = useRef<any>(null)
  const [viewport, setViewport] = useState({
    longitude: -4,
    latitude: 40,
    zoom: 3.9,
  })

  const [query, setQuery] = useState('')
  const areasMatching = query ? searchOceanAreas(query) : []

  const fitBounds = (bounds?: BBox) => {
    if (!bounds) return
    if (mapRef.current && mapRef.current?.getMap) {
      mapRef.current.getMap().fitBounds([
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ])
    }
  }

  const style = {
    version: 8,
    sources: {
      test: {
        type: 'geojson',
        data: oceanAreas,
      },
    },
    layers: [
      {
        id: 'eez',
        source: 'test',
        type: 'fill',
        filter: ['==', ['get', 'type'], 'EEZ'],
        minzoom: 4,
        paint: {
          'fill-color': 'rgba(255,0,0,.5)',
          'fill-outline-color': 'white',
        },
      },
      {
        id: 'non-eez',
        source: 'test',
        type: 'fill',
        filter: ['!=', ['get', 'type'], 'EEZ'],
        paint: {
          'fill-color': 'rgba(0,0,255,.5)',
          'fill-outline-color': 'white',
        },
      },
    ],
  }

  const currentArea = getOceanAreaName({
    latitude: viewport.latitude,
    longitude: viewport.longitude,
    zoom: viewport.zoom,
  })

  return (
    <div className="map">
      <InteractiveMap
        ref={mapRef}
        width="100%"
        height="100%"
        mapStyle={style}
        onViewportChange={setViewport}
        mapOptions={{ hash: true }}
        {...viewport}
      ></InteractiveMap>
      <p>{currentArea}</p>
      <input
        type="text"
        name="area"
        id="areaFinder"
        placeholder="search ocean areas"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {areasMatching?.map((area, index) => (
        <button
          key={`${area.properties.name}-${index}`}
          style={{ display: 'block', cursor: 'pointer' }}
          onClick={() => fitBounds(area.properties.bounds)}
        >{`${area.properties.type} - ${area.properties.name}`}</button>
      ))}
    </div>
  )
}

export default OceanAreas
