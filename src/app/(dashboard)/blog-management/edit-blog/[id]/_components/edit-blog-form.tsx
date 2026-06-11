"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import BlogForm from "../../../_components/blog-form";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";

import type { BlogResponse } from "../../../_components/blog-data-type";

type Props = {
  blogId: string;
};

const EditBlogForm = ({ blogId }: Props) => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, error, isError } = useQuery<BlogResponse>({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${blogId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
    enabled: !!token && !!blogId,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorContainer message={error?.message || "Failed to load blog"} />
      </div>
    );
  }

  if (!data?.success || !data?.data) {
    return (
      <div className="p-6">
        <ErrorContainer message="Blog not found" />
      </div>
    );
  }

  const blog = data.data;

  return (
    <BlogForm
      mode="edit"
      blogId={blogId}
      initialTitle={blog.title}
      initialDescription={blog.description}
      initialImage={blog.thembnail}
    />
  );
};

export default EditBlogForm;