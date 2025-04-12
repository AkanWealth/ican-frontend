import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Propsval {
  onNext: () => void;
}

function Base({ onNext }: Propsval) {
  return (
    <div className="flex flex-col w-full sm:w-[440px] items-center  gap-6 ">
      <Image src="/Logo_big.png" alt="Logo" width={143} height={60} />
      <div className=" w-fit">
        <h4 className=" text-primary text-center  text-3xl font-bold font-mono   ">
          Forgot Password
        </h4>
        <p className=" text-base font-normal font-sans  ">
          Enter your email address to reset your password.{" "}
        </p>
      </div>
      <form className="w-full flex flex-col gap-4 " action="">
        <div className="  w-full flex flex-col">
          <label
            className=" text-base font-sans font-semibold  "
            htmlFor="email"
          >
            Email <span className="text-red-600">*</span>
          </label>
          <input
            className=" p-3 rounded border border-gray-400  "
            placeholder="Enter your username"
            name="email"
            required
            type="email"
          />
          <p></p>
        </div>

        <button
          onClick={() => {
            onNext();
          }}
          className=" px-8 py-4 bg-primary rounded-full text-white text-base font-semibold "
          type="submit"
        >
          Reset Password
        </button>
      </form>
      <p className=" text-base font-medium   ">
        Remember Password? {"       "}
        <Link className=" text-primary " href={"/login"}>
          Login Here
        </Link>
      </p>
    </div>
  );
}

export default Base;
