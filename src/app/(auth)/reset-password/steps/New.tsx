"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
interface Propsval {
  onNext: () => void;
}

function   New({ onNext }: Propsval) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const {toast} = useToast();
  // Extract token from URL
  const token = searchParams ? searchParams.get("token") : null;
  const router = useRouter();




  useEffect(() => {
    
    if (!token) {
      toast({
        title: "Invalid Request",
        description: "Reset token is missing. Please use the link from your email.",
        variant: "destructive",
        duration: 3000,
      });
      router.push("/forgot-password"); // Redirect to forgot password page
      return;
    }
  }
  , [token]);
  // Password validation
  const validatePassword = (password: string) => {
    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setError("");
    
    // Validate passwords
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number and special character");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!token) {
      setError("Reset token is missing. Please use the link from your email.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch("https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Accept": "application/vnd.api+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token,
          newPassword: password
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // throw new Error(errorData.message || "Failed to reset password");
        toast({
          title: "Failed to reset password",
          description: errorData.message,
          variant: "destructive",
          duration: 2000,
        });
      }
      const data = await response.json();
      toast({
        title: "Reset link sent",
        description: data.message,
        variant: "default",
        duration: 2000,
      });
      
      onNext();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred while resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full sm:w-[440px] items-center gap-6 p-2">
      <Image src="/Logo_big.png" alt="Logo" width={143} height={60} />
      <div className="w-fit">
        <h4 className="text-primary text-center text-3xl font-bold font-mono">
          Reset Password
        </h4>
        <p className="text-base font-normal font-sans text-center">
          Create New Password{" "}
        </p>
      </div>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="w-full flex flex-col">
          <label
            className="text-base font-sans font-semibold"
            htmlFor="password"
          >
            Enter New Password <span className="text-red-600">*</span>
          </label>
          <input
            className={`p-3 rounded border ${error && password.length === 0 ? "border-red-500" : "border-gray-400"}`}
            placeholder="Enter your new password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
         
        </div>
        <div className="w-full flex flex-col">
          <label
            className="text-base font-sans font-semibold"
            htmlFor="confirm"
          >
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <input
            className={`p-3 rounded border ${error && password !== confirmPassword ? "border-red-500" : "border-gray-400"}`}
            placeholder="Re-enter your new password"
            name="confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            type="password"
          />
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          className="px-8 py-4 bg-primary rounded-full text-white text-base font-semibold disabled:bg-gray-400"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      <p className="text-base font-medium">
        Remember Password? {""}
        <Link className="text-primary" href={"/login"}>
          Login Here
        </Link>
      </p>
    </div>
  );
}

export default New;