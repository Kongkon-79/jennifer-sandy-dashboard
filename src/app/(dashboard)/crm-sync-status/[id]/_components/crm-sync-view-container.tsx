"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MapPin, CheckCircle2, XCircle, AlertCircle, Loader2, X, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type {
  EstateImage,
  EstateItem,
} from "../../_components/crm-sync-data-type";
import crmImage from "../../../../../../public/assets/images/crm.jpg";
import { toast } from "sonner";

const availabilityText = (estate: EstateItem) => {
  if (estate.verfuegbarAbText) return estate.verfuegbarAbText;
  if (!estate.verfuegbar_ab) return "Availability on request";
  const date = new Date(estate.verfuegbar_ab);
  return Number.isNaN(date.getTime()) ? "Availability on request" : `Available from ${date.toLocaleDateString("de-DE", { timeZone: "Europe/Berlin" })}`;
};

const amenityLabels: Record<string, string> = {
  furnished: "Furnished", transportationParking: "Transportation & parking", wifi: "Wi-Fi",
  elevator: "Elevator", fittedKitchen: "Fitted kitchen", emergencyAlertSystem: "Emergency alert system",
  moveInCoordination: "Move-in coordination", mealPreparationService: "Meal preparation and service",
  petFriendly: "Pet-friendly", balcony: "Balcony",
};

const CrmSyncViewContainer = () => {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [estate, setEstate] = useState<EstateItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>();
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);

  const fetchEstateDetails = useCallback(async () => {
    if (!token || !id) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/onoffice/admin/estates/${id}`,
        { method: "GET", headers: { accept: "*/*", Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error(`Estate request failed with status ${res.status}`);
      const response = await res.json();
      if (response.success && response.data) setEstate(response.data);
      else setError("Failed to load estate data.");
    } catch (err) {
      console.error("Estate fetch error:", err);
      setError("An error occurred while loading estate details.");
    } finally {
      setIsLoading(false);
    }
  }, [token, id]);

  const toggleVisibility = async () => {
    if (!estate || !token) return;
    setIsUpdatingVisibility(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/onoffice/estates/${estate._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isManuallyHidden: !estate.isManuallyHidden }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.message || "Visibility update failed");
      setEstate(body.data);
      toast.success(body.data.isManuallyHidden ? "Property hidden from website" : "Property published on website");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Visibility update failed");
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  useEffect(() => {
    fetchEstateDetails();
  }, [fetchEstateDetails]);

  const galleryImages: EstateImage[] = estate
    ? [estate.titleImage, ...(estate.images || [])]
        .filter((image): image is EstateImage => Boolean(image?.url))
        .filter(
          (image, index, arr) =>
            arr.findIndex((entry) => entry.url === image.url) === index
        )
    : [];

  const currentImage = galleryImages[selectedImageIndex];

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [estate?._id]);

  useEffect(() => {
    if (!thumbnailApi) return;
    thumbnailApi.scrollTo(selectedImageIndex);
  }, [selectedImageIndex, thumbnailApi]);

  const selectImage = (index: number) => setSelectedImageIndex(index);
  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => setIsLightboxOpen(false);

  const goToPrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Loading estate details...</p>
        </div>
      </div>
    );
  }

  if (error || !estate) {
    return (
      <div className="p-6">
        <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:opacity-80">
          <ArrowLeft className="h-4 w-4" /> Back to CRM Sync Status
        </button>
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <p className="text-xl font-semibold">{error || "Estate not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-12">
      <div className="mx-auto max-w-6xl px-4 pt-6 md:px-6">
        <div className="overflow-hidden rounded-[14px] border border-[#D9E8FF] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            onClick={() => currentImage && openLightbox(selectedImageIndex)}
            className="relative block h-[240px] w-full overflow-hidden bg-[#F3F6FB] text-left sm:h-[320px] lg:h-[430px]"
          >
            {currentImage?.url ? (
              <img
                src={currentImage.url}
                alt={currentImage.title || estate.objekttitel || "Property image"}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = crmImage.src;
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Image src={crmImage} alt="Property" width={180} height={180} className="opacity-50" />
              </div>
            )}
          </button>

          {galleryImages.length > 1 && (
            <div className="border-t border-[#E6E7E6] bg-white p-3 md:p-4">
              <Carousel
                setApi={setThumbnailApi}
                opts={{ align: "start", containScroll: "trimSnaps", dragFree: true }}
                className="w-full"
              >
                <CarouselContent className="-ml-3">
                  {galleryImages.map((img, idx) => (
                    <CarouselItem
                      key={img.id || `${img.url}-${idx}`}
                      className="basis-1/2 pl-3 sm:basis-1/3 lg:basis-1/4"
                    >
                      <button
                        type="button"
                        onClick={() => selectImage(idx)}
                        className={cn(
                          "group relative h-[72px] w-full overflow-hidden rounded-[10px] border-2 bg-[#F3F6FB] transition-all duration-200 sm:h-[88px] lg:h-[96px]",
                          selectedImageIndex === idx
                            ? "border-[#2F80ED] ring-2 ring-[#BFDBFE]"
                            : "border-transparent hover:border-[#93C5FD]"
                        )}
                      >
                        <img
                          src={img.url}
                          alt={img.title || `Property image ${idx + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = crmImage.src;
                          }}
                        />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 top-1/2 h-9 w-9 -translate-y-1/2 border-[#D9E8FF] bg-white text-[#1E3A8A] shadow-md hover:bg-[#F8FBFF]" />
                <CarouselNext className="right-2 top-1/2 h-9 w-9 -translate-y-1/2 border-[#D9E8FF] bg-white text-[#1E3A8A] shadow-md hover:bg-[#F8FBFF]" />
              </Carousel>
            </div>
          )}
        </div>
        <div className="relative z-10 px-0 pt-6">
          <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-xl font-semibold leading-tight text-[#1E3A8A]">
                  {estate.objekttitel || "Property"}
                </h1>
                {(estate.ort || estate.strasse) && (
                  <p className="mt-4 flex items-center gap-3 text-lg text-gray-600">
                    <MapPin className="h-6 w-6" />
                    {[estate.strasse, estate.hausnummer, estate.plz, estate.ort]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>

              <div className="flex-shrink-0">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold",
                    estate.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {estate.isActive && !estate.isManuallyHidden ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  {estate.isActive && !estate.isManuallyHidden ? "Visible on website" : "Hidden from website"}
                </span>
                <button type="button" onClick={toggleVisibility} disabled={isUpdatingVisibility || !estate.isActive} className="mt-3 flex items-center gap-2 rounded-lg bg-[#d1c9be] px-4 py-2 text-sm font-semibold text-[#262626] disabled:cursor-not-allowed disabled:opacity-50">
                  {estate.isManuallyHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {isUpdatingVisibility ? "Updating..." : estate.isManuallyHidden ? "Publish on website" : "Hide from website"}
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-700">
              {estate.wohnflaeche && (
                <span>
                  <strong>{estate.wohnflaeche} m²</strong>
                </span>
              )}
              {estate.anzahl_zimmer && (
                <span>
                  <strong>{estate.anzahl_zimmer} Rooms</strong>
                </span>
              )}
              {estate.amenities?.balcony && <span><strong>Balcony</strong></span>}
              <span>{availabilityText(estate)}</span>
              {estate.rentalStatusLabel && <span>{estate.rentalStatusLabel}</span>}
            </div>
            <div className="mt-8 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["onOffice ID", estate.onofficeId],
                ["Price", estate.priceLabel || estate.price || "—"],
                ["All-inclusive rent", estate.miete_pauschal || "—"],
                ["Cold rent", estate.kaltmiete || "—"],
                ["Warm rent", estate.warmmiete || "—"],
                ["Purchase price", estate.kaufpreis || "—"],
                ["Deposit", estate.kaution || "—"],
                ["Additional costs", estate.nebenkosten || "—"],
                ["Marketing", estate.vermarktungsart || "—"],
                ["Property type", estate.objekttyp || estate.objektart || "—"],
                ["CRM status", estate.status2Label || "—"],
                ["Map permission", estate.showGoogleMap ? "Allowed" : "Not allowed"],
              ].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-[#f5f3ef] p-4"><p className="text-xs uppercase tracking-wide text-[#8b8175]">{label}</p><p className="mt-1 font-semibold text-[#262626]">{String(value)}</p></div>)}
            </div>
          </div>

          {(estate.lage || estate.ausstatt_beschr) && <div className="mb-10 grid gap-6 md:grid-cols-2">
            {estate.lage && <section className="rounded-3xl bg-white p-8 shadow"><h2 className="mb-4 text-2xl font-semibold">Location</h2><p className="whitespace-pre-line leading-7 text-gray-600">{estate.lage}</p></section>}
            {estate.ausstatt_beschr && <section className="rounded-3xl bg-white p-8 shadow"><h2 className="mb-4 text-2xl font-semibold">Furnishing</h2><p className="whitespace-pre-line leading-7 text-gray-600">{estate.ausstatt_beschr}</p></section>}
          </div>}

          <div className="mb-10 rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-5 text-2xl font-semibold text-gray-900">
              Description
            </h2>
            <p className="whitespace-pre-line text-[17px] leading-relaxed text-gray-600">
              {estate.objektbeschreibung || "No property description has been provided."}
            </p>
          </div>

          <div className="mb-10 rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-8 text-2xl font-semibold text-gray-900">
              Amenities
            </h2>
            <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
              <div className="space-y-6">
                {Object.entries(estate.amenities || {}).filter(([key, enabled]) => enabled === true && amenityLabels[key]).map(([key]) => (
                  <div key={key} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="pt-1 font-medium">{amenityLabels[key]}</p>
                  </div>
                ))}
              </div>
              {!Object.values(estate.amenities || {}).some((enabled) => enabled === true) && <p className="text-gray-600">No confirmed amenities have been provided.</p>}
            </div>
          </div>

          {Boolean(estate.whyChoose?.length) && <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Property highlights
            </h2>
            <ul className="space-y-4 text-gray-600">
              {estate.whyChoose?.map((text, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600" />
                  {text}
                </li>
              ))}
            </ul>
          </div>}
        </div>
      </div>

      {/* ==================== LIGHTBOX MODAL ==================== */}
      {isLightboxOpen && galleryImages[selectedImageIndex] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" onClick={closeLightbox}>
          <div className="relative max-w-5xl w-full px-4" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Main Image */}
            <div className="relative aspect-[16/10] bg-black rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={galleryImages[selectedImageIndex].url}
                alt={galleryImages[selectedImageIndex].title || "Property Image"}
                className="h-full w-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = crmImage.src; }}
              />
            </div>

            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1.5 rounded-full text-sm">
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmSyncViewContainer;
