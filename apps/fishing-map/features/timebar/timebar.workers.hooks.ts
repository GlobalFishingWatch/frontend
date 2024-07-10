import { useEffect, useRef } from 'react'

export function useHeatmapGraphWorker() {
  const workerRef = useRef<Worker>()

  useEffect(() => {
    workerRef.current = new Worker(new URL('./timebar.workers.ts', import.meta.url))
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  return workerRef.current
}
