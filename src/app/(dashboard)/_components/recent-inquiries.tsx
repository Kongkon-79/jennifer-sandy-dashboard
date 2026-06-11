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
        <CardContent className="px-5 pb-5 pt-2">
          {mockInquiries.map((inquiry, index) => (
            <div
              key={inquiry.id}
              className={`grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-3 md:gap-4 items-center py-5 ${
                index !== mockInquiries.length - 1 ? "border-b border-[#E6E6E8]" : ""
              }`}
            >
              <p className="text-base leading-normal font-semibold text-[#343A40]">
                {inquiry.name}
              </p>
              <p className="text-sm text-[#68706A] font-normal leading-normal">{inquiry.email}</p>
              <p className="text-sm text-[#68706A] font-normal leading-normal">{inquiry.property}</p>
              <p className="text-sm text-[#68706A] font-normal leading-normal">
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
