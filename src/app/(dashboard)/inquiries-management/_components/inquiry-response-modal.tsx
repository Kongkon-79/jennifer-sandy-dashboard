"use client";

import { useEffect, useState } from "react";
import { Mail, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Inquiry } from "./inquiries-management-data-type";

interface InquiryResponseModalProps {
  inquiry: Inquiry | null;
  open: boolean;
  isSending: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (message: string) => void;
}

export default function InquiryResponseModal({
  inquiry,
  open,
  isSending,
  onOpenChange,
  onSend,
}: InquiryResponseModalProps) {
  const [message, setMessage] = useState("");
  const trimmed = message.trim();

  useEffect(() => {
    if (open) setMessage(inquiry?.responseMessage || "");
  }, [open, inquiry]);

  if (!inquiry) return null;

  return (
    <Dialog open={open} onOpenChange={isSending ? undefined : onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl border-[#e3ded6] bg-white p-0">
        <DialogHeader className="border-b border-[#eeeae4] px-6 py-5 text-left">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0ede8]">
            <Mail className="h-5 w-5 text-[#514b43]" />
          </div>
          <DialogTitle className="text-xl text-[#262626]">Reply to inquiry</DialogTitle>
          <DialogDescription className="text-[#6f7470]">
            The response will be emailed to the client and saved in their account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div className="grid gap-3 rounded-xl bg-[#f7f5f2] p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#8b8175]">Client</p>
              <p className="mt-1 font-semibold text-[#262626]">{inquiry.firstName} {inquiry.lastName}</p>
              <p className="text-sm text-[#6f7470]">{inquiry.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#8b8175]">Property</p>
              <p className="mt-1 font-semibold text-[#262626]">{inquiry.onOfficeId?.objekttitel || "Not specified"}</p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="inquiry-response" className="text-sm font-semibold text-[#262626]">Response message</label>
              <span className="text-xs text-[#8b8175]">{message.length}/2000</span>
            </div>
            <Textarea
              id="inquiry-response"
              value={message}
              maxLength={2000}
              rows={8}
              autoFocus
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write a clear and helpful response to the client..."
              className="min-h-44 resize-y border-[#d9d3ca] text-[#262626] focus-visible:ring-[#b5aa9a]"
            />
            {message.length > 0 && trimmed.length < 10 && (
              <p className="mt-2 text-sm text-red-600">Please enter at least 10 meaningful characters.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#eeeae4] bg-[#faf9f7] px-6 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" disabled={isSending} onClick={() => onOpenChange(false)} className="border-[#d9d3ca]">
            Cancel
          </Button>
          <Button type="button" disabled={isSending || trimmed.length < 10} onClick={() => onSend(trimmed)} className="gap-2 bg-[#514b43] text-white hover:bg-[#3e3933]">
            <Send className="h-4 w-4" />
            {isSending ? "Sending response..." : "Send response"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
