import React from "react";
import {
  FaPeopleGroup,
  FaHandHoldingHeart,
  FaClock,
  FaPeopleLine,
} from "react-icons/fa6";

// Static metrics bar for landing page, can be made dynamic in the future

function Metrics() {
  return (
    <div className=" flex flex-wrap flex-row justify-between w-full p-4 sm:p-20 lg:40 gap-10 items-center">
      <div className="flex  items-center flex-col gap-4 w-fit ">
        <FaPeopleGroup className="fill-[#919191] w-12 h-12" />
        <h5 className="  text-2xl sm:text-3xl text-primary font-mono font-bold  ">
          1,300+
        </h5>
        <p className=" text-lg sm:text-xl text-black text-center font-medium font-sans">
          Membership
        </p>
      </div>
      <div className="flex items-center  flex-col gap-4 w-fit ">
        <FaHandHoldingHeart className="fill-[#919191] w-12 h-12" />
        <h5 className="  text-2xl sm:text-3xl text-primary font-mono font-bold  ">
          20+
        </h5>
        <p className=" text-lg sm:text-xl text-center text-black font-medium font-sans">
          Community Impact
        </p>
      </div>
      <div className="flex items-center  flex-col gap-4 w-fit ">
        <FaClock className="fill-[#919191] w-12 h-12" />
        <h5 className=" text-2xl sm:text-3xl text-primary font-mono  font-bold ">
          3 Years
        </h5>
        <p className=" text-lg sm:text-xl text-center text-black font-medium font-sans">
          Dedicated Service
        </p>
      </div>
      <div className="flex  items-center flex-col gap-4 w-fit ">
        <FaPeopleLine className="fill-[#919191] w-12 h-12" />
        <h5 className="  text-2xl sm:text-3xl text-primary font-mono  font-bold ">
          30%
        </h5>
        <p className=" text-lg sm:text-xl text-center text-black font-medium font-sans">
          Yearly Growth
        </p>
      </div>
    </div>
  );
}

export default Metrics;
