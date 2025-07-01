"use client"

interface DataPoint {
  x: number
  y: number
}

interface LineChartProps {
  data: DataPoint[][]
  width?: number
  height?: number
  colors?: string[]
}

export default function LineChart({ data, width = 200, height = 200, colors = ["#333", "#666"] }: LineChartProps) {
  // 데이터가 없으면 빈 SVG 반환
  if (!data || data.length === 0) {
    return <svg width={width} height={height}></svg>
  }

  // 각 라인의 포인트를 SVG 포인트 문자열로 변환
  const linePoints = data.map((line) => line.map((point) => `${point.x},${point.y}`).join(" "))

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(10, 10)`}>
        {linePoints.map((points, i) => (
          <polyline key={`line-${i}`} fill="none" stroke={colors[i % colors.length]} strokeWidth="2" points={points} />
        ))}
        <line x1="0" y1={height - 20} x2={width - 20} y2={height - 20} stroke="#999" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2={height - 20} stroke="#999" strokeWidth="1" />
      </g>
    </svg>
  )
}
