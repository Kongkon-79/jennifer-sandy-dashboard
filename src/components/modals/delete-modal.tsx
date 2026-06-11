import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

import error from "../../../public/assets/images/error.png"

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  desc: string;
};

const DeleteModal = ({ isOpen, onClose, onConfirm, title, desc }: DeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[420px] bg-white !rounded-[12px]">
        <Image src={error} alt="error" width={100} height={100} className="w-12 h-12 object-contain"/>
        <DialogHeader className="">
          <DialogTitle className="text-lg font-medium leading-[150%] text-[#343A40]">{title}</DialogTitle>
          <DialogDescription className="text-base font-normal text-[#68706A] leading-[150%]">
            {desc}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full grid grid-cols-2 gap-5 mt-3">
          <div className="col-span-1">
            <button
              className="w-full text-base font-medium bg-[#F8F9FA] text-[#68706A] border border-[#E6E7E6] leading-[120%] py-[10px] px-5 rounded-[10px]"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
          <div className="col-span-1">
            <button
              className="w-full text-[#F8F9FA] bg-primary py-[10px] px-6 text-base font-medium leading-[120%] rounded-[8px]"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
