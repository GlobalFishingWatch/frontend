export default TimeRangeSelector;
declare class TimeRangeSelector extends Component<any, any, any> {
    constructor(props: any);
    submit(start: any, end: any): void;
    setUnit(which: any, allBounds: any, unit: any, offset: any): void;
    last30days: () => void;
}
declare namespace TimeRangeSelector {
    namespace propTypes {
        const onSubmit: any;
        const start: any;
        const end: any;
        const absoluteStart: any;
        const absoluteEnd: any;
        const latestAvailableDataDate: any;
        const onDiscard: any;
        const labels: any;
    }
    namespace defaultProps {
        export namespace labels_1 {
            export const title: string;
            const start_1: string;
            export { start_1 as start };
            const end_1: string;
            export { end_1 as end };
            export const last30days: string;
            export const done: string;
            export const errorEarlyStart: string;
            export const errorLatestEnd: string;
            export const errorMinRange: string;
            export const errorMaxRange: string;
        }
        export { labels_1 as labels };
    }
}
import { Component } from "react";
