import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CrmStatusSummary() {
  return (
    <div className="px-6">
      <Card className=" bg-white rounded-xl shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg leading-[120%] font-semibold text-[#343A40]">
            CRM Status Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm text-[#68706A] font-normal leading-normal">
              Connection Status:{" "}
              <span className="inline-flex items-center rounded-full bg-[#EAF9F1] px-2.5 py-0.5 leading-normal text-xs font-medium text-[#008236]">
                Connected
              </span>
            </p>
            <p className="text-sm text-[#68706A] font-normal leading-normal">
              Last Sync Date: <span className="font-medium text-[#343A40]">March 3, 2026</span> 
            </p>
            <p className="text-sm text-[#68706A] font-normal leading-normal">
              Last Sync Time: <span className="font-medium text-[#343A40]">09:30 AM</span>
            </p>
          </div>

          <Link
            href="/crm-sync-status"
            className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#0678EF] px-5 text-sm font-semibold leading-normal text-[#F8F9FA] transition-colors hover:bg-[#1F6FD9]"
          >
            View Details
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
