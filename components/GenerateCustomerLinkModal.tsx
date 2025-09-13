"use client";

import { useState } from "react";
import { createCustomerToken } from "@/lib/customer-tokens";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, Link, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface GenerateCustomerLinkModalProps {
  children: React.ReactNode;
}

export default function GenerateCustomerLinkModal({
  children,
}: GenerateCustomerLinkModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [expirationHours, setExpirationHours] = useState(48);

  const handleGenerateLink = async () => {
    if (!user) {
      toast.error("You must be logged in to generate links");
      return;
    }

    setLoading(true);
    try {
      const token = await createCustomerToken(
        user.uid,
        customerName.trim() || undefined,
        customerPhone.trim() || undefined,
        customerAddress.trim() || undefined,
        expirationHours
      );

      const link = `${window.location.origin}/customer/${token}`;
      setGeneratedLink(link);
      toast.success("Customer link generated successfully!");
    } catch {
      toast.error("Error generating link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setGeneratedLink("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setExpirationHours(48);
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Generate Customer Link
          </DialogTitle>
          <DialogDescription>
            Create a one-time use link for a customer to place their order.
          </DialogDescription>
        </DialogHeader>

        {!generatedLink ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Pre-fill customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number (Optional)</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Pre-fill phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerAddress">Address (Optional)</Label>
              <Input
                id="customerAddress"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Pre-fill address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationHours">
                Link Expires After (Hours)
              </Label>
              <Input
                id="expirationHours"
                type="number"
                min="1"
                max="168"
                value={expirationHours}
                onChange={(e) => setExpirationHours(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Link will expire after this many hours OR when the customer
                places an order
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerateLink} disabled={loading}>
                {loading ? "Generating..." : "Generate Link"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Link Generated Successfully!
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Customer Link:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={generatedLink}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyLink}
                        className="shrink-0"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Link expires in {expirationHours} hours</p>
                    <p>• Single use - becomes invalid after order placement</p>
                    <p>
                      • Customer will need to enter their details to complete
                      order
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleCopyLink}>
                <Link className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
