import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ContactItem } from "./contact-data-type";

const ContactManagementView = ({
  open,
  onOpenChange,
  contactData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactData: ContactItem | null;
}) => {
  if (!contactData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 space-y-4 bg-white !rounded-[12px]">

        <div className="space-y-4">
          <p className="text-base font-normal text-[#6C757D)] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">Name :</strong> <br/> {contactData?.fullName}
          </p>
          <p className="text-base font-normal text-[#6C757D)] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">Email :</strong> <br/> {contactData?.email}
          </p>
          <p className="text-base font-normal text-[#6C757D)] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">Phone Number :</strong> <br/> {contactData?.phone}
          </p>
          <p className="text-base font-normal text-[#6C757D)] leading-[150%]">
            <strong className="text-base font-semibold text-[#1E1E1E] leading-[150%]">Messages :</strong> <br/> {contactData?.message}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactManagementView;

