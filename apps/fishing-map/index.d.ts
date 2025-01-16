declare module '*.svg' {
  import type { FC, SVGProps } from 'react'

  const content: FC<SVGProps<SVGElement>>
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

declare module '*.webp' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const content: import('../dist/shared/lib/image-external').StaticImageData

  export default content
}
