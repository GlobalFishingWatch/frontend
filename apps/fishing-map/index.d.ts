declare module '*.svg' {
  const content: any
  export const ReactComponent: any
  export default content
}

declare module '*.jpg' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const content: import('../dist/shared/lib/image-external').StaticImageData

  export default content
}

declare module '*.png' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const content: import('../dist/shared/lib/image-external').StaticImageData

  export default content
}
