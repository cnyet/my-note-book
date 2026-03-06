"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "antd";
import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
  placeholder?: string;
}

export default function MarkdownEditor({
  value = "",
  onChange,
  height = 400,
  placeholder = "Start writing in Markdown...",
}: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="w-full rounded-lg border border-[#eceef1] dark:border-[#444564]"
        style={{ minHeight: height }}
      />
    );
  }

  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange?.(val || "")}
        height={height}
        preview="edit"
        hideToolbar={false}
        enableScroll={true}
        visibleDragbar={true}
        className="rounded-lg overflow-hidden"
        textareaProps={{
          placeholder: placeholder,
        }}
        previewOptions={{
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeRaw],
        }}
      />
    </div>
  );
}
