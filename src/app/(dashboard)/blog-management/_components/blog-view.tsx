"use client";

import Image from "next/image";
import moment from "moment";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Blog } from "./blog-data-type";

const BlogView = ({
  open,
  onOpenChange,
  blogData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blogData: Blog | null;
}) => {
  if (!blogData) return null;


  console.log("BlogView render with data:", blogData);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[calc(100vw-2rem)] p-0 bg-white !rounded-[12px] max-h-[90vh] flex flex-col">
        {/* Thumbnail */}
        {blogData.thumbnail && (
          <div className="relative h-56 w-full shrink-0">
            <Image
              src={blogData.thumbnail}
              alt={blogData.title}
              fill
              className="w-full h-auto object-cover rounded-t-[12px]"
            />
          </div>
        )}

        <div className="p-8 space-y-5 overflow-y-auto flex-1">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-[#1E1E1E] leading-[130%] break-words">
            {blogData.title}
          </h2>

          {/* Meta info row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6C757D]">
            {blogData.author && (
              <span className="inline-flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {blogData.author}
              </span>
            )}
            {blogData.category && (
              <span className="inline-flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><polyline points="14 2 14 8 20 8"/></svg>
                {blogData.category}
              </span>
            )}
            <span>
              Created: {moment(blogData.createdAt).format("MMMM D, YYYY")}
            </span>
            {blogData.updatedAt !== blogData.createdAt && (
              <span>
                Updated: {moment(blogData.updatedAt).format("MMMM D, YYYY")}
              </span>
            )}
            {blogData.publishedAt && (
              <span>
                Published: {moment(blogData.publishedAt).format("MMMM D, YYYY")}
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium",
                blogData.isPublished
                  ? "bg-[#E6F2FD] text-primary"
                  : "bg-[#FEF8E6] text-[#DEA400]"
              )}
            >
              {blogData.isPublished ? "Published" : "Draft"}
            </span>
          </div>

          {/* Tags */}
          {blogData.tags && blogData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blogData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-[4px] bg-[#F0F0F0] px-2.5 py-1 text-xs font-medium text-[#68706A]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-[#E6E7E6]" />

          {/* Content (HTML content) */}
          <div
            className="text-[#343A40] leading-[170%] break-words overflow-wrap-break-word [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:mb-3 [&_h1]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:mt-2 [&_p]:text-base [&_p]:text-[#343A40] [&_p]:leading-[170%] [&_p]:mb-3 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-[8px] [&_img]:my-4 [&_a]:text-primary [&_a]:underline [&_a]:break-all [&_ul]:mb-3 [&_ol]:mb-3 [&_ul>li]:ml-5 [&_ol>li]:ml-5 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:bg-[#F8F9FA] [&_pre]:p-4 [&_pre]:rounded-[8px] [&_pre]:overflow-x-auto [&_code]:break-words [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#D9D9D9] [&_td]:p-3 [&_th]:border [&_th]:border-[#D9D9D9] [&_th]:p-3 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#6C757D] [&_blockquote]:my-4"
            dangerouslySetInnerHTML={{ __html: blogData.content || blogData.description || "" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogView;