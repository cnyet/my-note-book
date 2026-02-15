"use client";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  tag?: string;
  centered?: boolean;
}

export const SectionHeader = ({
  title,
  subtitle,
  tag,
  centered = false,
}: SectionHeaderProps) => (
  <div
    className={`max-w-4xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 ${centered ? "mx-auto text-center" : ""}`}
  >
    {tag && (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-6`}
      >
        {tag}
      </div>
    )}
    <h2
      className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9] text-white"
      dangerouslySetInnerHTML={{ __html: title }}
    ></h2>
    <p
      className={`text-slate-400 text-xl md:text-2xl font-medium leading-relaxed ${centered ? "mx-auto" : ""} max-w-2xl`}
    >
      {subtitle}
    </p>
  </div>
);
