import { Popup } from '@globalfishingwatch/react-map-gl';
import React from 'react';

export default function HoverPopup({ hoveredEvent, layers }) {
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
          <span className="popupSectionColor" style={{backgroundColor: (layers[feature.generatorId]) ? layers[feature.generatorId].color : 'black' }}></span>
          {feature.generatorId} : {feature.value}
        </div>
      )}
    </div>
  </Popup>
  }
  return null
}