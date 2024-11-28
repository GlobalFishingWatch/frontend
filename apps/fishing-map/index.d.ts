 
declare module '*.svg' {
  const content: any
  export const ReactComponent: any
  export default content
}

declare module '*.jpg' {
  const content: import('../dist/shared/lib/image-external').StaticImageData

  export default content
}

declare module '*.png' {
  const content: import('../dist/shared/lib/image-external').StaticImageData

  export default content
}
