"use client";

import { useEffect, useRef, useState, type DragEvent, type FormEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CloudUpload, Plus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import BlogRichTextEditor from "./blog-rich-text-editor";

type BlogFormMode = "add" | "edit";

type BlogFormProps = {
  mode: BlogFormMode;
  blogId?: string;
  initialTitle?: string;
  initialContent?: string;
  initialImage?: string | null;
  initialExcerpt?: string;
  initialCategory?: string;
  initialTags?: string[];
  initialAuthor?: string;
  initialIsPublished?: boolean;
  initialPublishedAt?: string;
};

const isHtmlContentEmpty = (html: string) => {
  const textContent = html
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .trim();

  return textContent.length === 0 && !/<img\b/i.test(html);
};

const BlogForm = ({
  mode,
  blogId,
  initialTitle = "",
  initialContent = "",
  initialImage = null,
  initialExcerpt = "",
  initialCategory = "",
  initialTags = [],
  initialAuthor = "",
  initialIsPublished = true,
  initialPublishedAt = "",
}: BlogFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [excerpt] = useState(initialExcerpt);
  const [category, setCategory] = useState(initialCategory);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState("");
  const [author, setAuthor] = useState(initialAuthor);
  const [isPublished] = useState(initialIsPublished);
  const [publishedAt, setPublishedAt] = useState(initialPublishedAt);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialImage);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialPublishedAt) {
      // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
      const date = new Date(initialPublishedAt);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        setPublishedAt(`${year}-${month}-${day}T${hours}:${minutes}`);
      }
    } else {
      const now = new Date().toISOString().slice(0, 16);
      setPublishedAt(now);
    }
  }, [initialPublishedAt]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const updateCoverPreview = (file?: File) => {
    if (!file) {
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setCoverFile(file);
    setCoverPreview(objectUrl);
  };

  const handleFileSelect = (file?: File) => {
    if (!file) {
      return;
    }

    updateCoverPreview(file);
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const { mutate: createBlog, isPending: isCreating } = useMutation({
    mutationKey: ["create-blog"],
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      return res.json();
    },
    onSuccess: (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Something went wrong");
        return;
      }
      toast.success(response?.message || "Blog created successfully");
      queryClient.invalidateQueries({ queryKey: ["blog-management"] });
      router.push("/blog-management");
    },
    onError: () => {
      toast.error("Failed to create blog");
    },
  });

  const { mutate: updateBlog, isPending: isUpdating } = useMutation({
    mutationKey: ["update-blog", blogId],
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${blogId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      return res.json();
    },
    onSuccess: (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Something went wrong");
        return;
      }
      toast.success(response?.message || "Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blog-management"] });
      router.push("/blog-management");
    },
    onError: () => {
      toast.error("Failed to update blog");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Please add a blog title.");
      return;
    }

    if (isHtmlContentEmpty(content)) {
      toast.error("Please add blog content.");
      return;
    }

    if (!author.trim()) {
      toast.error("Please add an author name.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content);
    formData.append("excerpt", excerpt.trim() || content.replace(/<[^>]*>/g, "").trim().slice(0, 150));
    formData.append("author", author.trim());
    formData.append("category", category.trim() || "General");
    formData.append("tags", tags.length > 0 ? tags.join(",") : "general");
    formData.append("isPublished", String(isPublished));

    const pubDate = publishedAt
      ? new Date(publishedAt).toISOString()
      : new Date().toISOString();
    formData.append("publishedAt", pubDate);

    if (coverFile) {
      formData.append("thumbnail", coverFile);
    }

    if (mode === "add") {
      createBlog(formData);
    } else {
      updateBlog(formData);
    }
  };

  const handleCancel = () => {
    router.push("/blog-management");
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)]">
        <div className="space-y-4">
          {/* Title */}
          <div className="rounded-[8px] border border-[#D9D9D9] bg-white p-4">
            <label className="mb-2 block text-sm font-medium text-[#343A40]">
              Title
            </label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Write Here"
              className="h-10 rounded-[6px] border-[#D9D9D9] text-sm text-[#343A40] placeholder:text-[#9CA3AF] focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Content */}
          <div className="rounded-[8px] border border-[#D9D9D9] bg-white p-4">
            <label className="mb-2 block text-sm font-medium text-[#343A40]">
              Content
            </label>
            <BlogRichTextEditor
              initialValue={content}
              placeholder="Write your blog content here..."
              onChange={setContent}
            />
          </div>

          {/* Category */}
          <div className="rounded-[8px] border border-[#D9D9D9] bg-white p-4">
            <label className="mb-2 block text-sm font-medium text-[#343A40]">
              Category
            </label>
            <Input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Write category name"
              className="h-10 rounded-[6px] border-[#D9D9D9] text-sm text-[#343A40] placeholder:text-[#9CA3AF] focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Tags */}
          <div className="rounded-[8px] border border-[#D9D9D9] bg-white p-4">
            <label className="mb-2 block text-sm font-medium text-[#343A40]">
              Tags
            </label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
                className="h-10 flex-1 rounded-[6px] border-[#D9D9D9] text-sm text-[#343A40] placeholder:text-[#9CA3AF] focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <Button
                type="button"
                onClick={addTag}
                size="icon"
                className="h-10 w-10 shrink-0 rounded-[6px] bg-primary text-white hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#E6F2FD] px-3 py-1.5 text-sm font-medium text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="inline-flex items-center justify-center rounded-full hover:bg-primary/20 p-0.5 transition-colors"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Upload Photo */}
          <div className="rounded-[8px] border border-[#D9D9D9] bg-white p-4">
            <p className="mb-3 text-sm font-medium text-[#343A40]">
              Upload Photo
            </p>

            <div
              className={cn(
                "relative flex min-h-[310px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[8px] border border-dashed border-[#D9D9D9] bg-[#FAFAFA] p-4 text-center transition-colors",
                isDragging && "border-primary bg-[#E6F2FD]",
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={() => setIsDragging(true)}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {coverPreview ? (
                <div className="relative h-[260px] w-full overflow-hidden rounded-[8px] group">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (previewUrlRef.current) {
                        URL.revokeObjectURL(previewUrlRef.current);
                        previewUrlRef.current = null;
                      }
                      setCoverPreview(null);
                      setCoverFile(null);
                    }}
                    className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <Image
                    src={coverPreview}
                    alt="Blog preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex max-w-[240px] flex-col items-center gap-3 text-[#9CA3AF]">
                  <CloudUpload className="h-8 w-8 text-[#9CA3AF]" />
                  <p className="text-xs leading-6">
                    Browse and choose the files you want to upload from your
                    computer
                  </p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-primary text-white">
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFileSelect(event.target.files?.[0])}
            />
          </div>

          {/* Author */}
          <div className="rounded-[8px] border border-[#D9D9D9] bg-white p-4">
            <label className="mb-2 block text-sm font-medium text-[#343A40]">
              Author
            </label>
            <Input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Author name"
              className="h-10 rounded-[6px] border-[#D9D9D9] text-sm text-[#343A40] placeholder:text-[#9CA3AF] focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Publish Date */}
          <div className="rounded-[8px] border border-[#D9D9D9] bg-white p-4">
            <label className="mb-2 block text-sm font-medium text-[#343A40]">
              Publish Date & Time
            </label>
            <Input
              type="datetime-local"
              value={publishedAt}
              onChange={(event) => setPublishedAt(event.target.value)}
              className="h-10 rounded-[6px] border-[#D9D9D9] text-sm text-[#343A40] focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={isSubmitting}
              className="h-10 rounded-[8px] border-[#FF5A5F] text-sm font-medium text-[#FF5A5F] hover:bg-[#FFF5F5] hover:text-[#FF5A5F]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-[8px] bg-primary text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "add" ? "Creating..." : "Updating..."}
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;