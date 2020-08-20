import React from 'react'

interface CircleProps {
  color?: string
  className?: string
}

const Circle: React.FC<CircleProps> = ({ color = '#93C96C', className = '' }) => {
  return (
    <svg height="18" width="18" className={className}>
      <circle cx="9" cy="9" r="8" stroke={color} strokeWidth="2" fill="transparent" />
    </svg>
  )
}

export default Circle
