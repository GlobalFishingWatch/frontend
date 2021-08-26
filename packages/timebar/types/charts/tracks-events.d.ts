export default TracksEvents;
declare function TracksEvents({ labels, tracksEvents, preselectedEventId, onEventClick, onEventHover }: {
    labels: any;
    tracksEvents: any;
    preselectedEventId: any;
    onEventClick: any;
    onEventHover: any;
}): JSX.Element;
declare namespace TracksEvents {
    namespace propTypes {
        const tracksEvents: any;
        const preselectedEventId: any;
        const onEventClick: any;
        const onEventHover: any;
        const labels: any;
    }
    namespace defaultProps {
        export function onEventClick_1(): void;
        export { onEventClick_1 as onEventClick };
        export function onEventHover_1(): void;
        export { onEventHover_1 as onEventHover };
        const preselectedEventId_1: any;
        export { preselectedEventId_1 as preselectedEventId };
        export namespace labels_1 {
            const events: string;
        }
        export { labels_1 as labels };
    }
}
