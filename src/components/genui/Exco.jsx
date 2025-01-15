import React from "react";
import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa6";

function Exco({ name, role, imgurl = "/excos/Exco.png" }) {
  // Exco image and Info card
  return (
    <div className=" relative w-80 h-[435px] bg-gray-400 rounded-3xl flex-col justify-center items-center inline-flex">
      <Image
        src={imgurl}
        width={317}
        height={435}
        alt={name}
        className=" h-full w-fit"
      />

      <div className="justify-between absolute z-10 bottom-0  px-4 py-4 w-full items-center flex flex-row  rounded-lg">
        <div className="w-44 flex-col justify-start  items-start gap-2 inline-flex">
          <h5 className="self-stretch text-white text-xl font-bold  ">
            {name}
          </h5>
          <p className="text-white text-base font-normal  ">{role}</p>
        </div>
        <div className="w-8 h-8 p-1 bg-[#1a379a] rounded justify-center items-center flex">
          <FaLinkedinIn className="fill-white h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default Exco;
