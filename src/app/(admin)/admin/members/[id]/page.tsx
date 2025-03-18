"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

function MemberDetails() {
  const router = useRouter();
  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="flex flex-row items-center gap-2 text-primary"
          >
            <MdArrowBack className="w-6 h-6" /> Back
          </button>
          <h2 className="font-semibol text-2xl text-black">Member Details </h2>
        </div>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-10 border border-neutral-200 bg-white">
        <div>
          <h2 className="text-xl font-semibold text-left">Bio data</h2>
          <hr />
          <div className=" grid grid-cols-3 w-full gap-2 gap-y-4 ">
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Surname
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              First Name
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Middle Name
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Date of Birth
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Marital Status
              <span className="text-base text-black font-medium">Surname</span>
            </p>
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              State of Origin{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Nationality{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-left">
            Residential Address
          </h2>
          <hr />
          <div className=" grid grid-cols-3 w-full gap-2 gap-y-4 ">
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Residential Address
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Contact Phone Number{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Residential Country{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Residential State{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Residential City{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Residential LGA{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>
          </div>
        </div>{" "}
        <div>
          <h2 className="text-xl font-semibold text-left">
            Educational and Professional Qualifications
          </h2>
          <hr />
          <div className=" grid grid-cols-3 w-full gap-2 gap-y-4 ">
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Institution
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Discipline{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Qualification{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Year of Graduation{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Status
              <span className="text-base text-black font-medium">Surname</span>
            </p>
          </div>
        </div>{" "}
        <div>
          <h2 className="text-xl font-semibold text-left">Work Experience</h2>
          <hr />
          <div className=" grid grid-cols-3 w-full gap-2 gap-y-4 ">
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Company{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Office Address{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Position/Role
              <span className="text-base text-black font-medium">Surname</span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Start Date{" "}
              <span className="text-base text-black font-medium">Surname</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDetails;
