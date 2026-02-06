export const handleOpenImage = (e: React.MouseEvent<HTMLAnchorElement>, data: string) => {
  e.preventDefault()

  const html = `<html>
      <head>
        <title>Detection Image</title>
        <style>
          body { margin: 0; background-color: #1a1a1a; height: 100vh; display: flex; align-items: center; justify-content: center; }
          img {  height: 100%; object-fit: contain; image-rendering: pixelated; }
        </style>
      </head>
      <body>
        <img src="${data}" />
      </body>
    </html>`

  const blob = new Blob([html], { type: 'text/html' })
  const blobUrl = URL.createObjectURL(blob)
  window.open(blobUrl, '_blank')
}
