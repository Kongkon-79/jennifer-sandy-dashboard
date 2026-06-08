"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Eye, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import ClaudePagination from "@/components/ui/claude-pagination";
import DeleteModal from "@/components/modals/delete-modal";
import CrmSyncModal from "@/components/modals/crm-sync-modal";
import { cn } from "@/lib/utils";

import crmImage from "../../../../../public/assets/images/crm.jpg"

import type { CrmSyncStatusItem } from "./crm-sync-data-type";

const itemsPerPage = 5;

const mockCrmSyncItems: CrmSyncStatusItem[] = Array.from(
  { length: 12 },
  (_, index) => ({
    _id: `crm-sync-${index + 1}`,
    apartmentName: [
      "Skyline Luxury Apartments",
      "Modern Studio Midtown",
      "Penthouse Suite",
      "Garden View Apartment",
      "Waterfront Condo",
      "Riverside Residence",
      "Urban Nest",
      "Sunset Lofts",
      "Harbor Heights",
      "Metro Villas",
      "Lakeside Retreat",
      "City Edge Homes",
    ][index],
    date: [
      "2026-03-03",
      "2026-03-02",
      "2026-03-01",
      "2026-02-29",
      "2026-02-28",
      "2026-02-27",
      "2026-02-26",
      "2026-02-25",
      "2026-02-24",
      "2026-02-23",
      "2026-02-22",
      "2026-02-21",
    ][index],
    time: [
      "09:30 AM",
      "01:15 PM",
      "10:00 AM",
      "04:45 PM",
      "11:30 PM",
      "08:20 AM",
      "07:05 PM",
      "03:40 PM",
      "12:10 PM",
      "06:50 AM",
      "02:25 PM",
      "05:55 PM",
    ][index],
    updatedListings: [12, 8, 15, 20, 0, 9, 6, 14, 10, 7, 18, 11][index],
    errors: [0, 0, 2, 0, 1, 0, 1, 0, 0, 3, 0, 1][index],
    status: index === 3 ? "failed" : "success",
    thumbnail: "/assets/images/blog.png",
  }),
);

const CrmSyncStatusContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [syncItems, setSyncItems] = useState(mockCrmSyncItems);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CrmSyncStatusItem | null>(
    null,
  );

  const totalPages = Math.max(1, Math.ceil(syncItems.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return syncItems.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, syncItems]);

  const showingStart = syncItems.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingEnd = Math.min(currentPage * itemsPerPage, syncItems.length);

  const handleSyncNow = () => {
    setSyncModalOpen(true);
  };

  const handleConfirmSync = () => {
    setSyncModalOpen(false);
    toast.success("CRM sync started.");
  };

  const handleViewDetails = (item: CrmSyncStatusItem) => {
    toast.info(`Details for ${item.apartmentName} will be added later.`);
  };

  const handleDelete = () => {
    if (!selectedItem) {
      return;
    }

    setSyncItems((currentItems) =>
      currentItems.filter((item) => item._id !== selectedItem._id),
    );
    toast.success("Sync record removed.");
    setDeleteModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6">
      <div className="rounded-[12px] bg-white p-4 md:p-6 shadow-[0_0_0_1px_rgba(230,231,230,0.7)]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm font-normal leading-[150%] text-[#68706A]">
              Connection Status
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1FAF38]" />
              <span className="text-base font-medium leading-[150%] text-[#343A40]">
                Connected
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-normal leading-[150%] text-[#68706A]">
              Last Sync Time
            </p>
            <p className="mt-2 text-base font-semibold leading-[150%] text-[#343A40]">
              March 3, 2026 09:30 AM
            </p>
          </div>

          <div>
            <p className="text-sm font-normal leading-[150%] text-[#68706A]">
              Total Synced Properties
            </p>
            <p className="mt-2 text-base font-semibold leading-[150%] text-[#343A40]">
              248
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSyncNow}
            className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-medium leading-[150%] text-white transition-colors hover:bg-primary/90"
          >
            <RefreshCcw className="h-4 w-4" />
            Sync Now
          </button>
        </div>
      </div>

      {syncModalOpen && (
        <CrmSyncModal
          isOpen={syncModalOpen}
          onClose={() => setSyncModalOpen(false)}
          onConfirm={handleConfirmSync}
        />
      )}

      <div className="mt-6">
        <h2 className="mb-4 text-base font-semibold leading-[150%] text-[#343A40]">
          CRM Sync Status
        </h2>

        <div className="overflow-hidden rounded-[12px] border border-[#E6E7E6] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <thead className="bg-[#E6F2FD]">
                <tr>
                  <th className="py-4 pl-6 text-left text-sm font-normal leading-[150%] text-[#343A40]">
                    Apartment Name
                  </th>
                  <th className="py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                    Date
                  </th>
                  <th className="py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                    Time
                  </th>
                  <th className="py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                    Updated Listings
                  </th>
                  <th className="py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                    Errors
                  </th>
                  <th className="py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                    Details
                  </th>
                  <th className="py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                    Status
                  </th>
                  <th className="py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="border-b border-x border-[#E6E7E6]">
                {paginatedItems.map((item, index) => (
                  <tr
                    key={item._id}
                    className={cn(index !== paginatedItems.length - 1 && "border-b border-[#E6E7E6]")}
                  >
                    <td className="py-4 pl-6 align-middle">
                      <div className="flex items-center gap-3">
                        <Image
                          src={crmImage}
                          alt={item.apartmentName}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-[4px] object-cover"
                        />
                        <span className="text-base font-normal leading-[150%] text-[#68706A]">
                          {item.apartmentName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center text-base font-normal leading-[150%] text-[#68706A]">
                      {item.date}
                    </td>
                    <td className="py-4 text-center text-base font-normal leading-[150%] text-[#68706A]">
                      {item.time}
                    </td>
                    <td className="py-4 text-center text-base font-normal leading-[150%] text-[#68706A]">
                      {item.updatedListings}
                    </td>
                    <td className="py-4 text-center text-base font-normal leading-[150%] text-[#68706A]">
                      {item.errors}
                    </td>
                    <td className="py-4 text-center text-base font-normal leading-[150%] text-[#68706A]">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(item)}
                        className="font-normal text-[#68706A] underline underline-offset-2 hover:text-[#343A40]"
                      >
                        See Details
                      </button>
                    </td>
                    <td className="py-4 text-center align-middle">
                      <span
                        className={cn(
                          "inline-flex min-w-[88px] justify-center rounded-[4px] px-4 py-2 text-sm font-medium leading-[150%]",
                          item.status === "success"
                            ? "bg-[#E6F2FD] text-primary"
                            : "bg-[#FDECEF] text-[#FF3B30]",
                        )}
                      >
                        {item.status === "success" ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td className="py-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(item)}
                          className="text-primary transition-colors hover:opacity-80"
                          aria-label={`View details for ${item.apartmentName}`}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedItem(item);
                            setDeleteModalOpen(true);
                          }}
                          className="text-[#FF3B30] transition-colors hover:opacity-80"
                          aria-label={`Delete ${item.apartmentName}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {syncItems.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 px-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-normal leading-[150%] text-[#68706A]">
              Showing {showingStart} to {showingEnd} of {syncItems.length} results
            </p>
           <div>
             <ClaudePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
           </div>
          </div>
        )}
      </div>

      {deleteModalOpen && selectedItem && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedItem(null);
          }}
          onConfirm={handleDelete}
          title="Delete sync record?"
          desc="Are you sure you want to remove this CRM sync status record?"
        />
      )}
    </div>
  );
};

export default CrmSyncStatusContainer;
