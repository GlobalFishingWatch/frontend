import React, {useState, useRef, useEffect, useMemo} from 'react';
import MapGL from '@globalfishingwatch/react-map-gl';

const TEST_GEO_JSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        value: "some eez"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -12.65625,
              41.244772343082076
            ],
            [
              -3.69140625,
              41.11246878918088
            ],
            [
              -5.2734375,
              44.715513732021336
            ],
            [
              -7.03125,
              46.92025531537451
            ],
            [
              -10.8984375,
              45.706179285330855
            ],
            [
              -12.65625,
              41.244772343082076
            ]
          ]
        ]
      }
    }
  ]
}

const Map = React.memo(function Map({ style, onMapClick, onMapHover, onSetMapRef, children }) {
  const [viewport, setViewport] = useState({
    longitude: 13,
    latitude: -30,
    zoom: 1.58
  });

  const mapRef = useRef(null)

  useEffect(() => {
    if (onSetMapRef && mapRef.current) {
      onSetMapRef(mapRef.current.getMap())
    }
  }, [mapRef]);

  const customStyle = useMemo(() => {
    if (!style) return null
    return {
      ...style,
      sources: {
        ...style.sources,
        'test': {
          type: 'geojson',
          data: TEST_GEO_JSON,
          generateId: true,
        }
      },
      layers: [
        ...style.layers,
        {
          id: 'test',
          source: 'test',
          type: 'fill',
          paint: {
            'fill-color': 'rgba(0,0,0,0)',
            'fill-outline-color': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              '#ffffff',
              '#000000',
            ]
          }
        }
      ]
    }
  }, [style])

  const customInteractiveLayerIds = useMemo(() => {
    if (customStyle.metadata && customStyle.metadata.interactiveLayerIds) {
      return [...customStyle.metadata.interactiveLayerIds, 'test']
    }
    return null
  }, [customStyle])

  return <MapGL
    {...viewport}
    ref={mapRef}
    width="100%"
    height="100%"
    mapStyle={customStyle}
    onViewportChange={setViewport}
    onClick={onMapClick}
    onHover={onMapHover}
    interactiveLayerIds={customInteractiveLayerIds}
  >
    {children}
  </MapGL>
})

export default Map