export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  publishDate: string;
  status: "draft" | "published";
  author?: string;
  views?: number;
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Understanding AI Agents",
    summary: "A comprehensive guide to AI agent architectures and implementation patterns",
    publishDate: "2026-02-20",
    status: "published",
    author: "Admin",
    views: 1245,
  },
  {
    id: 2,
    title: "Next.js 15 Features",
    summary: "Exploring new features in Next.js 15 including React Server Components",
    publishDate: "2026-02-18",
    status: "draft",
    author: "Admin",
    views: 0,
  },
  {
    id: 3,
    title: "TypeScript Best Practices",
    summary: "Learn how to write better TypeScript code with these proven patterns",
    publishDate: "2026-02-15",
    status: "published",
    author: "Editor",
    views: 892,
  },
  {
    id: 4,
    title: "React Hooks Deep Dive",
    summary: "Understanding useEffect, useMemo, and useCallback in depth",
    publishDate: "2026-02-12",
    status: "published",
    author: "Admin",
    views: 2341,
  },
  {
    id: 5,
    title: "CSS Grid vs Flexbox",
    summary: "When to use CSS Grid and when to use Flexbox for layouts",
    publishDate: "2026-02-10",
    status: "draft",
    author: "Editor",
    views: 0,
  },
  {
    id: 6,
    title: "State Management with Zustand",
    summary: "A lightweight alternative to Redux for React state management",
    publishDate: "2026-02-08",
    status: "published",
    author: "Admin",
    views: 1567,
  },
  {
    id: 7,
    title: "Building APIs with FastAPI",
    summary: "Creating RESTful APIs using Python's FastAPI framework",
    publishDate: "2026-02-05",
    status: "draft",
    author: "Admin",
    views: 0,
  },
  {
    id: 8,
    title: "Docker for Developers",
    summary: "Containerize your applications with Docker best practices",
    publishDate: "2026-02-01",
    status: "published",
    author: "Editor",
    views: 2103,
  },
  {
    id: 9,
    title: "GraphQL vs REST",
    summary: "Choosing the right API architecture for your project",
    publishDate: "2026-01-28",
    status: "published",
    author: "Admin",
    views: 3456,
  },
  {
    id: 10,
    title: "TailwindCSS Tips and Tricks",
    summary: "Advanced TailwindCSS techniques for faster development",
    publishDate: "2026-01-25",
    status: "draft",
    author: "Editor",
    views: 0,
  },
];
