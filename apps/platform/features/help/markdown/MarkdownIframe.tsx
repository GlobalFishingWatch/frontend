type MarkdownIframeProps = React.IframeHTMLAttributes<HTMLIFrameElement>

const MarkdownIframe = ({ ...props }: MarkdownIframeProps) => {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
      <iframe {...props} title={props.title} />
    </div>
  )
}

export default MarkdownIframe
