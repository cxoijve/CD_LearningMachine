"use client"

import { useId } from "react"

interface PieChartProps {
  data: {
    name: string
    value: number
    color: string
  }[]
  width?: number
  height?: number
}

export default function PieChart({ data, width = 200, height = 200 }: PieChartProps) {
  const id = useId()
  let cumulativePercent = 0
  const total = data.reduce((sum, segment) => sum + segment.value, 0)

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {data.map((segment, i) => {
          const startAngle = 2 * Math.PI * cumulativePercent
          const percentValue = segment.value / total
          const endAngle = 2 * Math.PI * (cumulativePercent + percentValue)

          const x1 = Math.sin(startAngle) * (width / 2 - 20)
          const y1 = -Math.cos(startAngle) * (height / 2 - 20)
          const x2 = Math.sin(endAngle) * (width / 2 - 20)
          const y2 = -Math.cos(endAngle) * (height / 2 - 20)

          const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

          const pathData = [
            `M 0 0`,
            `L ${x1} ${y1}`,
            `A ${width / 2 - 20} ${height / 2 - 20} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`,
          ].join(" ")

          cumulativePercent += percentValue

          return <path key={`${id}-${i}`} d={pathData} fill={segment.color} stroke="#fff" strokeWidth="1" />
        })}
      </g>
    </svg>
  )
}
