import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CrmSyncModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const CrmSyncModal = ({ isOpen, onClose, onConfirm }: CrmSyncModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[496px] !rounded-[12px] bg-[#F8F9FA] p-5 shadow-[0px_8px_8px_-4px_#10182808,0px_20px_24px_-4px_#10182814] backdrop-blur-sm">
     

        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-lg font-semibold leading-[150%] text-[#343A40]">
            Confirm Sync
          </DialogTitle>
          <DialogDescription className="text-sm font-normal leading-[150%] text-[#68706A]">
            Are you sure you want to sync with the CRM system now?
            This will update all property listings with the latest data.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid w-full grid-cols-2 gap-2 pt-1 sm:justify-stretch">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-[8px] border border-[#E6E7E6] bg-white text-sm font-medium leading-[150%] text-[#68706A] transition-colors hover:bg-[#F8F9FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-[8px] bg-primary text-sm font-medium leading-[150%] text-white transition-colors hover:bg-primary/90"
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrmSyncModal;
