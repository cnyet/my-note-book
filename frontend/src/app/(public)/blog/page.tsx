"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import { Share2 } from "lucide-react";

const BlogsFooter = () => (
  <footer className="mt-20 border-t border-white/10 py-12 px-6 backdrop-blur-md bg-white/5 rounded-t-[60px] mb-10">
    <div className="max-w-4xl mx-auto text-center space-y-10">
      <h2 className="text-4xl md:text-6xl font-black text-white leading-none">
        The Morning Brief.
      </h2>
      <p className="text-slate-400 text-lg font-medium">
        Join 25,000+ design engineers who receive our bi-weekly breakdown of the
        AI landscape.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <input
          type="email"
          placeholder="email@address.com"
          className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white w-full sm:max-w-xs focus:outline-none focus:border-indigo-500/50"
        />
        <button className="px-10 py-5 rounded-2xl bg-white text-black font-black hover:bg-indigo-50 transition-all">
          Subscribe Now
        </button>
      </div>
    </div>
  </footer>
);

export default function BlogPage() {
  const posts = [
    {
      title: "The Architecture of Autonomous UX",
      author: "Vira Brand",
      date: "Mar 12, 2024",
      category: "Engineering",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Designing for the Age of Agency",
      author: "Lexa Research",
      date: "Mar 08, 2024",
      category: "Vision",
      image:
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Beyond the Screen: Ambient Interfaces",
      author: "Koda Motion",
      date: "Feb 28, 2024",
      category: "Labs",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="min-h-screen pt-32 px-6 pb-0 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="animate-in fade-in duration-700 py-10 min-h-[60vh]">
          <SectionHeader
            centered
            tag="Editorial"
            title="Insights & <br />Breakthroughs."
            subtitle="The latest thoughts from our design leads on AI, creativity, and the future of engineering."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="overflow-hidden rounded-[40px] mb-8 glass border-white/5 aspect-video relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute top-6 left-6 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                    {post.category}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <span>{post.author}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <Share2
                    size={16}
                    className="text-slate-600 hover:text-white transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
          <BlogsFooter />
        </div>
      </div>
    </div>
  );
}
