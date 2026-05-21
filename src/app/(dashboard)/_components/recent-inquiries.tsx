import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const mockInquiries = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    property: "Skyline Luxury Apartments",
    date: "2026-03-02",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    property: "Modern Studio Midtown",
    date: "2026-03-02",
  },
  {
    id: 3,
    name: "Emma Williams",
    email: "emma.w@email.com",
    property: "Penthouse Suite",
    date: "2026-03-01",
  },
];

const RecentInquiries = () => {
  return (
    <div className="px-6 pb-6">
      <Card className="w-full border border-gray-200 bg-white shadow-[0px_2px_6px_0px_#0000000F] rounded-xl">
        <CardHeader className="pb-1 pt-5 px-5 flex flex-row items-center justify-between">
          <CardTitle className="text-[22px] leading-[120%] font-semibold text-[#2E2E2E]">
            Recent Inquiries
          </CardTitle>
          <Link
            href="#"
            className="text-sm font-medium text-primary hover:underline"
          >
            See all
          </Link>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-2">
          {mockInquiries.map((inquiry, index) => (
            <div
              key={inquiry.id}
              className={`grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-3 md:gap-4 items-center py-5 ${
                index !== mockInquiries.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <p className="text-[24px] md:text-[28px] leading-[120%] font-medium text-[#2F2F2F] font-hexco">
                {inquiry.name}
              </p>
              <p className="text-sm text-[#6F6F6F]">{inquiry.email}</p>
              <p className="text-sm text-[#5D5D5D]">{inquiry.property}</p>
              <p className="text-sm text-[#7A7A7A] justify-self-start md:justify-self-end">
                {inquiry.date}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentInquiries;
