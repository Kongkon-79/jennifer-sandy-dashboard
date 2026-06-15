"use client";
import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import type { AllInquiryApiResponse, Inquiry } from "../inquiries-management/_components/inquiries-management-data-type";

interface RecentInquiriesProps {
  limit?: number;
}

const RecentInquiries = ({ limit = 5 }: RecentInquiriesProps) => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, isError } = useQuery<AllInquiryApiResponse>({
    queryKey: ["recent-inquiries"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/inquiry?page=1&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.json();
    },
    enabled: !!token,
  });

  const inquiries = data?.data ?? [];

  let content;

  if (isLoading) {
    content = (
      <div className="space-y-4">
        {Array.from({ length: limit }).map((_, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-3 md:gap-4 items-center py-5 ${
              index !== limit - 1 ? "border-b border-[#E6E6E8]" : ""
            }`}
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  } else if (isError) {
    content = (
      <div className="py-8 text-center">
        <p className="text-sm text-[#FF3B30] font-normal leading-normal">
          Failed to load inquiries.
        </p>
      </div>
    );
  } else if (inquiries.length === 0) {
    content = (
      <div className="py-8 text-center">
        <p className="text-sm text-[#68706A] font-normal leading-normal">
          No inquiries available.
        </p>
      </div>
    );
  } else {
    content = (
      <>
        {inquiries.map((inquiry: Inquiry, index: number) => (
          <div
            key={inquiry._id}
            className={`grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-3 md:gap-4 items-center py-5 ${
              index !== inquiries.length - 1 ? "border-b border-[#E6E6E8]" : ""
            }`}
          >
            <p className="text-base leading-normal font-semibold text-[#343A40] truncate">
              {inquiry.firstName} {inquiry.lastName}
            </p>
            <p className="text-sm text-[#68706A] font-normal leading-normal truncate">
              {inquiry.email}
            </p>
            <p className=" text-sm text-[#68706A] font-normal leading-normal truncate">
              {inquiry.onOfficeId?.objekttitel || "N/A"}
            </p>
            <p className="text-sm text-[#68706A] font-normal leading-normal whitespace-nowrap">
              {moment(inquiry.createdAt).format("YYYY-MM-DD")}
            </p>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="px-6 pb-6">
      <Card className="w-full border border-[#E6E6E8] bg-white">
        <CardHeader className="pb-1 pt-5 px-5 flex flex-row items-center justify-between">
          <CardTitle className="text-lg leading-normal font-semibold text-[#343A40]">
            Recent Inquiries
          </CardTitle>
          <Link
            href="/inquiries-management"
            className="text-sm font-medium leading-normal text-primary hover:underline"
          >
            See all
          </Link>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-2">{content}</CardContent>
      </Card>
    </div>
  );
};

export default RecentInquiries;