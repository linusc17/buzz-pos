"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebase-client";
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
import { LogOut } from "lucide-react";
import { toast } from "sonner";

interface SignOutModalProps {
  children?: React.ReactNode;
  variant?:
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link";
}

export default function SignOutModal({
  children,
  variant = "outline",
}: SignOutModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
      setOpen(false);
      toast.success("Successfully signed out. See you next time!");
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={variant}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out? You&apos;ll need to log in again
            to access the POS system.
          </DialogDescription>
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
            onClick={handleSignOut}
            loading={loading}
            loadingText="Signing Out..."
            variant="destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
