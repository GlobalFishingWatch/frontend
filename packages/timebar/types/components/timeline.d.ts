export const TimelineContext: any;
export default Timeline;
declare class Timeline extends PureComponent<any, any, any> {
    static contextType: any;
    constructor();
    getOuterScale: (this: any, outerStart: any, outerEnd: any, outerWidth: any) => import("d3-scale").ScaleTime<number, number, never>;
    getOverallScale: (this: any, absoluteStart: any, absoluteEnd: any, innerWidth: any) => import("d3-scale").ScaleTime<number, number, never>;
    getSvgTransform: (this: any, overallScale: any, start: any, end: any, innerWidth: any, innerStartPx: any) => string;
    graphContainer: HTMLDivElement;
    requestAnimationFrame: number;
    resizeObserver: ResizeObserver;
    onWindowResize: () => void;
    isHandlerZoomInValid(x: any): {
        isZoomIn: boolean;
        isValid: boolean;
        clampedX: number;
    };
    isHandlerZoomOutValid(x: any): boolean;
    onEnterFrame: (timestamp: any) => void;
    frameTimestamp: any;
    onMouseDown: (event: any, dragging: any) => void;
    lastX: any;
    throttledMouseMove: import("lodash").DebouncedFunc<(clientX: any, scale: any, isDay: any) => void>;
    notifyMouseLeave: () => void;
    onMouseMove: (event: any) => void;
    onMouseUp: (event: any) => void;
    onLast30DaysClick(): void;
    innerScale: import("d3-scale").ScaleTime<number, number, never>;
    outerScale: import("d3-scale").ScaleTime<number, number, never>;
    node: HTMLDivElement;
    tooltipContainer: HTMLDivElement;
}
declare namespace Timeline {
    namespace propTypes {
        const labels: any;
        const onChange: any;
        const onMouseLeave: any;
        const onMouseMove: any;
        const children: any;
        const start: any;
        const end: any;
        const absoluteStart: any;
        const absoluteEnd: any;
        const latestAvailableDataDate: any;
        const onBookmarkChange: any;
        const bookmarkStart: any;
        const bookmarkEnd: any;
        const bookmarkPlacement: any;
        const showLastUpdate: any;
    }
    namespace defaultProps {
        export namespace labels_1 {
            const dragLabel: string;
            const lastUpdate: string;
            namespace bookmark {
                const goToBookmark: string;
                const deleteBookmark: string;
            }
        }
        export { labels_1 as labels };
        const bookmarkStart_1: any;
        export { bookmarkStart_1 as bookmarkStart };
        const bookmarkEnd_1: any;
        export { bookmarkEnd_1 as bookmarkEnd };
        const bookmarkPlacement_1: string;
        export { bookmarkPlacement_1 as bookmarkPlacement };
        const children_1: any;
        export { children_1 as children };
        export function onBookmarkChange_1(): void;
        export { onBookmarkChange_1 as onBookmarkChange };
        export function onMouseLeave_1(): void;
        export { onMouseLeave_1 as onMouseLeave };
        export function onMouseMove_1(): void;
        export { onMouseMove_1 as onMouseMove };
        const showLastUpdate_1: boolean;
        export { showLastUpdate_1 as showLastUpdate };
    }
}
import { PureComponent } from "react";
import ResizeObserver from "resize-observer-polyfill";
