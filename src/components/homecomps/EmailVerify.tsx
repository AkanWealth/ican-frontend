"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "your email";
  const { toast } = useToast();
  const [resending, setResending] = useState(false);

  const handleResendLink = async () => {
    if (resending) return;
    
    setResending(true);
    
    try {
      const response = await axios.post(
        "https://ican-api-6000e8d06d3a.herokuapp.com/api/users/resend-verification-email",
        { email }
      );
      
      toast({
        title: "Verification Email Sent",
        description: "A new verification link has been sent to your email.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error resending verification email:", error);
      
      toast({
        title: "Failed to Resend",
        description: "There was a problem resending the verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col w-full max-w-md items-center gap-6 p-8 bg-white rounded-2xl shadow-sm">
        <Image src="/Logo_big.png" alt="ICAN Logo" width={140} height={40} />
        
        <div className="w-fit">
          <h4 className="text-primary text-center text-2xl font-bold font-mono">
            Verify your Email
          </h4>
        </div>
        
        <div className="mb-2">
          <div className="flex items-center justify-center">
            <MailCheck className="w-12 h-12 text-primary"/>
          </div>
        </div>
        
        <p className="text-center font-sans">
          A verification link has been sent to <span className="font-medium">{email}</span>. Please check
          your email and select the link provided to continue.
        </p>
        
        <Link href="https://mail.google.com" target="_blank" className="w-full">
          <button className="w-full bg-primary text-white py-3 rounded-full text-base font-semibold my-2 hover:bg-primary/90 transition">
            Go to your email
          </button>
        </Link>
        
        <div className="flex flex-row items-center gap-1 mt-4">
          <p className="flex font-medium text-gray-700">
            Didn&apos;t get an email?
          </p>
          <button 
            onClick={handleResendLink}
            className="flex text-primary font-medium hover:underline"
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend Link"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;