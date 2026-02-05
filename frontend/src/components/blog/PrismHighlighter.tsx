'use client'

import React, { useEffect } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-python'

export const PrismHighlighter: React.FC = () => {
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return null
}
