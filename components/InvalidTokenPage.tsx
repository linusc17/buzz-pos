"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvalidTokenPageProps {
  reason?: string;
}

export default function InvalidTokenPage({ reason }: InvalidTokenPageProps) {
  const handleInstagramClick = () => {
    window.open("https://instagram.com/beanbuzzph", "_blank");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-amber-500" />
          </div>
          <CardTitle className="text-2xl text-foreground">
            Order Link Expired
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-muted-foreground text-lg">
              This link has expired or has already been used.
            </p>
            <p className="text-foreground font-medium">
              To place your order, please message us on Instagram:
            </p>
          </div>

          <Button
            onClick={handleInstagramClick}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3"
          >
            <Instagram className="h-5 w-5 mr-2" />
            @beanbuzzph
          </Button>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              We&apos;ll help you place your order and can create a new link if
              needed.
            </p>
          </div>

          {reason && (
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              Reason: {reason}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
