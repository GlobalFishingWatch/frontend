import { useEffect, useRef, useState } from 'react'
import { BBox } from '@turf/turf'
import { InteractiveMap } from 'react-map-gl'
import { getOceanAreaName, OceanArea, searchOceanAreas } from '@globalfishingwatch/ocean-areas'
// In projects we could use '@globalfishingwatch/ocean-areas/dist/data' but doesn't work in the sandbox
import oceanAreas from 'data/ocean-areas'

export const OceanAreas = () => {
  const mapRef = useRef<any>(null)
  const [viewport, setViewport] = useState({
    longitude: -15,
    latitude: 28,
    zoom: 4,
  })

  const [query, setQuery] = useState('')
  const [currentArea, setCurrentArea] = useState<string | undefined>()
  const [areasMatching, setAreasMatching] = useState<OceanArea[] | undefined>()

  useEffect(() => {
    if (query) {
      const areas = searchOceanAreas(query)
      setAreasMatching(areas)
    } else {
      setAreasMatching([])
    }
  }, [query])

  useEffect(() => {
    const name = getOceanAreaName({
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: viewport.zoom,
    })
    setCurrentArea(name)
  }, [viewport])

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

  return (
    <div className="map">
      <InteractiveMap
        ref={mapRef}
        width="100%"
        height="100%"
        mapStyle={style}
        onViewportChange={setViewport}
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
