"use client";
import { Building2, List, MessageSquare, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DashboardOverviewSkeleton from "./dashboard-overview-skeleton";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import { useSession } from "next-auth/react";

export interface DashboardOverviewApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: DashboardOverviewData
}

export interface DashboardOverviewData {
  totalRevenew: number
  totalPlayers: number
  totalContact: number
  totalGk: number
}



export function DashboardOverview() {

  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, isError, error } = useQuery<DashboardOverviewApiResponse>({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/overview`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
      return await res.json()
    },
    enabled: !!token
  })

  console.log(data)

  let content;

  if (isLoading) {
    content = (
      <div className="p-6">
        <DashboardOverviewSkeleton />
      </div>
    );
  } else if (isError) {
    content = <div className="p-6">
      <ErrorContainer message={error?.message || "Something went wrong"} />
    </div>;
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">

        <div className="md:col-span-1 h-[128px] flex items-center justify-between bg-white border border-[#E6E7E6] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)]  px-4 rounded-[10px]">
          <div>
            <p className="text-base md:text-lg leading-[150%] font-medium text-[#8E938F]">
              Total Apartments
            </p>
            <p className="text-2xl md:text-[28px] lg:text-[32px] leading-[150%] text-primary font-bold pt-2">
             {data?.data?.totalRevenew || 248}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#DCE8F3] p-3 rounded-[8px]">
              <Building2 className="w-6 h-6 text-[#1273EA]" />
            </span>
          </div>
        </div>

        <div className="md:col-span-1 h-[128px] flex items-center justify-between bg-white border border-[#E6E7E6] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)]  px-4 rounded-[10px]">
          <div>
            <p className="text-base md:text-lg leading-[150%] font-medium text-[#8E938F]">
              Active Listings
            </p>
            <p className="text-2xl md:text-[28px] lg:text-[32px] leading-[150%] text-primary font-bold pt-2">
              {data?.data?.totalPlayers || 187}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#DCE8F3] p-3 rounded-[8px]">
              <List className="w-6 h-6 text-[#1273EA]" />
            </span>
          </div>
        </div>

        <div className="md:col-span-1 h-[128px] flex items-center justify-between bg-white border border-[#E6E7E6] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)]  px-4 rounded-[10px]">
          <div>
            <p className="text-base md:text-lg leading-[150%] font-medium text-[#8E938F]">
              New Inquiries
            </p>
            <p className="text-2xl md:text-[28px] lg:text-[32px] leading-[150%] text-primary font-bold pt-2">
              {data?.data?.totalContact || 248}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#DCE8F3] p-3 rounded-[8px]">
              <MessageSquare className="w-6 h-6 text-[#1273EA]" />
            </span>
          </div>
        </div>

        <div className="md:col-span-1 h-[128px] flex items-center justify-between bg-white border border-[#E6E7E6] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)]  px-4 rounded-[10px]">
          <div>
           <p className="text-base md:text-lg leading-[150%] font-medium text-[#8E938F]">
              Blog Articles
            </p>
            <p className="text-2xl md:text-[28px] lg:text-[32px] leading-[150%] text-primary font-bold pt-2">
              {data?.data?.totalGk || 248}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#DCE8F3] p-3 rounded-[8px]">
              <FileText className="w-6 h-6 text-[#1273EA]" />
            </span>
          </div>
        </div>

      </div> 
    );
  }



  return (
    <div className="">
      {content}

    </div>
  );
}
