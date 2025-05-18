import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Propsval {
  onNext: () => void;
}

function Sent({ onNext }: Propsval) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 w-full max-w-[700px] mx-auto text-center">
      <div className="mt-4 mb-4">
      <div className="bg-green-500 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto">
      <Image src={"/Check.png"} width={52} height={35} alt="success" />
      </div>
      </div>
      <h4 className=" text-black text-2xl sm:text-3xl font-semibold font-mono ">
        Password Reset Link Sent
      </h4>
      <p className="text-center text-sm font-normal mx-auto max-w-lg">
        Reset password link has been sent to your email. Please check your email and
        follow the instructions to reset your password.
        
      </p>
      <Link href="https://mail.google.com" target="_blank" className="w-full">
          <button className="w-full bg-primary text-white py-3 rounded-full text-base font-semibold my-2 hover:bg-primary/90 transition">
            Go to your email
          </button>
        </Link>
    </div>
  );
}

export default Sent;
