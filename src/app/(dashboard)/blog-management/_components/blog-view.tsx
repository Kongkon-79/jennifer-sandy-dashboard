"use client";

import Image from "next/image";
import moment from "moment";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 bg-white !rounded-[12px] max-h-[85vh] flex flex-col">
        {/* Thumbnail */}
        {blogData.thembnail && (
          <div className="relative h-56 w-full shrink-0">
            <Image
              src={blogData.thembnail}
              alt={blogData.title}
              fill
              className="w-full h-auto object-cover rounded-t-[12px]"
            />
          </div>
        )}

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-[#1E1E1E] leading-[130%] break-words">
            {blogData.title}
          </h2>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#6C757D]">
            <span>
              Created: {moment(blogData.createdAt).format("MMMM D, YYYY")}
            </span>
            {blogData.updatedAt !== blogData.createdAt && (
              <span>
                Updated: {moment(blogData.updatedAt).format("MMMM D, YYYY")}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E6E7E6]" />

          {/* Description (HTML content) */}
          <div
            className="text-[#343A40] leading-[170%] break-words overflow-wrap-break-word [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2 [&_p]:text-base [&_p]:text-[#343A40] [&_p]:leading-[170%] [&_p]:mb-3 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-[8px] [&_img]:my-3 [&_a]:text-primary [&_a]:underline [&_a]:break-all [&_ul]:mb-3 [&_ol]:mb-3 [&_ul>li]:ml-5 [&_ol>li]:ml-5 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:bg-[#F8F9FA] [&_pre]:p-3 [&_pre]:rounded-[8px] [&_pre]:overflow-x-auto [&_code]:break-words [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#D9D9D9] [&_td]:p-2 [&_th]:border [&_th]:border-[#D9D9D9] [&_th]:p-2"
            dangerouslySetInnerHTML={{ __html: blogData.description }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogView;