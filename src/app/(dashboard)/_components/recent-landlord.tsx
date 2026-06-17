"use client";
import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import type { LandlordSubmissionsApiResponse, LandlordSubmission } from "../landlord-contact/_component/landlord-contact-data-type";

const RecentLandlords = () => {
  const limit = 3;
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, isError } = useQuery<LandlordSubmissionsApiResponse>({
    queryKey: ["recent-landlords"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/landlord?page=1&limit=${limit}`,
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

  const landlords = data?.data ?? [];

  let content;

  if (isLoading) {
    content = (
      <div className="space-y-4">
        {Array.from({ length: limit }).map((_, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-[1.2fr_1fr_auto] gap-3 md:gap-4 items-center py-5 ${
              index !== limit - 1 ? "border-b border-[#E6E6E8]" : ""
            }`}
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  } else if (isError) {
    content = (
      <div className="py-8 text-center">
        <p className="text-sm text-[#FF3B30] font-normal leading-normal">
          Failed to load landlords.
        </p>
      </div>
    );
  } else if (landlords.length === 0) {
    content = (
      <div className="py-8 text-center">
        <p className="text-sm text-[#68706A] font-normal leading-normal">
          No landlords available.
        </p>
      </div>
    );
  } else {
    content = (
      <>
        {landlords.map((landlord: LandlordSubmission, index: number) => (
          <div
            key={landlord._id}
            className={`grid grid-cols-1 md:grid-cols-[1.2fr_1fr_auto] gap-3 md:gap-4 items-center py-5 ${
              index !== landlords.length - 1 ? "border-b border-[#E6E6E8]" : ""
            }`}
          >
            <p className="text-base leading-normal font-semibold text-[#4c4e50] truncate">
              {landlord.firstName} {landlord.lastName}
            </p>
            <p className="text-sm text-[#68706A] font-normal leading-normal truncate">
              {landlord.email}
            </p>
            <p className="text-sm text-[#68706A] font-normal leading-normal whitespace-nowrap">
              {moment(landlord.createdAt).format("YYYY-MM-DD")}
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
            Recent Landlords
          </CardTitle>
          <Link
            href="/landlord-contact"
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

export default RecentLandlords;