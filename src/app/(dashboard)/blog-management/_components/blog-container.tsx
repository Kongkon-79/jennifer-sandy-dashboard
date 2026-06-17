"use client";

import { useState } from "react";
import Image from "next/image";
import moment from "moment";
import { Eye, PencilLine, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClaudePagination from "@/components/ui/claude-pagination";
import DeleteModal from "@/components/modals/delete-modal";
import NotFound from "@/components/shared/NotFound/NotFound";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import { cn } from "@/lib/utils";
import BlogView from "./blog-view";

import blogImage from "../../../../../public/assets/images/blog.png"

import type { Blog, BlogsResponse } from "./blog-data-type";

const ITEMS_PER_PAGE = 8;

const BlogContainer = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const { data, isLoading, error, isError } = useQuery<BlogsResponse>({
    queryKey: ["blog-management", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
    enabled: !!token,
  });

  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0;

  const handleAddBlog = () => {
    router.push("/blog-management/add-blog");
  };

  const handleViewBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setViewModalOpen(true);
  };

  const handleEditBlog = (blog: Blog) => {
    router.push(`/blog-management/edit-blog/${blog._id}`);
  };

  const { mutate: deleteBlog } = useMutation({
    mutationKey: ["delete-blog"],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
    onSuccess: (deleteResponse) => {
      if (!deleteResponse?.success) {
        toast.error(deleteResponse?.message || "Something went wrong");
        return;
      }
      toast.success(deleteResponse?.message || "Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blog-management"] });
    },
    onError: () => {
      toast.error("Failed to delete blog");
    },
  });

  const handleDeleteBlog = () => {
    if (!selectedBlog) return;
    deleteBlog(selectedBlog._id);
    setDeleteModalOpen(false);
    setSelectedBlog(null);
  };

  const blogs = data?.data ?? [];
  const showingStart = blogs.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd = Math.min(currentPage * ITEMS_PER_PAGE, data?.meta?.total ?? 0);

  let content;

  if (isLoading) {
    content = (
      <div>
        <TableSkeletonWrapper count={5} />
      </div>
    );
  } else if (isError) {
    content = (
      <div>
        <ErrorContainer message={error?.message || "Something went wrong"} />
      </div>
    );
  } else if (!data?.success || blogs.length === 0) {
    content = (
      <div>
        <NotFound message="No blog posts available yet." />
      </div>
    );
  } else {
    content = (
      <div className="overflow-hidden rounded-[12px] border border-[#E6E7E6] bg-white">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-[#E6F2FD]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[25%] py-4 pl-6 text-sm font-normal leading-[150%] text-[#343A40]">
                Title
              </TableHead>
              <TableHead className="w-[20%] py-4 text-left text-sm font-normal leading-[150%] text-[#343A40]">
                Description
              </TableHead>
              <TableHead className="w-[12%] py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                Author
              </TableHead>
              <TableHead className="w-[10%] py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                Category
              </TableHead>
              <TableHead className="w-[13%] py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                Created On
              </TableHead>
              <TableHead className="w-[10%] py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog, index) => (
              <TableRow key={blog._id}>
                <TableCell className={cn("py-3 pl-6 align-middle", index !== blogs.length - 1 && "border-b border-[#E6E7E6]")}>
                  <div className="flex items-center gap-3">
                    <Image
                      src={blog.thumbnail ? blog.thumbnail : blogImage}
                      alt={blog.title}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-[6px] object-cover"
                    />
                    <span className="text-base font-medium leading-[150%] text-[#343A40] line-clamp-1">
                      {blog.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className={cn("py-3 align-middle text-left text-base font-normal leading-[150%] text-[#68706A] max-w-[200px]", index !== blogs.length - 1 && "border-b border-[#E6E7E6]")}>
                  <div className="line-clamp-2 text-base font-normal leading-[150%] text-[#68706A]">
                    {(blog.content || blog.description || "").replace(/<[^>]*>/g, "").trim() || blog.excerpt || ""}
                  </div>
                </TableCell>
                <TableCell className={cn("py-3 text-center align-middle text-base font-normal leading-[150%] text-[#68706A]", index !== blogs.length - 1 && "border-b border-[#E6E7E6]")}>
                  {blog.author || "—"}
                </TableCell>
                <TableCell className={cn("py-3 text-center align-middle text-base font-normal leading-[150%] text-[#68706A]", index !== blogs.length - 1 && "border-b border-[#E6E7E6]")}>
                  {blog.category ? (
                    <span className="inline-flex rounded-[4px] bg-[#F0F0F0] px-2.5 py-1 text-xs font-medium text-[#68706A]">
                      {blog.category}
                    </span>
                  ) : "—"}
                </TableCell>
                <TableCell className={cn("py-3 text-center align-middle text-base font-normal leading-[150%] text-[#68706A]", index !== blogs.length - 1 && "border-b border-[#E6E7E6]")}>
                  {moment(blog.createdAt).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell className={cn("py-3 align-middle", index !== blogs.length - 1 && "border-b border-[#E6E7E6]")}>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleViewBlog(blog)}
                      className="text-[#343A40] transition-colors hover:text-primary"
                      aria-label={`View ${blog.title}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditBlog(blog)}
                      className="text-[#1E6CFF] transition-colors hover:text-[#1558d6]"
                      aria-label={`Edit ${blog.title}`}
                    >
                      <PencilLine className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBlog(blog);
                        setDeleteModalOpen(true);
                      }}
                      className="text-[#FF3B30] transition-colors hover:text-[#e0281f]"
                      aria-label={`Delete ${blog.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="px-3 md:px-6 pb-6 space-y-5">
      <div className="flex justify-end pt-6">
        <Button
          type="button"
          onClick={handleAddBlog}
          className="h-10 rounded-[8px] bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Blog
        </Button>
      </div>

      {content}

      {data?.success && blogs.length > 0 && totalPages > 1 && (
        <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-normal leading-[150%] text-[#68706A]">
            Showing {showingStart} to {showingEnd} of {data?.meta?.total} results
          </p>
          <div>
            <ClaudePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {deleteModalOpen && selectedBlog && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedBlog(null);
          }}
          onConfirm={handleDeleteBlog}
          title="Delete this blog?"
          desc="This will remove the blog permanently."
        />
      )}

      {viewModalOpen && selectedBlog && (
        <BlogView
          open={viewModalOpen}
          onOpenChange={(open) => {
            setViewModalOpen(open);
            if (!open) setSelectedBlog(null);
          }}
          blogData={selectedBlog}
        />
      )}
    </div>
  );
};

export default BlogContainer;
