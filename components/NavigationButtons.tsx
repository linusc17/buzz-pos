"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "./LoadingButton";

interface NavigationButtonsProps {
  buttons: Array<{
    label: string;
    href: string;
    variant?: "default" | "outline" | "secondary";
  }>;
}

export default function NavigationButtons({ buttons }: NavigationButtonsProps) {
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  const router = useRouter();

  const handleNavigation = async (href: string, label: string) => {
    setLoadingButton(label);

    await new Promise((resolve) => setTimeout(resolve, 100));

    router.push(href);

    setTimeout(() => {
      setLoadingButton(null);
    }, 500);
  };

  return (
    <>
      {buttons.map((button) => (
        <LoadingButton
          key={button.label}
          onClick={() => handleNavigation(button.href, button.label)}
          loading={loadingButton === button.label}
          variant={button.variant || "outline"}
        >
          {button.label}
        </LoadingButton>
      ))}
    </>
  );
}
