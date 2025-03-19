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
        Reset password link has been sent to xxxxxxx@gmail.com
        
        Follow the directions to reset your password
      </p>
      <Link className="w-full flex items-center " href={"/reset-password"}>
        <button className="w-1/2 p-3 mx-auto rounded-full bg-primary text-white text-base font-semibold">
          Reset Password
        </button>
      </Link>
    </div>
  );
}

export default Sent;
