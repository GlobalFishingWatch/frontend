export default StackedActivity;
declare function StackedActivity({ data, colors, numSublayers }: {
    data: any;
    colors: any;
    numSublayers: any;
}): JSX.Element;
declare namespace StackedActivity {
    namespace propTypes {
        const data: any;
        const colors: any;
        const numSublayers: any;
    }
    namespace defaultProps {
        const data_1: any[];
        export { data_1 as data };
        const colors_1: any[];
        export { colors_1 as colors };
        const numSublayers_1: number;
        export { numSublayers_1 as numSublayers };
    }
}
