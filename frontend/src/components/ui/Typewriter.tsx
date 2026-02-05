'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterProps {
  texts: string[]
  delay?: number
  period?: number
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  texts, 
  delay = 100, 
  period = 2000 
}) => {
  const [index, setIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    const handleType = () => {
      const currentText = texts[index % texts.length]
      const shouldDelete = isDeleting
      
      if (!shouldDelete) {
        setDisplayText(currentText.substring(0, displayText.length + 1))
        if (displayText === currentText) {
          timer = setTimeout(() => setIsDeleting(true), period)
        } else {
          timer = setTimeout(handleType, delay)
        }
      } else {
        setDisplayText(currentText.substring(0, displayText.length - 1))
        if (displayText === '') {
          setIsDeleting(false)
          setIndex(index + 1)
          timer = setTimeout(handleType, 500)
        } else {
          timer = setTimeout(handleType, delay / 2)
        }
      }
    }

    timer = setTimeout(handleType, delay)
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, index, texts, delay, period])

  return (
    <span className="relative">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        className="ml-1 inline-block w-[2px] h-[1em] bg-[#00f2ff] align-middle shadow-[0_0_8px_#00f2ff]"
      />
    </span>
  )
}
