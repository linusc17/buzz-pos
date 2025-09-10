"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingButton from "./LoadingButton";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  confirmVariant?: "default" | "destructive";
  triggerVariant?:
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link";
}

export default function ConfirmModal({
  children,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  confirmVariant = "destructive",
}: ConfirmModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Error in confirmation action:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={handleConfirm}
            loading={loading}
            loadingText="Processing..."
            variant={confirmVariant}
          >
            {confirmText}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
