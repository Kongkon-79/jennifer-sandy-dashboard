"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import ClaudePagination from "@/components/ui/claude-pagination";
import DeleteModal from "@/components/modals/delete-modal";
import CrmSyncModal from "@/components/modals/crm-sync-modal";
import { cn } from "@/lib/utils";

import crmImage from "../../../../../public/assets/images/crm.jpg"

import type {
  CrmSyncStatusItem,
  EstatesApiResponse,
  EstateItem,
} from "./crm-sync-data-type";

interface CrmSyncResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    synced: number;
    errors: number;
    deactivated: number;
    syncedAt: string;
  };
}

const itemsPerPage = 5;

const formatSyncDate = (syncedAt: string): string => {
  const date = new Date(syncedAt);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleDateString("en-US", options);
};

const formatDateShort = (syncedAt: string): string => {
  const date = new Date(syncedAt);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
};

const formatTimeShort = (syncedAt: string): string => {
  const date = new Date(syncedAt);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleDateString("en-US", options);
};

const getThumbnailUrl = (item: EstateItem): string => {
  if (item.titleImage?.url) {
    return item.titleImage.url;
  }
  if (item.images && item.images.length > 0) {
    return item.images[0].url;
  }
  return "";
};

const mapEstateToSyncItem = (estate: EstateItem): CrmSyncStatusItem => ({
  _id: estate._id,
  onofficeId: estate.onofficeId,
  apartmentName: estate.objekttitel,
  date: formatDateShort(estate.syncedAt),
  time: formatTimeShort(estate.syncedAt),
  updatedListings: estate.wohnflaeche,
  errors: 0,
  status: estate.isActive ? "success" : "failed",
  thumbnail: getThumbnailUrl(estate),
  slug: estate.slug,
});

const CrmSyncStatusContainer = () => {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [syncItems, setSyncItems] = useState<CrmSyncStatusItem[]>([]);
  const [isLoadingEstates, setIsLoadingEstates] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CrmSyncStatusItem | null>(
    null,
  );
  const [isConnected, setIsConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("—");
  const [totalSynced, setTotalSynced] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingSyncStatus, setIsLoadingSyncStatus] = useState(true);

  const fetchSyncStatus = useCallback(async () => {
    if (!token) return;

    setIsLoadingSyncStatus(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/sync/onoffice`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response: CrmSyncResponse = await res.json();

      setIsConnected(response.success);
      if (response.success && response.data) {
        setLastSyncTime(formatSyncDate(response.data.syncedAt));
        setTotalSynced(response.data.total);
      }
    } catch (error) {
      console.error("CRM sync status fetch error:", error);
      setIsConnected(false);
    } finally {
      setIsLoadingSyncStatus(false);
    }
  }, [token]);

  const fetchEstates = useCallback(async () => {
    if (!token) return;

    setIsLoadingEstates(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/onoffice/estates?limit=1000`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      const response: EstatesApiResponse = await res.json();

      if (response.success && Array.isArray(response.data)) {
        const mappedItems = response.data.map(mapEstateToSyncItem);
        setSyncItems(mappedItems);
      }
    } catch (error) {
      console.error("Estates fetch error:", error);
      toast.error("Failed to load estate data.");
    } finally {
      setIsLoadingEstates(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSyncStatus();
    fetchEstates();
  }, [fetchSyncStatus, fetchEstates]);

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
    if (!isSyncing) {
      setSyncModalOpen(true);
    }
  };

  const handleConfirmSync = async () => {
    setSyncModalOpen(false);
    setIsSyncing(true);
    setIsLoadingSyncStatus(true);
    setIsLoadingEstates(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/sync/onoffice`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response: CrmSyncResponse = await res.json();

      if (response?.success) {
        // Update stat cards immediately from sync response
        setIsConnected(true);
        if (response.data) {
          setLastSyncTime(formatSyncDate(response.data.syncedAt));
          setTotalSynced(response.data.total);
        }
        toast.success("CRM sync completed successfully.");
        // Refresh data in background to ensure everything is up-to-date
        await Promise.all([fetchSyncStatus(), fetchEstates()]);
      } else {
        toast.error(response?.message || "CRM sync failed.");
        setIsLoadingSyncStatus(false);
        setIsLoadingEstates(false);
      }
    } catch (error) {
      console.error("CRM sync error:", error);
      toast.error("CRM sync failed. Please try again.");
      setIsLoadingSyncStatus(false);
      setIsLoadingEstates(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleViewDetails = (item: CrmSyncStatusItem) => {
    router.push(`/crm-sync-status/${item._id}`);
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
              {isLoadingSyncStatus ? (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[#D9D9D9]" />
                  <div className="h-5 w-24 animate-pulse rounded-[4px] bg-[#E6E6E8]" />
                </div>
              ) : (
                <>
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      isConnected ? "bg-[#1FAF38]" : "bg-[#FF3B30]",
                    )}
                  />
                  <span className="text-base font-medium leading-[150%] text-[#343A40]">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-normal leading-[150%] text-[#68706A]">
              Last Sync Time
            </p>
            {isLoadingSyncStatus ? (
              <div className="mt-2 h-6 w-44 animate-pulse rounded-[4px] bg-[#E6E6E8]" />
            ) : (
              <p className="mt-2 text-base font-semibold leading-[150%] text-[#343A40]">
                {lastSyncTime}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-normal leading-[150%] text-[#68706A]">
              Total Synced Properties
            </p>
            {isLoadingSyncStatus ? (
              <div className="mt-2 h-6 w-28 animate-pulse rounded-[4px] bg-[#E6E6E8]" />
            ) : (
              <p className="mt-2 text-base font-semibold leading-[150%] text-[#343A40]">
                {totalSynced}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSyncNow}
            disabled={isSyncing || isLoadingEstates}
            className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-medium leading-[150%] text-white transition-colors hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <RefreshCcw className={cn("h-4 w-4", (isSyncing || isLoadingEstates) && "animate-spin")} />
            {isSyncing ? "Syncing..." : "Sync Now"}
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
                    Status
                  </th>
                  <th className="py-4 text-center text-sm font-normal leading-[150%] text-[#343A40]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="border-b border-x border-[#E6E7E6]">
                {isLoadingEstates ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-base font-normal text-[#68706A]">
                      Loading estate data...
                    </td>
                  </tr>
                ) : paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-base font-normal text-[#68706A]">
                      No data available.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item, index) => (
                    <tr
                      key={item._id}
                      className={cn(index !== paginatedItems.length - 1 && "border-b border-[#E6E7E6]")}
                    >
                      <td className="w-2/5 py-4 pl-6 align-middle">
                        <div className=" flex items-center gap-3">
                          {item.thumbnail ? (
                            <Image
                              src={item.thumbnail}
                              alt={item.apartmentName}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-[4px] object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = crmImage.src;
                              }}
                            />
                          ) : (
                            <Image
                              src={crmImage}
                              alt={item.apartmentName}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-[4px] object-cover"
                            />
                          )}
                          <span className="text-base font-normal leading-[150%] text-[#68706A]">
                            {item?.apartmentName}
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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