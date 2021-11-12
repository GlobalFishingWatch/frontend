export default Handler;
declare function Handler(props: any): JSX.Element;
declare namespace Handler {
    namespace propTypes {
        const dragLabel: any;
        const onMouseDown: any;
        const dragging: any;
        const x: any;
        const mouseX: any;
    }
    namespace defaultProps {
        const dragLabel_1: string;
        export { dragLabel_1 as dragLabel };
        const mouseX_1: number;
        export { mouseX_1 as mouseX };
    }
}
