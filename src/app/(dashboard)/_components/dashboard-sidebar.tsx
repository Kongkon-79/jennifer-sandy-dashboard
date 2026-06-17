"use client";
import {
  LayoutGrid,
  LogOut,
  Settings,
  RefreshCw,
  MessageSquare,
  FileText,
  MessageSquareText,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import LogoutModal from "@/components/modals/LogoutModal";
import { useState } from "react";
import { toast } from "sonner";

const items = [
  {
    title: "Dashboard Overview",
    url: "/",
    icon: LayoutGrid,
  },
  {
    title: "User Management",
    url: "/user-management",
    icon: Users,
  },
  {
    title: "CRM Sync Status",
    url: "/crm-sync-status",
    icon: RefreshCw,
  },
  {
    title: "Inquiries Management",
    url: "/inquiries-management",
    icon: MessageSquare,
  },
  {
    title: "Blog Management",
    url: "/blog-management",
    icon: FileText,
  },
  {
    title: "Contact Management",
    url: "/contact-management",
    icon: MessageSquareText,
  },
   {
    title: "Landlord Contact",
    url: "/landlord-contact",
    icon: MessageSquareText,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathName = usePathname();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handLogout = async () => {
    try {
      toast.success("Logout successful!");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <Sidebar className="border-none w-[312px]">
        <SidebarContent className="bg-[#ECECEC] scrollbar-hide border-r border-[#D9D9D9]">
          <SidebarGroup className="p-0">
            <div className="flex flex-col justify-between min-h-screen pb-6">
              <div>
                <div className="mt-8 mb-6 flex justify-center">
                  <Link href={`/`}>
                    <h1 className="text-[44px] leading-none text-[#1273EA] font-hexco font-semibold">
                      O21iwohnen
                    </h1>
                  </Link>
                </div>
                <SidebarGroupContent className="px-4 pt-1">
                  <SidebarMenu className="space-y-2">
                    {items.map((item) => {
                      const isActive =
                        item.url === "/"
                          ? pathName === "/"
                          : pathName === item.url ||
                            pathName.startsWith(`${item.url}/`);

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            className={`h-[46px] rounded-[6px] text-[15px] transition-all duration-200 ${
                              isActive
                                ? "bg-[#1273EA] hover:bg-[#1273EA] text-white hover:text-white font-semibold"
                                : "bg-transparent hover:bg-[#E3E3E3] text-[#777777] hover:text-[#555555] font-medium"
                            }`}
                            asChild
                          >
                            <Link href={item.url}>
                              <item.icon
                                className={`!w-[18px] !h-[18px] ${
                                  isActive ? "text-white" : "text-[#8A8A8A]"
                                }`}
                              />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </div>

              <div>
                <SidebarFooter className="px-4 pb-2">
                  <button
                    onClick={() => setLogoutModalOpen(true)}
                    className="h-[46px] w-full font-medium text-[#FF2D3B] hover:text-[#E32634] flex items-center gap-3 px-3 rounded-[6px] hover:bg-[#FFEFF1] transition-all duration-200 text-[22px] leading-none font-hexco"
                  >
                    <LogOut className="!w-[18px] !h-[18px]" /> Log out
                  </button>
                </SidebarFooter>
              </div>
            </div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handLogout}
        />
      )}
    </div>
  );
}
