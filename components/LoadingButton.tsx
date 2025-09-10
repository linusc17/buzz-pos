"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

export default function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  variant,
  size,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      disabled={loading || disabled}
      className={cn(className)}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? loadingText || children : children}
    </Button>
  );
}
