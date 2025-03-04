import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Propsval {
  onNext: () => void;
}

function New({ onNext }: Propsval) {
  return (
    <div className="flex flex-col w-full items-center  gap-6 ">
      <Image src="/Logo_big.png" alt="Logo" width={143} height={60} />
      <div className=" w-fit">
        <h4 className=" text-primary text-center text-3xl font-bold font-mono   ">
          Reset Password
        </h4>
        <p className=" text-base font-normal font-sans  ">
          Create New Password{" "}
        </p>
      </div>
      <form className="w-full flex flex-col gap-4 " action="">
        <div className="  w-full flex flex-col">
          <label
            className=" text-base font-sans font-semibold  "
            htmlFor="password"
          >
            Enter New Password <span className="text-red-600">*</span>
          </label>
          <input
            className=" p-3 rounded border border-gray-400  "
            placeholder="Enter your new password"
            name="password"
            required
            type="text"
          />
          <p></p>
        </div>
        <div className="  w-full flex flex-col">
          <label
            className=" text-base font-sans font-semibold  "
            htmlFor="confirm"
          >
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <input
            className=" p-3 rounded border border-gray-400  "
            placeholder="Re-enter your new password"
            name="confirm"
            required
            type="text"
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

export default New;
