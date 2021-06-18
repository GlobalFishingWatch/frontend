export default Activity;
declare function Activity({ graphTracks, opacity, curve }: {
    graphTracks: any;
    opacity: any;
    curve: any;
}): JSX.Element;
declare namespace Activity {
    namespace propTypes {
        const graphTracks: any;
        const opacity: any;
        const curve: any;
    }
    namespace defaultProps {
        const opacity_1: number;
        export { opacity_1 as opacity };
        const curve_1: string;
        export { curve_1 as curve };
    }
}
