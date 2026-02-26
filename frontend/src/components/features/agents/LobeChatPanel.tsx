"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Loader2 } from "lucide-react";

export function LobeChatPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if LobeChat is accessible
    const checkLobeChat = async () => {
      try {
        const response = await fetch("http://localhost:3210", {
          method: "HEAD",
          mode: "no-cors",
        });
        setIsLoading(false);
      } catch (err) {
        setError("LobeChat not available");
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(checkLobeChat, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col backdrop-blur-md bg-white/5 border border-white/10 rounded-[40px] overflow-hidden shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Bot className="text-indigo-400" size={20} />
          </div>
          <div>
            <span className="font-bold text-white text-sm">LobeChat AI</span>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              Design Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
            Active
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium">
              Connecting to LobeChat...
            </p>
            <p className="text-slate-600 text-xs mt-2">
              Initializing AI assistant
            </p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-300 text-sm font-medium mb-2">
              AI Assistant Ready
            </p>
            <p className="text-slate-500 text-xs text-center max-w-[200px]">
              Select an agent from the grid to start a conversation
            </p>
          </div>
        ) : (
          <iframe
            src="http://localhost:3210"
            width="100%"
            height="100%"
            allow="microphone; camera"
            sandbox="allow-same-origin allow-scripts allow-popups"
            className="border-none w-full h-full"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError("Connection failed");
            }}
          />
        )}
      </div>

      {/* Footer - Quick Actions */}
      <div className="px-6 py-4 border-t border-white/10 bg-white/5">
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all">
            New Chat
          </button>
          <button className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all">
            History
          </button>
        </div>
      </div>
    </motion.div>
  );
}
