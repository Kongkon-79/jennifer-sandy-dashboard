"use client";

import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CloudUpload, Plus, Loader2 } from "lucide-react";
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
  initialDescription?: string;
  initialImage?: string | null;
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
  initialDescription = "",
  initialImage = null,
}: BlogFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialImage);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

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

    if (isHtmlContentEmpty(description)) {
      toast.error("Please add blog content.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description);

    if (coverFile) {
      formData.append("thembnail", coverFile);
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

          <div className="rounded-[8px] border border-[#D9D9D9] bg-white p-4">
            <label className="mb-2 block text-sm font-medium text-[#343A40]">
              Description
            </label>
            <BlogRichTextEditor
              initialValue={description}
              placeholder="Description here"
              onChange={setDescription}
            />
          </div>
        </div>

        <div className="space-y-4">
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