import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Propsval {
  onNext: () => void;
}

function Sent({ onNext }: Propsval) {
  return (
    <div className=" flex flex-col items-center gap-10  ">
      <Image src={"/Check.png"} width={52} height={35} alt="success" />
      <h4 className=" text-black text-3xl sm:text-4xl font-semibold font-mono ">
        Password Reset Link Sent
      </h4>
      <p className="text-xl font-normal font-mono">
        Reset password link has been sent to xxxxxxx@gmail.com Follow the
        directions to reset your password
      </p>
      <Link className="w-full flex items-center " href={"/login"}>
        <button className="w-1/2 p-3 mx-auto rounded-full bg-primary text-white text-base font-semibold">
          LOGIN
        </button>
      </Link>
    </div>
  );
}

export default Sent;
