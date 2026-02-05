'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      // Fetch user info with the new token
      fetch('http://localhost:8001/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch user')
          return res.json()
        })
        .then((userData) => {
          setAuth(userData, token)
          router.push('/')
        })
        .catch((err) => {
          console.error('Auth sync error:', err)
          router.push('/login?error=sync_failed')
        })
    } else {
      router.push('/login')
    }
  }, [searchParams, setAuth, router])

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="relative">
          <Loader2 className="w-12 h-12 text-[#00f2ff] animate-spin mx-auto" />
          <div className="absolute inset-0 blur-xl bg-[#00f2ff]/20 rounded-full" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-outfit)]">
            NEURAL SYNC IN PROGRESS
          </h2>
          <p className="text-[#94a3b8] italic">Establishing secure link with identity provider...</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  )
}
