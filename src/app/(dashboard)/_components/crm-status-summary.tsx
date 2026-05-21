import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CrmStatusSummary() {
  return (
    <div className="px-6 pt-6">
      <Card className="border border-gray-200 bg-[#F6F6F6] rounded-xl shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-[32px] leading-[120%] font-semibold font-hexco text-[#2D2D2D]">
            CRM Status Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm text-[#7A7A7A]">
              Connection Status:{" "}
              <span className="inline-flex items-center rounded-full bg-[#E6F4E6] px-2.5 py-0.5 text-xs font-medium text-[#2B8A3E]">
                Connected
              </span>
            </p>
            <p className="text-sm text-[#5A5A5A]">Last Sync Date: March 3, 2026</p>
            <p className="text-sm text-[#5A5A5A]">Last Sync Time: 09:30 AM</p>
          </div>

          <Link
            href="#"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#2F80ED] px-5 text-sm font-medium text-white transition-colors hover:bg-[#1F6FD9]"
          >
            View Details
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
