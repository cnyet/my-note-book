"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMemo } from "react";

import BlogEditor, { BlogPost, BlogPostFormData } from "@/components/admin/BlogEditor";

// Mock data for the edit page
const mockPosts: Record<number, BlogPost> = {
  1: {
    id: 1,
    title: "Understanding AI Agents",
    summary: "A comprehensive guide to AI agent architectures and implementation patterns",
    content: `
      <h1>Introduction to AI Agents</h1>
      <p>Artificial Intelligence agents are autonomous systems designed to perform tasks that typically require human intelligence. In this comprehensive guide, we'll explore the fundamental concepts and architectures.</p>

      <h2>What are AI Agents?</h2>
      <p>AI agents are software entities that can perceive their environment and take actions to achieve specific goals. They combine various AI techniques including:</p>

      <ul>
        <li>Machine Learning algorithms</li>
        <li>Natural Language Processing</li>
        <li>Computer Vision</li>
        <li>Decision-making systems</li>
      </ul>

      <h2>Key Components</h2>
      <p>Every AI agent consists of several key components that work together:</p>

      <ol>
        <li><strong>Sensors</strong>: To perceive the environment</li>
        <li><strong>Actuators</strong>: To perform actions</li>
        <li><strong>Knowledge Base</strong>: Store information about the world</li>
        <li><strong>Inference Engine</strong>: Make decisions based on available information</li>
      </ol>

      <h2>Implementation Patterns</h2>
      <p>When building AI agents, several patterns have proven effective:</p>

      <ul>
        <li>Reactive agents respond immediately to environmental changes</li>
        <li>Deliberative agents maintain internal world models</li>
        <li>Hybrid agents combine reactive and deliberative approaches</li>
      </ul>

      <p><strong>Conclusion:</strong> AI agents represent one of the most exciting frontiers in artificial intelligence, with applications ranging from autonomous vehicles to virtual assistants.</p>
    `,
    coverImage: "/uploads/blog/ai-agents-cover.jpg",
    seoTitle: "AI Agents Guide - MyNoteBook",
    seoDescription: "Learn about AI agent architectures, components, and implementation patterns in this comprehensive guide.",
    publishTime: "2026-02-20T10:00:00",
    publishDate: "2026-02-20",
    status: "published",
    author: "Admin",
    views: 1245,
  },
  2: {
    id: 2,
    title: "Next.js 15 Features",
    summary: "Exploring new features in Next.js 15 including React Server Components",
    content: `
      <h1>What's New in Next.js 15</h1>
      <p>Next.js 15 brings exciting new features and improvements to the React framework. Let's dive into the key updates.</p>

      <h2>React Server Components</h2>
      <p>Server Components are now stable and provide significant performance benefits by reducing client-side JavaScript.</p>

      <h2>Improved App Router</h2>
      <p>The App Router receives enhancements including better streaming and error handling.</p>

      <h2>Turbopack</h2>
      <p>Turbopack is now in beta, offering faster build times and improved developer experience.</p>

      <p><em>This post is still being drafted...</em></p>
    `,
    coverImage: "",
    seoTitle: "",
    seoDescription: "",
    publishTime: "2026-02-18T14:30:00",
    publishDate: "2026-02-18",
    status: "draft",
    author: "Admin",
    views: 0,
  },
};

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const router = useRouter();
  // FIXED: Added NaN validation for parseInt result
  const postId = parseInt(params.id, 10);

  // Get the post data (in a real app, this would be an API call)
  // FIXED: Moved useMemo before conditional return to avoid React Hook violation
  const post = useMemo(() => mockPosts[postId] ?? null, [postId]);

  // Validate that postId is a valid number
  if (isNaN(postId)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#566a7f] dark:text-[#a3b1c2] mb-2">
            Invalid Post ID
          </h1>
          <p className="text-[#697a8d] mb-4">
            The post ID must be a valid number.
          </p>
          <button
            onClick={() => router.push("/admin/blog")}
            className="text-[#696cff] hover:underline"
          >
            Back to Blog List
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#566a7f] dark:text-[#a3b1c2] mb-2">
            Post Not Found
          </h1>
          <p className="text-[#697a8d] mb-4">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/admin/blog")}
            className="text-[#696cff] hover:underline"
          >
            Back to Blog List
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (data: BlogPostFormData) => {
    // In a real implementation, this would make an API call
    // For now, we'll simulate a successful save
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Updating blog post:", { id: postId, ...data });
    toast.success(
      data.status === "published"
        ? "Blog post updated and published successfully!"
        : "Blog post updated and saved as draft!"
    );

    // Navigate back to the blog list
    router.push("/admin/blog");
  };

  const handleCancel = () => {
    router.push("/admin/blog");
  };

  return (
    <BlogEditor
      post={post}
      mode="edit"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
