"use client";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  centered?: boolean;
}

export const SectionHeader = ({
  title,
  subtitle,
  centered = false,
}: SectionHeaderProps) => (
  <div
    className={`max-w-4xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 ${centered ? "mx-auto text-center" : ""}`}
  >
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
