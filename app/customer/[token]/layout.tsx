import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-buzz-cream dark:bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-4">
            <Image
              src="/textlogo.png"
              alt="Buzz Coffee"
              width={120}
              height={32}
              className="h-8 w-auto dark:invert dark:sepia dark:saturate-[0.2] dark:hue-rotate-[15deg] dark:brightness-[1.1]"
            />
          </div>
        </div>
      </div>

      {children}
      <Toaster />
    </div>
  );
}
