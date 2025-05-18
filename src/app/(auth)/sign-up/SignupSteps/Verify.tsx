import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MailCheck } from "lucide-react";

interface PropsVal {
  onNext: () => void;
  email?: string;
}

function VerifyEmail({ onNext, email = "your email" }: PropsVal) {
  return (
    <div className="flex flex-col w-full items-center gap-6 p-4">
      <Image src="/Logo_big.png" alt="ICAN Logo" width={100} height={60} />
      
      <div className="w-fit">
        <h4 className="text-primary text-center text-2xl font-bold font-mono">
          Verify your Email
        </h4>
      </div>
      
      <div className="mb-2">
        <div className=" flex items-center justify-center">
          
          <MailCheck className="w-12 h-12 text-primary"/>
        </div>
      </div>
      
      <p className="text-center font-sans text-xs">
        A verification link has been sent to {email}. Please check
        your email and select the link provided to continue
      </p>
      
      <Link href="https://mail.google.com" target="_blank" className="w-full">
        <button className="w-full text-base font-semibold my-2">
          Go to your email
        </button>
      </Link>
      
      <div className="flex flex-row items-center gap-1 mt-4">
        <p className="flex font-medium text-gray-700">
          Didn&apos;t get an email?
        </p>
        <button 
          onClick={onNext}
          className="flex text-primary font-medium hover:underline"
        >
          Resend Link
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;