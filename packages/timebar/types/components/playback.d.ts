export default Playback;
declare class Playback extends Component<any, any, any> {
    static contextType: any;
    constructor();
    lastUpdateMs: any;
    getStep: (this: any, start: any, end: any, speedStep: any) => number;
    update: (deltaMultiplicatorMs: any) => boolean;
    tick: (elapsedMs: any) => void;
    requestAnimationFrame: number;
    togglePlay: (force: any) => void;
    onPlayToggleClick: () => void;
    toggleLoop: () => void;
    onForwardClick: () => void;
    onBackwardClick: () => void;
    onSpeedClick: () => void;
}
declare namespace Playback {
    namespace propTypes {
        const labels: any;
        const onTick: any;
        const start: any;
        const end: any;
        const absoluteStart: any;
        const absoluteEnd: any;
        const onTogglePlay: any;
    }
    namespace defaultProps {
        export namespace labels_1 {
            const playAnimation: string;
            const pauseAnimation: string;
            const toogleAnimationLooping: string;
            const moveBack: string;
            const moveForward: string;
            const changeAnimationSpeed: string;
        }
        export { labels_1 as labels };
        export function onTogglePlay_1(): void;
        export { onTogglePlay_1 as onTogglePlay };
    }
}
import { Component } from "react";
