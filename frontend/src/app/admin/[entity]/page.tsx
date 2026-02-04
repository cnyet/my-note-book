'use client'

import { use, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function AdminEntityPage({ params }: { params: Promise<{ entity: string }> }) {
  const { entity } = use(params)
  
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin', entity],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/v1/${entity === 'agents' ? 'agents' : entity}`)
      return res.json()
    }
  })

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] tracking-tight text-white uppercase">{entity} MANAGEMENT</h2>
          <p className="text-sm text-[#94a3b8]">Configure platform subsystems and modules.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-[#00f2ff] text-[#0a0a0f] font-bold rounded-lg transition-all">
          <Plus className="w-4 h-4" /> NEW {entity.toUpperCase().slice(0, -1)}
        </button>
      </header>

      <div className="bg-[#11111a] rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">
            <tr>
              <th className="px-8 py-4">Name / ID</th>
              <th className="px-8 py-4">Status / Category</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {items.map((item: any) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6 font-bold text-white">{item.name || item.title}</td>
                <td className="px-8 py-6 text-[#94a3b8]">{item.category || item.status || 'N/A'}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-[#00f2ff]"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
