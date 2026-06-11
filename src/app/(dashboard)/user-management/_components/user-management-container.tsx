"use client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteModal from "@/components/modals/delete-modal";
import ClaudePagination from "@/components/ui/claude-pagination";
import { Trash, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import moment from "moment";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/NotFound/NotFound";
import { toast } from "sonner";
import { AllUserApiResponse, User } from "./user-management-data-type";
import UserManagementView from "./user-management-view";

const UserManagementContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectViewContact, setSelectViewContact] = useState(false);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const [selectedContact, setSelectedContact] = useState<User | null>(
    null,
  );
  const [selectedContactId, setSelectedContactId] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error, isError } = useQuery<AllUserApiResponse>({
    queryKey: ["user-management", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user?page=${currentPage}&limit=8`,
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

  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 0;

  let content;

  if (isLoading) {
    content = (
      <div>
        <TableSkeletonWrapper count={5} />
      </div>
    );
  } else if (isError) {
    content = (
      <div>
        <ErrorContainer message={error?.message || "Something went wrong"} />
      </div>
    );
  } else if (data && data?.data && data?.data?.length === 0) {
    content = (
      <div>
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    );
  } else if (data && data?.data && data?.data?.length > 0) {
    content = (
      <Table className="">
        <TableHeader className="bg-[#E6F2FD] !rounded-t-[12px]">
          <TableRow className="">
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] py-4 pl-6">
              Name
            </TableHead>
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Email
            </TableHead>
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Joined
            </TableHead>
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Status
            </TableHead>
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-b border-x border-[#E6E7E6] !rounded-b-[12px]">
          {data?.data?.map((item, index) => {
            return (
              <TableRow key={index} className="">
                <TableCell className="text-base font-medium text-[#68706A] leading-[150%] pl-6 py-4">
                  {item?.firstName} {item?.lastName}
                </TableCell>
                <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                  {item?.email}
                </TableCell>
                <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                   {moment(item?.createdAt).format("MMM DD YYYY")}
                </TableCell>
                <TableCell className="w-[400px] text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                  {item?.status === "active" ? (
                    <span className="px-8 py-2 text-primary text-base font-medium leading-[150%] bg-[#E6F2FD]">
                      Active
                    </span>
                  ) : (
                    <span className="px-8 py-2 text-[#DEA400] text-base font-medium leading-[150%] bg-[#FEF8E6]">
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell className="h-full flex items-center justify-center gap-6 py-4">
                  <button
                    onClick={() => {
                      setSelectViewContact(true);
                      setSelectedContact(item);
                    }}
                    className="cursor-pointer mt-2"
                  >
                    <Eye className="h-6 w-6 text-primary" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setSelectedContactId(item?._id);
                    }}
                    className="cursor-pointer mt-2"
                  >
                    <Trash className="h-6 w-6 text-red-500" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  // delete contact api
  const { mutate } = useMutation({
    mutationKey: ["user-contact"],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["user-management"] });
    },
  });

  const handleDelete = () => {
    if (selectedContactId) {
      mutate(selectedContactId);
    }
    setDeleteModalOpen(false);
  };
  return (
    <div>
      {/* table container */}
      <div className="p-6 space-y-6">
        {/* table  */}
        <div>{content}</div>

        {/* pagination  */}
        {totalPages > 1 && (
          <div className="w-full flex items-center justify-between py-6">
            <p className="text-base font-normal text-[#68706A] leading-[150%]">
              Showing {currentPage} to 8 of {data?.meta?.total} results
            </p>
            <div>
              <ClaudePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}

        {/* delete modal  */}
        {deleteModalOpen && (
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Are You Sure?"
            desc="Are you sure you want to delete this User?"
          />
        )}

        {/* user view modal  */}
        <div>
          {selectViewContact && (
            <UserManagementView
              open={selectViewContact}
              onOpenChange={(open: boolean) => setSelectViewContact(open)}
              contactData={selectedContact}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementContainer;
