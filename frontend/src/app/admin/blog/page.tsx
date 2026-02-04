'use client'

import { useState, use } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import TiptapEditor from '@/components/admin/TiptapEditor'
import { toast } from 'sonner'

interface Post {
  id: number
  title: string
  slug: string
  status: string
  category: string
  created_at: string
}

export default function AdminBlogPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [currentPost, setCurrentPost] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/v1/posts')
      return res.json()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`http://localhost:8000/api/v1/posts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
      toast.success('Neural log deleted.')
    }
  })

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] tracking-tight text-white">BLOG MANAGEMENT</h2>
          <p className="text-sm text-[#94a3b8]">Curate and synthesize platform intelligence.</p>
        </div>
        <button 
          onClick={() => { setCurrentPost({ title: '', slug: '', content: '', status: 'draft', category: 'AI Agents' }); setIsEditing(true); }}
          className="flex items-center gap-2 px-6 py-2 bg-[#00f2ff] text-[#0a0a0f] font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" /> NEW ARCHIVE
        </button>
      </header>

      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 bg-[#11111a] p-8 rounded-3xl border border-white/5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Entry Title</label>
              <input 
                value={currentPost.title} 
                onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00f2ff]" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Neural Slug</label>
              <input 
                value={currentPost.slug} 
                onChange={(e) => setCurrentPost({...currentPost, slug: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00f2ff]" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Content Core</label>
            <TiptapEditor content={currentPost.content} onChange={(html) => setCurrentPost({...currentPost, content: html})} />
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-[#94a3b8] hover:text-white transition-colors">ABORT</button>
            <button className="px-8 py-2 bg-[#bc13fe] text-white font-bold rounded-lg hover:bg-[#a30ee0] transition-all">INITIALIZE SYNC</button>
          </div>
        </motion.div>
      ) : (
        <div className="bg-[#11111a] rounded-3xl border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">
              <tr>
                <th className="px-8 py-4">Title</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {posts.map((post: Post) => (
                <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6 font-bold text-white">{post.title}</td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${post.status === 'published' ? 'bg-[#00ffa3]/20 text-[#00ffa3]' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {post.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-[#94a3b8]">{post.category}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-[#00f2ff]"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteMutation.mutate(post.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
