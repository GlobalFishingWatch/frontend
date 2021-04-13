export default VesselEvents;
declare class VesselEvents extends Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    getEvents: (this: any, events: any) => any;
    addHighlightInfo: (this: any, events: any, highlightedEventIDs: any, selectedEventID: any) => any[];
    filterEvents: (this: any, events: any, outerStart: any, outerEnd: any) => any;
    getBackgrounds: (this: any, events: any) => any;
    getLines: (this: any, events: any) => any;
    getOverlays: (this: any, events: any) => any[];
    renderTooltip(events: any): JSX.Element;
}
declare namespace VesselEvents {
    namespace propTypes {
        const events: any;
        const outerStart: any;
        const outerEnd: any;
        const selectedEventID: any;
        const highlightedEventIDs: any;
        const outerScale: any;
        const onEventHighlighted: any;
        const onEventClick: any;
        const outerWidth: any;
        const outerHeight: any;
        const graphHeight: any;
        const tooltipContainer: any;
    }
    namespace defaultProps {
        const selectedEventID_1: any;
        export { selectedEventID_1 as selectedEventID };
        const highlightedEventIDs_1: any;
        export { highlightedEventIDs_1 as highlightedEventIDs };
        export function onEventHighlighted_1(): void;
        export { onEventHighlighted_1 as onEventHighlighted };
        export function onEventClick_1(): void;
        export { onEventClick_1 as onEventClick };
        const tooltipContainer_1: any;
        export { tooltipContainer_1 as tooltipContainer };
    }
}
import { Component } from "react";
