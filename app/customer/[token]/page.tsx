"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { validateCustomerToken } from "@/lib/customer-tokens";
import { CustomerToken } from "@/types";
import CustomerOrderForm from "@/components/CustomerOrderForm";
import InvalidTokenPage from "@/components/InvalidTokenPage";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerOrderPage() {
  const params = useParams();
  const token = params.token as string;
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState<CustomerToken | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);
  const [validationReason, setValidationReason] = useState<string>("");

  useEffect(() => {
    const validate = async () => {
      try {
        const validation = await validateCustomerToken(token);
        setIsValidToken(validation.isValid);
        setTokenData(validation.tokenData || null);
        setValidationReason(validation.reason || "");
      } catch (error) {
        console.error("Token validation error:", error);
        setIsValidToken(false);
        setValidationReason("Validation failed");
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      setLoading(false);
      return;
    }

    validate();
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return <InvalidTokenPage reason={validationReason} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-heading font-bold text-buzz-brown dark:text-buzz-cream">
          Place Your Order
        </h1>
        <p className="text-muted-foreground mt-2">
          Select your coffee and add-ons, then provide your details
        </p>
      </div>

      <CustomerOrderForm tokenData={tokenData!} onOrderSuccess={() => {}} />
    </div>
  );
}
