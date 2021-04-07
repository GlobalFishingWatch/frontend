export default Events;
declare class Events extends Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    getFinalEvents: (this: any, events: any, showFishing: any) => import("d3-shape").Series<{
        [key: string]: number;
    }, string>[];
}
declare namespace Events {
    namespace propTypes {
        const events: any;
        const outerScale: any;
        const outerWidth: any;
        const graphHeight: any;
        const showFishing: any;
    }
    namespace defaultProps {
        const showFishing_1: boolean;
        export { showFishing_1 as showFishing };
    }
}
import { Component } from "react";
