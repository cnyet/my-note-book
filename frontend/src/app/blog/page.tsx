import { Suspense } from 'react'
import BlogCard from '@/components/blog/BlogCard'
import { Search, SlidersHorizontal, Terminal, Activity } from 'lucide-react'

// Article Type Definition
interface Article {
  id: number
  title: string
  slug: string
  summary: string
  category: string
  created_at: string
  status: string
}

async function getPosts(): Promise<Article[]> {
  try {
    const res = await fetch('http://localhost:8001/api/v1/posts', {
      next: { revalidate: 3600 }, 
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

async function BlogList() {
  const posts = await getPosts()
  const publishedPosts = posts.filter(p => p.status === 'published')

  if (publishedPosts.length === 0) {
    return (
      <div className="py-40 text-center space-y-6 animate-reveal">
        <Terminal className="w-16 h-16 text-white/5 mx-auto" />
        <p className="text-[#94a3b8] text-lg font-light italic tracking-[0.3em] uppercase">
           Neural archives synchronized. <br /> 
           <span className="text-white/20">No matching logs found in this sector.</span>
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {publishedPosts.map((post, i) => (
        <BlogCard
          key={post.id}
          title={post.title}
          slug={post.slug}
          summary={post.summary}
          category={post.category}
          date={new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
          index={i}
        />
      ))}
    </div>
  )
}

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-96 glass-standard animate-pulse rounded-[3rem]" />
      ))}
    </div>
  )
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-40 pb-32 px-6 overflow-hidden relative selection:bg-[#bc13fe]/30">
      {/* Cinematic Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#bc13fe]/5 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <header className="max-w-4xl mb-32 space-y-10 animate-reveal">
          <div className="flex items-center gap-4">
            <Activity className="w-4 h-4 text-[#bc13fe]" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#bc13fe] glow-purple font-mono">
              Sector_9 // Neural Chronicles
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.8] font-outfit uppercase">
            Neural <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20 italic">Archives</span>
          </h1>
          <p className="text-[#94a3b8] text-2xl max-w-2xl leading-relaxed italic font-light">
             Exploring the multi-agent evolution, architectural breakthroughs, and the slow decay of digital intelligence.
          </p>
        </header>

        {/* Command Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-24 py-12 border-y border-white/5 relative group animate-reveal [animation-delay:200ms]">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#bc13fe] transition-colors" />
            <input
              placeholder="Query logs by neural signature..."
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-14 pr-6 py-6 text-sm text-white focus:bg-white/[0.06] focus:border-[#bc13fe]/40 outline-none transition-all placeholder:text-white/10 font-mono"
            />
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden sm:flex items-center gap-3">
               <div className="w-1 h-1 rounded-full bg-[#bc13fe] animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Archive Sync Status: Stable</span>
            </div>
            <button className="flex items-center gap-4 px-10 py-5 rounded-full glass-standard text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white/10 transition-all border-white/10">
              <SlidersHorizontal className="w-4 h-4 text-[#bc13fe]" />
              Filter Protocol
            </button>
          </div>
        </div>

        <div className="animate-reveal [animation-delay:400ms]">
          <Suspense fallback={<BlogSkeleton />}>
            <BlogList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
