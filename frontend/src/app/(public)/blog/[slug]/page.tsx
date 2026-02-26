"use client";

import { MarkdownRenderer } from "@/components/features/blog/MarkdownRenderer";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Share2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock content for demonstration
const mockMarkdown = `
## Introduction

In the rapidly evolving landscape of artificial intelligence, we are witnessing a paradigm shift from monolithic models to collaborative **multi-agent orchestration**.

Genesis v2.0 represents our most ambitious effort to date in building a framework that allows these agents to communicate, coordinate, and execute complex workflows with minimal human intervention.

## Architectural Overview

The core of our platform relies on a distributed mesh network of specialized co-processors. Each agent is designed to handle a specific domain while maintaining a global state awareness via our proprietary sync protocol.

\`\`\`typescript
interface AgentMesh {
  id: string;
  role: "coordinator" | "executor" | "monitor";
  status: OnlineStatus;
  capabilities: string[];
}

const initializeNode = async (config: Config): Promise<Node> => {
  const mesh = await MeshDiscovery.connect(config.endpoint);
  return new AgentNode(mesh);
};
\`\`\`

## Key Coordination Patterns

To achieve synchronization across heterogeneous agents, we implemented three primary patterns:

1. **Broadcast/Subscribe**: For global events and state updates.
2. **Direct P2P Transmission**: For high-bandwidth data transfer between adjacent nodes.
3. **Consensus Voting**: For critical decision points where multi-agent agreement is mandatory.

> "The intelligence of the system is not in the individual agents, but in the emergent behavior of their interaction." — Genesis Core Specification

## Conclusion

As we continue to iterate on the My-Note-Book platform, our focus remains on reducing the latency between intent and execution. By empowering agents with autonomy, we liberate developers to focus on higher-level creative architectural problems.
`;

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="min-h-screen pt-32 px-6 pb-0 relative">
      <div className="max-w-4xl mx-auto">
        <div className="animate-in fade-in duration-700">
          {/* Back Button */}
          <Link href="/blog">
            <motion.div
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 cursor-pointer group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:text-primary transition-colors"
              />
              <span className="font-mono text-xs uppercase tracking-widest">
                Back to Project Logs
              </span>
            </motion.div>
          </Link>

          {/* Article Header */}
          <div className="space-y-8 mb-12">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                Technical Deep Dive
              </span>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight">
                The Future of AI in Workflow Automation
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-white/5">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <User size={20} className="text-text-muted" />
                  </div>
                  <div>
                    <div className="text-sm font-heading font-bold text-white">
                      Dr. A. Chen
                    </div>
                    <div className="text-[10px] font-mono text-text-muted uppercase">
                      Core Architect
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono text-text-muted uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    Feb 09, 2026
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-accent" />8 min read
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-text-muted hover:text-primary">
                  <Bookmark size={20} />
                </button>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all text-text-muted hover:text-accent">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-12">
              <MarkdownRenderer content={mockMarkdown} />
            </div>
          </div>

          {/* Bottom Navigation */}
          <footer className="mt-20 pt-12 border-t border-white/5 text-center pb-20">
            <h4 className="text-xl font-heading font-bold mb-8">
              Continue your journey
            </h4>
            <Link href="/blog">
              <span className="text-primary font-bold hover:underline cursor-pointer">
                Browse more transmission logs →
              </span>
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
