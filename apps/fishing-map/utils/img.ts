export const handleOpenImage = (
  e: React.MouseEvent<HTMLAnchorElement>,
  {
    data,
    copyright,
    title,
    type,
  }: {
    data: string
    copyright?: string
    title?: string
    type: 'vessel' | 'detection'
  }
) => {
  e.preventDefault()

  const html = `<html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" data-next-head="">
        <style>
          body {
            font-family: Roboto, sans-serif;
            margin: 0;
            background-color: #1a1a1a;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          img {${
            type === 'detection'
              ? 'height: 100%; object-fit: contain; max-height: 400px;'
              : 'max-width: 100vw; max-height: 100vh;'
          }}
          .copyright {
            color: grey
          }
        </style>
      </head>
      <body>
        <img src="${data}" />
        ${copyright ? `<p class="copyright">${copyright}</p>` : ''}
      </body>
    </html>`

  const blob = new Blob([html], { type: 'text/html' })
  const blobUrl = URL.createObjectURL(blob)
  window.open(blobUrl, '_blank')
}
