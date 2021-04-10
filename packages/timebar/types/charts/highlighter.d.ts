export default Highlighter;
declare function Highlighter({ hoverStart, hoverEnd, activity, unit }: {
    hoverStart: any;
    hoverEnd: any;
    activity: any;
    unit: any;
}): JSX.Element;
declare namespace Highlighter {
    namespace propTypes {
        const hoverStart: any;
        const hoverEnd: any;
        const activity: any;
        const unit: any;
        const tooltipContainer: any;
    }
    namespace defaultProps {
        const hoverStart_1: any;
        export { hoverStart_1 as hoverStart };
        const hoverEnd_1: any;
        export { hoverEnd_1 as hoverEnd };
        const activity_1: any;
        export { activity_1 as activity };
        const tooltipContainer_1: any;
        export { tooltipContainer_1 as tooltipContainer };
        const unit_1: string;
        export { unit_1 as unit };
    }
}
