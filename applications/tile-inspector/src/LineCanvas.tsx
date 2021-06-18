import { useCallback, useEffect, useRef } from 'react'
import { scaleLinear } from 'd3-scale'
import { quadtree } from 'd3-quadtree'
import { Cell } from './App'

const LineCanvas = ({
  data,
  width,
  height,
  domainX,
  domainY,
  onClick,
}: {
  data: Cell[]
  width: number
  height: number
  domainX: number[]
  domainY: number[]
  onClick: any
}) => {
  const canvasRef = useRef(null)
  const scaleXRef = useRef<any>()
  const scaleYRef = useRef<any>()
  const quadRef = useRef<any>()
  // const [scaleX, setScaleX] = useState<any>(null)
  // const [scaleY, setScaleY] = useState<any>(null)
  // const [tree, setTree] = useState<any>(null)
  useEffect(() => {
    const canvasObj = canvasRef.current
    if (!canvasObj) return
    const ctx = (canvasObj as HTMLCanvasElement).getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    const scaleX = scaleLinear().domain(domainX).range([0, width])
    const scaleY = scaleLinear().domain(domainY).range([0, height])
    // setScaleX(scaleX)
    // setScaleY(scaleY)
    scaleXRef.current = scaleX
    scaleYRef.current = scaleY
    const points: { x: number; y: number; cellNum: number }[] = []

    data.forEach((cell) => {
      const rdColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
      const rdColorAlpha = rdColor + '50'
      ctx.fillStyle = rdColor
      cell.timeseries.forEach((i) => {
        const x = scaleX(i.frame)
        const y = scaleY(i.value)
        ctx.fillRect(x - 2, y - 2, 4, 4)
        points.push({ x, y, cellNum: cell.cellNum })
      })
      ctx.beginPath()
      ctx.strokeStyle = rdColorAlpha
      ctx.moveTo(scaleX(cell.timeseries[0].frame), scaleY(cell.timeseries[0].value))
      cell.timeseries.forEach((i) => {
        ctx.lineTo(scaleX(i.frame), scaleY(i.value))
      })
      ctx.stroke()
      ctx.closePath()
    })
    const factory = quadtree(
      points as any,
      (d: any) => d.x,
      (d: any) => d.y
    )

    quadRef.current = factory
  }, [data, width, height, domainX, domainY])

  const handleCanvasClick = useCallback(
    (e) => {
      const rect = e.target.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const p = quadRef.current.find(x, y)
      if (p) {
        onClick(p)
      }
    },
    [onClick]
  )

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} onClick={handleCanvasClick} />
    </div>
  )
}

export default LineCanvas
