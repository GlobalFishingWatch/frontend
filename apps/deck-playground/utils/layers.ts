
import { VesselEventsLayer } from 'layers/vessel/VesselEventsLayer'
import { VesselTrackLayer } from 'layers/vessel/VesselTrackLayer'

type Layers = VesselEventsLayer | VesselTrackLayer

export function layersZIndexSort(layersArray: Layers[]): Layers[] {
    return layersArray.sort((a, b) => a.props?.layerZIndex && b.props?.layerZIndex ? a.props?.layerZIndex - b.props?.layerZIndex : 0)
}