import { Suspense } from 'react'
import BlogCard from '@/components/blog/BlogCard'
import { Search, SlidersHorizontal } from 'lucide-react'

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
    const res = await fetch('http://localhost:8000/api/v1/posts', {
      next: { revalidate: 3600 }, // Cache for 1 hour
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
      <div className="py-20 text-center">
        <p className="text-[#94a3b8] italic">No neural logs found in the archives.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-64 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
      ))}
    </div>
  )
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-32 pb-20 px-4 overflow-hidden relative">
      {/* Ambient background blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f2ff]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <header className="max-w-4xl mb-16 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[1px] bg-[#00f2ff]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#00f2ff]">
              Chronicles
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight font-[family-name:var(--font-outfit)]">
            NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#bc13fe]">ARCHIVES</span>
          </h1>
          <p className="text-[#94a3b8] text-lg max-w-2xl leading-relaxed italic">
            Exploring the frontiers of multi-agent systems, orchestration protocols, and the evolution of digital intelligence.
          </p>
        </header>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 py-6 border-y border-white/5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              placeholder="Query logs..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#00f2ff] outline-none transition-all placeholder:text-[#94a3b8]/50"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-[#94a3b8] hover:bg-white/10 transition-all">
              <SlidersHorizontal className="w-4 h-4" />
              FILTER DATA
            </button>
          </div>
        </div>

        <Suspense fallback={<BlogSkeleton />}>
          <BlogList />
        </Suspense>
      </div>
    </div>
  )
}
