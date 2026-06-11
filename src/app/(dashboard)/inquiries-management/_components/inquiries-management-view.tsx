import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Inquiry } from "./inquiries-management-data-type";
import moment from "moment";

const InquiriesManagementView = ({
  open,
  onOpenChange,
  contactData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactData: Inquiry | null;
}) => {
  if (!contactData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 space-y-4 bg-white !rounded-[12px]">
        <div className="space-y-4">
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Inquiry ID :
            </strong>
            <br /> {contactData?._id}
          </p>
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Name :
            </strong>
            <br /> {contactData?.firstName} {contactData?.lastName}
          </p>
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Email :
            </strong>
            <br /> {contactData?.email}
          </p>
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Phone Number :
            </strong>
            <br /> {contactData?.phoneNumber}
          </p>
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Property :
            </strong>
            <br /> {contactData?.onOfficeId?.objekttitel}
          </p>
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Messages :
            </strong>
            <br /> {contactData?.message}
          </p>
          <p className="text-base font-normal text-[#6C757D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Status :
            </strong>
            <br /> {contactData?.status}
          </p>
          <p className="text-base font-normal text-[#7D7D7D] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">
              Joined Date :
            </strong>
            <br /> {moment(contactData?.createdAt).format("MMM DD, YYYY")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InquiriesManagementView;
