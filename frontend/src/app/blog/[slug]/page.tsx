import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from 'lucide-react'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { PrismHighlighter } from '@/components/blog/PrismHighlighter'

interface Article {
  id: number
  title: string
  slug: string
  content: string
  summary: string
  category: string
  created_at: string
}

async function getPost(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`http://localhost:8001/api/v1/posts/${slug}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return null
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] pt-40 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Neural Link Severed</h1>
        <p className="text-[#94a3b8] mb-8">The requested log could not be retrieved from the archives.</p>
        <Link href="/blog" className="text-[#00f2ff] hover:underline font-bold">Return to Hub</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#94a3b8] hover:text-[#00f2ff] transition-all mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          RETURN TO ARCHIVES
        </Link>

        <article className="relative bg-[#11111a]/40 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-2xl">
          <TableOfContents content={post.content} />
          <PrismHighlighter />
          
          {/* Header */}
          <header className="p-8 md:p-12 border-b border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bc13fe] px-2 py-1 rounded bg-[#bc13fe]/10 border border-[#bc13fe]/20">
                {post.category}
              </span>
              <div className="flex items-center gap-4 text-[11px] text-[#94a3b8] font-medium uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 8 min read</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight font-[family-name:var(--font-outfit)]">
              {post.title}
            </h1>

            <p className="text-lg text-[#94a3b8] italic leading-relaxed">
              {post.summary}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00f2ff] to-[#bc13fe] p-[1px]">
                  <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center text-[10px] font-bold">WA</div>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">SYSTEM OPERATOR</p>
                  <p className="text-[10px] text-[#94a3b8]">Verified Intelligence</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#94a3b8] transition-all"><Share2 className="w-4 h-4" /></button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#94a3b8] transition-all"><Bookmark className="w-4 h-4" /></button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div 
              className="prose prose-invert max-w-none text-[#f8f8f8] leading-[1.8] space-y-6 font-light"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 bg-[length:100%_4px,3px_100%] opacity-[0.03]" />
        </article>
      </div>
    </div>
  )
}
