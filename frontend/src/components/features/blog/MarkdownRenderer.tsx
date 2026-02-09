"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// Custom Abyss-inspired syntax highlighting theme
const abyssTheme = {
  ...atomDark,
  'code[class*="language-"]': {
    ...atomDark['code[class*="language-"]'],
    background: "transparent",
    color: "#e2e8f0",
  },
  'pre[class*="language-"]': {
    ...atomDark['pre[class*="language-"]'],
    background: "#0a0a0f",
    padding: "1.5rem",
    borderRadius: "1rem",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  keyword: { color: "#ff006e" },
  string: { color: "#10b981" },
  function: { color: "#3b82f6" },
  comment: { color: "#6b7280", fontStyle: "italic" },
  variable: { color: "#00f2ff" },
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <article
      className={cn("prose prose-invert prose-brand max-w-none", className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ className, ...props }) => (
            <h1
              className={cn(
                "text-4xl font-heading font-bold mb-8 mt-12 text-white",
                className,
              )}
              {...props}
            />
          ),
          h2: ({ className, ...props }) => (
            <h2
              className={cn(
                "text-2xl font-heading font-bold mb-6 mt-10 text-white/90 border-b border-white/5 pb-2",
                className,
              )}
              {...props}
            />
          ),
          p: ({ className, ...props }) => (
            <p
              className={cn(
                "text-text-secondary leading-relaxed mb-6 font-body text-lg",
                className,
              )}
              {...props}
            />
          ),
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div className="relative group my-8">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <SyntaxHighlighter
                  style={abyssTheme as any}
                  language={match[1]}
                  PreTag="div"
                  showLineNumbers
                  className="relative"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
                <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20 uppercase tracking-widest pointer-events-none">
                  {match[1]}
                </div>
              </div>
            ) : (
              <code
                className={cn(
                  "bg-white/10 px-1.5 py-0.5 rounded text-primary font-mono text-sm",
                  className,
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote: ({ className, ...props }) => (
            <blockquote
              className={cn(
                "border-l-4 border-primary bg-primary/5 px-6 py-4 my-8 rounded-r-xl italic text-text-secondary",
                className,
              )}
              {...props}
            />
          ),
          ul: ({ className, ...props }) => (
            <ul
              className={cn(
                "list-disc list-inside space-y-3 mb-6 text-text-secondary",
                className,
              )}
              {...props}
            />
          ),
          ol: ({ className, ...props }) => (
            <ol
              className={cn(
                "list-decimal list-inside space-y-3 mb-6 text-text-secondary",
                className,
              )}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
