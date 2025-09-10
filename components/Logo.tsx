"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

interface LogoProps {
  variant?: "text" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({
  variant = "full",
  size = "md",
  className = "",
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Image
        src={variant === "text" ? "/textlogo.png" : "/darklogo.png"}
        alt="Buzz Coffee"
        width={variant === "text" ? 120 : 80}
        height={variant === "text" ? 32 : 80}
        className={`w-auto ${getSizeClass(size, variant)} ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "text") {
    return (
      <Image
        src="/textlogo.png"
        alt="Buzz Coffee"
        width={120}
        height={32}
        className={`w-auto ${getSizeClass(size, variant)} ${className}`}
      />
    );
  }

  return (
    <Image
      src={isDark ? "/lightlogo.png" : "/darklogo.png"}
      alt="Buzz Coffee"
      width={80}
      height={80}
      className={`w-auto ${getSizeClass(size, variant)} ${className}`}
    />
  );
}

function getSizeClass(
  size: "sm" | "md" | "lg",
  variant: "text" | "full"
): string {
  if (variant === "text") {
    switch (size) {
      case "sm":
        return "h-6";
      case "md":
        return "h-8";
      case "lg":
        return "h-12";
    }
  } else {
    switch (size) {
      case "sm":
        return "h-12";
      case "md":
        return "h-16";
      case "lg":
        return "h-20";
    }
  }
}
