export default Handler
declare function Handler(props: any): JSX.Element
declare namespace Handler {
  namespace propTypes {
    const onMouseDown: any
    const dragging: any
    const x: any
    const mouseX: any
  }
  namespace defaultProps {
    const mouseX_1: number
    export { mouseX_1 as mouseX }
  }
}
