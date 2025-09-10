"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { parseFirebaseError } from "@/lib/firebase-errors";
import LoadingButton from "@/components/LoadingButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! Successfully signed in.");
      router.push("/dashboard");
    } catch (error) {
      const errorMessage = parseFirebaseError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center gap-4 mb-4">
              <Image
                src="/darklogo.png"
                alt="Buzz Coffee"
                width={80}
                height={80}
                className="h-20 w-auto dark:hidden"
              />
              <Image
                src="/lightlogo.png"
                alt="Buzz Coffee"
                width={80}
                height={80}
                className="h-20 w-auto hidden dark:block"
              />
              <CardTitle className="text-2xl font-heading font-bold text-buzz-brown dark:text-buzz-cream">
                Buzz Coffee
              </CardTitle>
            </div>
            <CardDescription>Admin Login</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(""); // Clear error when user types
                  }}
                  placeholder="Enter your email"
                  className={
                    error ? "border-red-500 focus-visible:ring-red-500" : ""
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(""); // Clear error when user types
                  }}
                  className={
                    error ? "border-red-500 focus-visible:ring-red-500" : ""
                  }
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <LoadingButton
                type="submit"
                className="w-full"
                loading={loading}
                loadingText="Signing In..."
              >
                Sign In
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
