import { Fragment } from 'react'

export const getHighlightedText = (
  text: string,
  highlight: string,
  styles: {
    readonly [key: string]: string
  }
) => {
  if (highlight === '') return text
  const regEscape = (v: string) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const textChunks = text.split(new RegExp(regEscape(highlight), 'ig'))
  let sliceIdx = 0
  return textChunks.map((chunk, index) => {
    const currentSliceIdx = sliceIdx + chunk.length
    sliceIdx += chunk.length + highlight.length
    return (
      <Fragment key={index}>
        {chunk}
        {currentSliceIdx < text.length && (
          <span className={styles.highlighted}>{text.slice(currentSliceIdx, sliceIdx)}</span>
        )}
      </Fragment>
    )
  })
}
