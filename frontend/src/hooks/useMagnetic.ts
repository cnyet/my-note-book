'use client'

import { useRef, useState, useEffect } from 'react'

export const useMagnetic = <T extends HTMLElement>(strength: number = 0.5) => {
  const ref = useRef<T>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const { left, top, width, height } = ref.current.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2
      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY

      const maxDistance = 100
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

      if (distance < maxDistance) {
        setPosition({
          x: distanceX * strength,
          y: distanceY * strength
        })
      } else {
        setPosition({ x: 0, y: 0 })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [strength])

  return { ref, x: position.x, y: position.y }
}
