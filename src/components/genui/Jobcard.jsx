import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

function Jobcard({
  role = "Head- Tax/Audit",
  location = "5 Essential needs to consider for developing a web App",
  date = "22, October 2024",
}) {
  // Job card based on figma design
  // need to create seperate page component that handles dynamic routing based on elements
  return (
    <div className="w-96 h-36 px-8 py-6 rounded-lg border border-[#bbbbbb] flex-col justify-center items-start gap-4 inline-flex">
      <div className="w-full flex flex-row justify-between items-center">
        <h4 className="w-80 text-[#272727] text-xl font-semibold font-['Inter'] leading-normal">
          {role}
        </h4>
        <Link href={"/"}>
          {/* Dynamic link to the specific job  */}
          <button className="px-8 py-4 bg-primary rounded-3xl text-white text-base font-semibold">
            Apply
          </button>
        </Link>
      </div>
      <div className="justify-start items-center gap-4 flex flex-row">
        <p className="text-[#272727] text-base font-semibold font-['Inter'] leading-normal">
          {location}
        </p>
        <p className="text-[#515151] text-sm font-medium font-['Inter'] leading-tight">
          {date}
        </p>
      </div>
    </div>
  );
}
Jobcard.propTypes = {
  role: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default Jobcard;
