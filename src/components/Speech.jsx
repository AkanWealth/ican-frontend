"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MdStar } from "react-icons/md";

function Speech() {
  // The Speech component for the landing page
  return (
    <div className=" p-4 sm:p-20 lg:p-40 bg-white flex flex-col sm:flex-row gap-6 justify-between items-center w-full h-fit ">
      <div className="flex flex-col sm:w-[550px] gap-12 items-start text-left">
        <div className="gap-4 w-fit text-left">
          <h2 className="text-primary w-fit font-semibold text-4xl sm:text-5xl font-mono">
            About Surulere & District Society
            <br /> (SDS)
          </h2>
          <div className="flex mt-4 flex-row items-center justify-start gap-2">
            <div className=" w-6  border-2 border-green-500  "></div>
            <h4 className="font-semibold text-xl font-sans text-neutral-700">
              All-Star District
            </h4>
            <div className="flex flex-row ">
              <MdStar className="w-6 h-6 fill-yellow-500 stroke-yellow-500 " />
              <MdStar className="w-6 h-6 fill-yellow-500 stroke-yellow-500 " />
              <MdStar className="w-6 h-6 fill-yellow-500 stroke-yellow-500 " />
              <MdStar className="w-6 h-6 fill-yellow-500 stroke-yellow-500 " />
              <MdStar className="w-6 h-6 fill-yellow-500 stroke-yellow-500 " />
            </div>
          </div>
        </div>
        <p className="text-sans font-normal text-base text-gray-600 text-justify">
          The{" "}
          <span className=" text-black font-medium">
            Surulere & District Society (SDS){" "}
          </span>
          is a dynamic chapter of the Institute of Chartered Accountants of
          Nigeria, dedicated to advancing the accounting profession through
          professional development, networking, and mentorship. <br />
          <br />
          Our goal is to support members with resources, training, and events
          that foster ethical practices and career growth. <br /> <br />
          With a commitment to professionalism, accountability, and community
          engagement,{" "}
          <span className=" text-black font-medium">
            Surulere & District Society (SDS){" "}
          </span>{" "}
          creates a platform where accountants can connect, learn, and thrive,
          ensuring their continued leadership in the field and contributions to
          the economy.
        </p>
        {/* The Chairmans speech */}

        <Link href={"/about-us"}>
          <button className="bg-primary sm:w-fit w-full rounded-full text-white py-2 px-4">
            Read more
          </button>
        </Link>
      </div>
      <Image
        height={530}
        width={400}
        className="w-full h-auto rounded-2xl max-w-[550px]"
        alt="Chairman, Dr Aderopo Oladapo, FCA"
        src="/Gallery1.jpg"
      />{" "}
      {/* // The Image of the chairman for the landing page */}
    </div>
  );
}

export default Speech;
