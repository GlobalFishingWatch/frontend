export default Timebar;
declare class Timebar extends Component<any, any, any> {
    static getDerivedStateFromProps(props: any): {
        absoluteEnd: any;
    };
    constructor();
    toggleImmediate: (immediate: any) => void;
    interval: any;
    getMaximumRangeMs: (this: any, maximumRange: any, maximumRangeUnit: any) => any;
    getMinimumRangeMs: (this: any, minimumRange: any, minimumRangeUnit: any) => any;
    toggleTimeRangeSelector: () => void;
    setBookmark: () => void;
    setLocale: (this: any, locale: any) => any;
    onTimeRangeSelectorSubmit: (start: any, end: any) => void;
    zoom: (zoom: any) => void;
    notifyChange: (start: any, end: any, source: any, clampToEnd?: boolean) => void;
    onPlaybackTick: (newStart: any, newEnd: any) => void;
    onTogglePlay: (isPlaying: any) => void;
    maximumRangeMs: any;
    minimumRangeMs: any;
}
declare namespace Timebar {
    namespace propTypes {
        const labels: any;
        const start: any;
        const end: any;
        const onChange: any;
        const children: any;
        const bookmarkStart: any;
        const bookmarkEnd: any;
        const bookmarkPlacement: any;
        const onMouseLeave: any;
        const onMouseMove: any;
        const onBookmarkChange: any;
        const absoluteStart: any;
        const absoluteEnd: any;
        const latestAvailableDataDate: any;
        const enablePlayback: any;
        const onTogglePlay: any;
        const minimumRange: any;
        const minimumRangeUnit: any;
        const maximumRange: any;
        const maximumRangeUnit: any;
        const showLastUpdate: any;
        const locale: any;
    }
    namespace defaultProps {
        const latestAvailableDataDate_1: string;
        export { latestAvailableDataDate_1 as latestAvailableDataDate };
        export namespace labels_1 {
            namespace playback {
                const playAnimation: string;
                const pauseAnimation: string;
                const toogleAnimationLooping: string;
                const moveBack: string;
                const moveForward: string;
                const changeAnimationSpeed: string;
            }
            namespace timerange {
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
            namespace bookmark {
                const goToBookmark: string;
                const deleteBookmark: string;
            }
            const dragLabel: string;
            const lastUpdate: string;
            const setBookmark: string;
            const day: string;
            const year: string;
            const month: string;
            const hour: string;
            const zoomIn: string;
            const zoomTo: string;
            const zoomOut: string;
            const selectTimeRange: string;
        }
        export { labels_1 as labels };
        const bookmarkStart_1: any;
        export { bookmarkStart_1 as bookmarkStart };
        const bookmarkEnd_1: any;
        export { bookmarkEnd_1 as bookmarkEnd };
        const enablePlayback_1: boolean;
        export { enablePlayback_1 as enablePlayback };
        export function onTogglePlay_1(): void;
        export { onTogglePlay_1 as onTogglePlay };
        const children_1: any;
        export { children_1 as children };
        export function onMouseLeave_1(): void;
        export { onMouseLeave_1 as onMouseLeave };
        export function onMouseMove_1(): void;
        export { onMouseMove_1 as onMouseMove };
        const bookmarkPlacement_1: string;
        export { bookmarkPlacement_1 as bookmarkPlacement };
        export function onBookmarkChange_1(): void;
        export { onBookmarkChange_1 as onBookmarkChange };
        const minimumRange_1: any;
        export { minimumRange_1 as minimumRange };
        const minimumRangeUnit_1: string;
        export { minimumRangeUnit_1 as minimumRangeUnit };
        const maximumRange_1: any;
        export { maximumRange_1 as maximumRange };
        const maximumRangeUnit_1: string;
        export { maximumRangeUnit_1 as maximumRangeUnit };
        const showLastUpdate_1: boolean;
        export { showLastUpdate_1 as showLastUpdate };
        const locale_1: string;
        export { locale_1 as locale };
    }
}
import { Component } from "react";
