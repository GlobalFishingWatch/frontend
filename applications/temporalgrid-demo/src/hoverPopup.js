import { Popup } from '@globalfishingwatch/react-map-gl';
import React from 'react';

export default function HoverPopup({ hoveredEvent }) {
  if (hoveredEvent && hoveredEvent.features) {
    return <Popup
    latitude={hoveredEvent.latitude}
    longitude={hoveredEvent.longitude}
    closeButton={false}
    closeOnClick={false}
    anchor="top" >
    <div className="popup">
      {hoveredEvent.features.map((feature, i) => 
        <div key={i} className="popupSection">
          {Array.isArray(feature.value) ? feature.value.map(v => <div>{v}</div>) : feature.value}
        </div>
      )}
    </div>
  </Popup>
  }
  return null
}