"use client";

import {
  ArrowLeftOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileMarkdownOutlined,
  FileTextOutlined,
  PictureOutlined,
  SaveOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Input, message, Space, Spin, Switch, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import { cn } from "@/lib/utils";
import { BLOG_EDITOR_CONSTANTS } from "./blog/constants";

// Zod schema for form validation
export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  publishTime: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;
export type EditorMode = "wysiwyg" | "markdown";

export interface BlogPost extends BlogPostFormData {
  id?: number;
  author?: string;
  views?: number;
  publishDate?: string;
}

interface BlogEditorProps {
  post?: BlogPost;
  mode?: "create" | "edit";
  onSave?: (data: BlogPostFormData) => Promise<void>;
  onCancel?: () => void;
}

const { TextArea } = Input;

// Toolbar component for Tiptap editor - moved outside main component
interface MenuBarProps {
  editor: ReturnType<typeof useEditor>;
}

function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-[#eceef1] dark:border-[#444564]">
      <Button
        type="text"
        size="small"
        icon={<FileTextOutlined />}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-[#696cff] text-white" : ""}
      >
        Bold
      </Button>
      <Button
        type="text"
        size="small"
        icon={<EditOutlined />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-[#696cff] text-white" : ""}
      >
        Italic
      </Button>
      <Button
        type="text"
        size="small"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "bg-[#696cff] text-white" : ""}
      >
        H1
      </Button>
      <Button
        type="text"
        size="small"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "bg-[#696cff] text-white" : ""}
      >
        H2
      </Button>
      <Button
        type="text"
        size="small"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-[#696cff] text-white" : ""}
      >
        Bullet List
      </Button>
      <Button
        type="text"
        size="small"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-[#696cff] text-white" : ""}
      >
        Numbered List
      </Button>
      <Button
        type="text"
        size="small"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "bg-[#696cff] text-white" : ""}
      >
        Code Block
      </Button>
    </div>
  );
}

export default function BlogEditor({
  post,
  mode = "create",
  onSave,
  onCancel,
}: BlogEditorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [editorMode, setEditorMode] = useState<EditorMode>("wysiwyg");
  const [markdownContent, setMarkdownContent] = useState(post?.content || "");
  const [previewContent, setPreviewContent] = useState(post?.content || "");
  const [coverImageFile, setCoverImageFile] = useState<UploadFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        bulletList: { HTMLAttributes: { class: "list-disc ml-6" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-6" } },
        heading: { HTMLAttributes: { class: "font-bold" } },
      }),
      Placeholder.configure({
        placeholder: "Start writing your blog post...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-500 underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded-lg" },
      }),
    ],
    content: post?.content || "",
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert max-w-none focus:outline-none p-4",
          `min-h-[${BLOG_EDITOR_CONSTANTS.MIN_EDITOR_HEIGHT}px]`,
          "text-[#566a7f] dark:text-[#a3b1c2]",
          isDark ? "bg-[#2b2c40]" : "bg-[#f8f7fa]"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setPreviewContent(html);
    },
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || "",
      summary: post?.summary || "",
      content: post?.content || "",
      coverImage: post?.coverImage || "",
      seoTitle: post?.seoTitle || "",
      seoDescription: post?.seoDescription || "",
      publishTime: post?.publishTime || post?.publishDate || "",
      status: post?.status || "draft",
    },
  });

  // Update preview when content changes
  useEffect(() => {
    if (editorMode === "markdown") {
      setPreviewContent(markdownContent);
    } else if (editor) {
      setPreviewContent(editor.getHTML());
    }
  }, [markdownContent, editorMode, editor]);

  // Sync content between modes
  useEffect(() => {
    if (editor && editorMode === "wysiwyg") {
      setValue("content", editor.getHTML());
    } else {
      setValue("content", markdownContent);
    }
  }, [editorMode, markdownContent, editor, setValue]);

  // Set initial cover image
  useEffect(() => {
    if (post?.coverImage) {
      setCoverImageFile([
        {
          uid: "-1",
          name: "cover-image.jpg",
          status: "done",
          url: post.coverImage,
        },
      ]);
    }
  }, [post?.coverImage]);

  // Handle editor mode switch
  const handleModeSwitch = useCallback(
    (newMode: EditorMode) => {
      if (newMode === editorMode) return;

      if (newMode === "markdown" && editor) {
        // Convert HTML to Markdown (simplified)
        const html = editor.getHTML();
        const markdown = html
          .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
          .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
          .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
          .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
          .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
          .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
          .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, "![]($1)")
          .replace(/<[^>]+>/g, "");
        setMarkdownContent(markdown);
      } else if (newMode === "wysiwyg" && editor) {
        // Convert Markdown to HTML and set in editor
        editor.commands.setContent(markdownContent);
      }

      setEditorMode(newMode);
    },
    [editorMode, editor, markdownContent]
  );

  // Handle form submission
  const onSubmit = useCallback(
    async (data: BlogPostFormData, publishStatus: "draft" | "published") => {
      setIsSubmitting(true);
      try {
        const submitData = {
          ...data,
          status: publishStatus,
          content: editorMode === "wysiwyg" && editor ? editor.getHTML() : markdownContent,
          coverImage: coverImageFile[0]?.url || data.coverImage,
        };

        if (onSave) {
          await onSave(submitData);
        } else {
          // Mock save
          await new Promise((resolve) => setTimeout(resolve, BLOG_EDITOR_CONSTANTS.SAVE_DELAY_MS));
          message.success(
            publishStatus === "published"
              ? "Blog post published successfully!"
              : "Blog post saved as draft!"
          );
          router.push("/admin/blog");
        }
      } catch (error) {
        // Proper error logging instead of empty catch
        console.error("Failed to save blog post:", error);
        message.error("Failed to save blog post");
      } finally {
        setIsSubmitting(false);
      }
    },
    [editorMode, editor, markdownContent, coverImageFile, onSave, router]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/admin/blog");
    }
  }, [onCancel, router]);

  // Upload props
  const uploadProps: UploadProps = {
    name: "file",
    listType: "picture-card",
    maxCount: BLOG_EDITOR_CONSTANTS.MAX_FILES,
    fileList: coverImageFile,
    onChange: ({ fileList }) => {
      setCoverImageFile(fileList);
      if (fileList[0]?.url) {
        setValue("coverImage", fileList[0].url);
      }
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isValidSize = file.size < BLOG_EDITOR_CONSTANTS.MAX_IMAGE_SIZE_BYTES;
      if (!isValidSize) {
        message.error(
          `Image must be smaller than ${BLOG_EDITOR_CONSTANTS.MAX_IMAGE_SIZE_MB}MB!`
        );
        return false;
      }
      return true;
    },
    customRequest: ({ onSuccess }) => {
      // Mock upload - in real implementation, upload to server
      setTimeout(() => {
        const mockUrl = `/uploads/blog/cover-${Date.now()}.jpg`;
        setCoverImageFile([
          {
            uid: "-1",
            name: "cover-image.jpg",
            status: "done",
            url: mockUrl,
          },
        ]);
        setValue("coverImage", mockUrl);
        onSuccess?.("ok");
      }, BLOG_EDITOR_CONSTANTS.UPLOAD_DELAY_MS);
    },
  };

  const status = watch("status");

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedPreviewContent = DOMPurify.sanitize(previewContent, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "a",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "img",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "title"],
  });

  return (
    <div className="animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleCancel}
            className="text-[#697a8d] border-[#eceef1] dark:border-[#444564]"
          >
            Back
          </Button>
          <div>
            <h1 className="text-[1.5rem] font-bold text-[#566a7f] dark:text-[#a3b1c2]">
              {mode === "create" ? "Create New Post" : "Edit Post"}
            </h1>
            <p className="text-sm text-[#a1acb8] mt-1">
              {mode === "create" ? "Create a new blog post" : "Edit existing blog post"}
            </p>
          </div>
        </div>
        <Space>
          <Button
            icon={<SaveOutlined />}
            onClick={handleSubmit((data) => onSubmit(data, "draft"))}
            disabled={isSubmitting}
            className="text-[#71dd37] border-[#71dd37] hover:bg-[#71dd37] hover:text-white"
          >
            Save as Draft
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmit((data) => onSubmit(data, "published"))}
            disabled={isSubmitting}
            className="bg-[#696cff] hover:bg-[#5f61e6] text-white border-none"
          >
            Publish
          </Button>
        </Space>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Editor Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Title Input */}
          <Card className="sneat-card-shadow">
            <Form layout="vertical">
              <Form.Item
                label={<span className="text-[#566a7f] dark:text-[#a3b1c2]">Title</span>}
                validateStatus={errors.title ? "error" : ""}
                help={errors.title?.message}
              >
                <Input
                  {...register("title")}
                  placeholder="Enter post title..."
                  className="text-lg font-semibold"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-[#566a7f] dark:text-[#a3b1c2]">Summary</span>}
              >
                <TextArea
                  {...register("summary")}
                  placeholder="Write a brief summary..."
                  rows={2}
                />
              </Form.Item>
            </Form>
          </Card>

          {/* Editor */}
          <Card
            className="sneat-card-shadow"
            title={
              <div className="flex items-center justify-between">
                <span className="text-[#566a7f] dark:text-[#a3b1c2]">Content</span>
                <Space>
                  <Button
                    type="text"
                    size="small"
                    icon={<FileTextOutlined />}
                    onClick={() => handleModeSwitch("wysiwyg")}
                    className={cn(
                      editorMode === "wysiwyg"
                        ? "text-[#696cff] bg-[#696cff]/10"
                        : "text-[#697a8d]"
                    )}
                  >
                    WYSIWYG
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    icon={<FileMarkdownOutlined />}
                    onClick={() => handleModeSwitch("markdown")}
                    className={cn(
                      editorMode === "markdown"
                        ? "text-[#696cff] bg-[#696cff]/10"
                        : "text-[#697a8d]"
                    )}
                  >
                    Markdown
                  </Button>
                </Space>
              </div>
            }
          >
            {editorMode === "wysiwyg" ? (
              <div>
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            ) : (
              <TextArea
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                placeholder="Write your content in Markdown..."
                rows={BLOG_EDITOR_CONSTANTS.TEXTAREA_ROWS}
                className={cn(
                  "font-mono text-sm",
                  isDark ? "bg-[#2b2c40]" : "bg-[#f8f7fa]"
                )}
              />
            )}
          </Card>

          {/* Preview */}
          <Card
            className="sneat-card-shadow"
            title={
              <span className="text-[#566a7f] dark:text-[#a3b1c2]">
                <EyeOutlined className="mr-2" />
                Preview
              </span>
            }
          >
            <div
              className={cn(
                "prose dark:prose-invert max-w-none p-4 rounded-lg min-h-[200px]",
                isDark ? "bg-[#2b2c40]" : "bg-[#f8f7fa]"
              )}
            >
              {editorMode === "markdown" ? (
                <ReactMarkdown>{previewContent}</ReactMarkdown>
              ) : (
                // FIXED: XSS vulnerability - using DOMPurify to sanitize HTML
                <div dangerouslySetInnerHTML={{ __html: sanitizedPreviewContent }} />
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <Card
            className="sneat-card-shadow"
            title={
              <span className="text-[#566a7f] dark:text-[#a3b1c2]">
                <PictureOutlined className="mr-2" />
                Cover Image
              </span>
            }
          >
            <Upload {...uploadProps}>
              {coverImageFile.length === 0 && (
                <div>
                  <CameraOutlined className="text-2xl text-[#697a8d]" />
                  <div className="mt-2 text-sm text-[#697a8d]">
                    Click or drag image to upload
                  </div>
                </div>
              )}
            </Upload>
            <div className="mt-4 text-xs text-[#a1acb8]">
              Recommended size: {BLOG_EDITOR_CONSTANTS.RECOMMENDED_COVER_WIDTH}x{BLOG_EDITOR_CONSTANTS.RECOMMENDED_COVER_HEIGHT}px. Max size: {BLOG_EDITOR_CONSTANTS.MAX_IMAGE_SIZE_MB}MB.
            </div>
          </Card>

          {/* Publishing Options */}
          <Card
            className="sneat-card-shadow"
            title={
              <span className="text-[#566a7f] dark:text-[#a3b1c2]">
                <SendOutlined className="mr-2" />
                Publishing Options
              </span>
            }
          >
            <Form layout="vertical">
              <Form.Item
                label={<span className="text-[#566a7f] dark:text-[#a3b1c2]">Status</span>}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#697a8d]">
                    {status === "published" ? "Published" : "Draft"}
                  </span>
                  <Switch
                    checked={status === "published"}
                    onChange={(checked) =>
                      setValue("status", checked ? "published" : "draft")
                    }
                    checkedChildren={<CheckCircleOutlined />}
                    unCheckedChildren={<CloseCircleOutlined />}
                  />
                </div>
              </Form.Item>

              <Form.Item
                label={<span className="text-[#566a7f] dark:text-[#a3b1c2]">Publish Time</span>}
              >
                <DatePicker
                  showTime
                  className="w-full"
                  placeholder="Select publish time"
                  onChange={(date) =>
                    setValue("publishTime", date ? date.toISOString() : "")
                  }
                />
              </Form.Item>
            </Form>
          </Card>

          {/* SEO Options */}
          <Card
            className="sneat-card-shadow"
            title={
              <span className="text-[#566a7f] dark:text-[#a3b1c2]">
                <EyeOutlined className="mr-2" />
                SEO Options
              </span>
            }
          >
            <Form layout="vertical">
              <Form.Item
                label={<span className="text-[#566a7f] dark:text-[#a3b1c2]">SEO Title</span>}
                help={errors.seoTitle?.message}
              >
                <Input
                  {...register("seoTitle")}
                  placeholder="Custom SEO title (optional)"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-[#566a7f] dark:text-[#a3b1c2]">SEO Description</span>}
              >
                <TextArea
                  {...register("seoDescription")}
                  placeholder="Meta description for search engines..."
                  rows={3}
                />
              </Form.Item>
            </Form>
          </Card>

          {/* Danger Zone */}
          {mode === "edit" && post?.id && (
            <Card
              className="sneat-card-shadow border-red-200 dark:border-red-900"
              title={
                <span className="text-red-500">Danger Zone</span>
              }
            >
              <Button
                danger
                block
                icon={<DeleteOutlined />}
                onClick={() => {
                  // Placeholder for delete functionality
                }}
              >
                Delete Post
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2b2c40] p-6 rounded-lg flex flex-col items-center gap-4">
            <Spin size="large" />
            <p className="text-[#566a7f] dark:text-[#a3b1c2]">Saving...</p>
          </div>
        </div>
      )}
    </div>
  );
}
