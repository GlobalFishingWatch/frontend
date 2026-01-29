import dynamic from 'next/dynamic'

const dynamicWithRetry = (importFn: () => Promise<any>) =>
  dynamic(
    () =>
      importFn().catch((err: Error) => {
        // This catches both ChunkLoadError AND the SyntaxError from receiving HTML
        if (err instanceof SyntaxError || err.message.includes("Unexpected token '<'")) {
          console.warn('Detected HTML served as JS. Possible deployment update. Reloading...')
          window.location.reload()
        }
        throw err
      }),
    { ssr: false }
  )

export default dynamicWithRetry
