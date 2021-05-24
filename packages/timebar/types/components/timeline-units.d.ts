export default TimelineUnits;
declare class TimelineUnits extends Component<any, any, any> {
    static contextType: any;
    constructor(props: any);
    constructor(props: any, context: any);
    zoomToUnit({ start, end }: {
        start: any;
        end: any;
    }): void;
}
declare namespace TimelineUnits {
    namespace propTypes {
        const labels: any;
        const onChange: any;
        const start: any;
        const end: any;
        const absoluteStart: any;
        const absoluteEnd: any;
        const outerStart: any;
        const outerEnd: any;
        const outerScale: any;
    }
    namespace defaultProps {
        export namespace labels_1 {
            const zoomTo: string;
            const day: string;
            const year: string;
            const month: string;
            const hour: string;
        }
        export { labels_1 as labels };
    }
}
import { Component } from "react";
