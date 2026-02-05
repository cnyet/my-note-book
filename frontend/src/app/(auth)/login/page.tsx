'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const formData = new URLSearchParams()
      formData.append('username', data.email)
      formData.append('password', data.password)

      const response = await fetch('http://localhost:8001/api/v1/auth/login', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const { access_token } = await response.json()

      // Fetch user info
      const userRes = await fetch('http://localhost:8001/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })

      if (!userRes.ok) {
        throw new Error('Failed to fetch user info')
      }

      const userData = await userRes.json()
      setAuth(userData, access_token)
      router.push('/')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white p-4">
      <div className="w-full max-w-md space-y-8 bg-[#11111a] p-8 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#00f2ff] font-[family-name:var(--font-outfit)]">
            NEURAL LOGIN
          </h1>
          <p className="mt-2 text-sm text-[#94a3b8]">
            Access the Multi-Agent Orchestration Hub
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Email Address</label>
              <input
                {...register('email')}
                className="mt-1 block w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#00f2ff] focus:border-transparent outline-none transition-all"
                placeholder="commander@workagents.ai"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Pass-Key</label>
              <input
                type="password"
                {...register('password')}
                className="mt-1 block w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#00f2ff] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>
          </div>

          {error && <div className="text-sm text-red-400 text-center bg-red-400/10 py-2 rounded-lg">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00f2ff] text-[#0a0a0f] font-bold py-3 rounded-lg hover:bg-[#00d8e6] transition-colors shadow-[0_0_20px_rgba(0,242,255,0.3)] disabled:opacity-50"
          >
            {loading ? 'SYNCING...' : 'ESTABLISH LINK'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#11111a] px-2 text-[#94a3b8]">Or bypass with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:8001/api/v1/auth/github/login'}
              className="flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-xs font-bold"
            >
              GITHUB
            </button>
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:8001/api/v1/auth/google/login'}
              className="flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-xs font-bold"
            >
              GOOGLE
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-[#94a3b8]">New recruit? </span>
            <button
              onClick={() => router.push('/register')}
              className="text-[#bc13fe] hover:text-[#a30ee0] font-medium"
            >
              Initialize Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
