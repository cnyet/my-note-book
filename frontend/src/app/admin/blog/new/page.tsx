"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import BlogEditor, { BlogPostFormData } from "@/components/admin/BlogEditor";

export default function NewBlogPostPage() {
  const router = useRouter();

  const handleSave = async (data: BlogPostFormData) => {
    // In a real implementation, this would make an API call
    // For now, we'll simulate a successful save
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Saving new blog post:", data);
    toast.success(
      data.status === "published"
        ? "Blog post published successfully!"
        : "Blog post saved as draft!"
    );

    // Navigate back to the blog list
    router.push("/admin/blog");
  };

  const handleCancel = () => {
    router.push("/admin/blog");
  };

  return <BlogEditor mode="create" onSave={handleSave} onCancel={handleCancel} />;
}
