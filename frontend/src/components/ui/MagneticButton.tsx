'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { useMagnetic } from '@/hooks/useMagnetic'

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  className?: string
  strength?: number
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = '', 
  strength = 0.5,
  ...props 
}) => {
  const { ref, x, y } = useMagnetic<HTMLButtonElement>(strength)

  return (
    <motion.button
      ref={ref}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}
