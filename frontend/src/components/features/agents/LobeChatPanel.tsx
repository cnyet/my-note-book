"use client";

import { motion } from "framer-motion";

export function LobeChatPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col bg-void/50 border border-white/5 rounded-2xl overflow-hidden glass-effect"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
            L
          </div>
          <span className="font-heading font-bold">LobeChat AI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
            Connected
          </span>
        </div>
      </div>

      <div className="flex-1 relative bg-[#000]">
        <iframe
          src="http://localhost:3210"
          width="100%"
          height="100%"
          allow="microphone; camera"
          sandbox="allow-same-origin allow-scripts allow-popups"
          className="border-none"
        />

        {/* Placeholder if iframe is blocked or social check */}
        <div className="absolute inset-0 flex items-center justify-center text-center p-8 pointer-events-none -z-10 bg-void">
          <div className="max-w-xs space-y-4">
            <p className="text-text-muted text-sm">
              Waiting for LobeChat to load at <br />
              <code className="text-primary">http://localhost:3210</code>
            </p>
            <p className="text-xs text-text-muted/50 italic">
              (Ensure LobeChat is running via Docker)
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
