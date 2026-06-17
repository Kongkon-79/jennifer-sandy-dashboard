import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import moment from "moment";
import { LandlordSubmission } from "./landlord-contact-data-type";

const LandlordContactView = ({
  open,
  onOpenChange,
  landlordData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landlordData: LandlordSubmission | null;
}) => {
  if (!landlordData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 space-y-4 bg-white !rounded-[12px]">
        <div className="space-y-4">
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Name :
            </strong>
            <br /> {landlordData?.firstName} {landlordData?.lastName}
          </p>
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Email :
            </strong>
            <br /> {landlordData?.email ? landlordData.email : "N/A"}
          </p>
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Phone Number :
            </strong>
            <br /> {landlordData?.phoneNumber ? landlordData.phoneNumber : "N/A"}
          </p>
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Property Address :
            </strong>
            <br /> {landlordData?.propertyAddress ? landlordData.propertyAddress : "N/A"}
          </p>
           <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Property Type :
            </strong>
            <br /> {landlordData?.propertyType ? landlordData.propertyType : "N/A"}
          </p>
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Messages :
            </strong>
            <br /> {landlordData?.message ? landlordData.message : "N/A"}
          </p>
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Status :
            </strong>
            <br /> {landlordData?.status}
          </p>
          <p className="text-base font-normal text-[#7D7D7D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Date :
            </strong>
            <br /> {moment(landlordData?.createdAt).format("MMM DD, YYYY")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LandlordContactView;
