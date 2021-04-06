export default Bookmark
declare function Bookmark({
  placement,
  scale,
  bookmarkStart,
  bookmarkEnd,
  minX,
  maxX,
  onSelect,
  onDelete,
}: {
  placement: any
  scale: any
  bookmarkStart: any
  bookmarkEnd: any
  minX: any
  maxX: any
  onSelect: any
  onDelete: any
}): JSX.Element
declare namespace Bookmark {
  namespace propTypes {
    const placement: any
    const bookmarkStart: any
    const bookmarkEnd: any
    const scale: any
    const minX: any
    const maxX: any
    const onSelect: any
    const onDelete: any
  }
  namespace defaultProps {
    const placement_1: string
    export { placement_1 as placement }
  }
}
