import React from "react";
import Image from "next/image";
import Link from "next/link";
interface Propsval {
  onNext: () => void;
}


function Success({ onNext }: Propsval) {
  return (
    <div className=" flex flex-col items-center gap-10  ">
      <Image src={"/Check.png"} width={52} height={35} alt="success" />
      <h4 className=" text-black text-4xl font-semibold font-mono ">
        Password Successfully Reset!
      </h4>
      <p className="text-xl font-normal font-mono">
        Your Password has been successfully changed. Go back to Login
      </p>
      <Link className="w-full flex items-center " href={"/login"}>
        <button className="w-1/2 p-3 mx-auto rounded-full bg-primary text-white text-base font-semibold">
          LOGIN
        </button>
      </Link>
    </div>
  );
}

export default Success;
