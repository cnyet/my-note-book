'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  password: z.string().min(6),
  confirm_password: z.string().min(6),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          full_name: data.full_name,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Registration failed')
      }

      router.push('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white p-4">
      <div className="w-full max-w-md space-y-8 bg-[#11111a] p-8 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#bc13fe] font-[family-name:var(--font-outfit)]">
            NEW RECRUIT
          </h1>
          <p className="mt-2 text-sm text-[#94a3b8]">
            Initialize your Multi-Agent Identity
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Full Identity</label>
            <input
              {...register('full_name')}
              className="mt-1 block w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#bc13fe] focus:border-transparent outline-none transition-all"
              placeholder="Cypher Neo"
            />
            {errors.full_name && <p className="mt-1 text-xs text-red-400">{errors.full_name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Email Address</label>
            <input
              {...register('email')}
              className="mt-1 block w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#bc13fe] focus:border-transparent outline-none transition-all"
              placeholder="commander@workagents.ai"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Secure Pass-Key</label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 block w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#bc13fe] focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Confirm Pass-Key</label>
            <input
              type="password"
              {...register('confirm_password')}
              className="mt-1 block w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#bc13fe] focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
            {errors.confirm_password && <p className="mt-1 text-xs text-red-400">{errors.confirm_password.message}</p>}
          </div>

          {error && <div className="text-sm text-red-400 text-center bg-red-400/10 py-2 rounded-lg">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#bc13fe] text-white font-bold py-3 rounded-lg hover:bg-[#a30ee0] transition-colors shadow-[0_0_20px_rgba(188,19,254,0.3)] disabled:opacity-50"
          >
            {loading ? 'INITIALIZING...' : 'CREATE IDENTITY'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#11111a] px-2 text-[#94a3b8]">Or bypass with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:8000/api/v1/auth/github/login'}
              className="flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-xs font-bold"
            >
              GITHUB
            </button>
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:8000/api/v1/auth/google/login'}
              className="flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-xs font-bold"
            >
              GOOGLE
            </button>
          </div>

          <div className="text-center text-sm mt-4">
            <span className="text-[#94a3b8]">Already deployed? </span>
            <button
              onClick={() => router.push('/login')}
              className="text-[#00f2ff] hover:text-[#00d8e6] font-medium"
            >
              Resume Neural Link
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
