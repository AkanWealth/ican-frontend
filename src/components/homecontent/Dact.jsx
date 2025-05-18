import React from "react";
import { FaPeopleRoof } from "react-icons/fa6";

function Dact() {
  return (
    <div className=" w-full py-20 bg-blue-200 flex flex-col items-center justify-center gap-16 ">
      <div className="flex flex-col w-fit items-center gap-2">
        <h5 className="font-bold font-sans text-black text-xl text-center">
          SURULERE & DISTRICT SOCIETY (SDS)
        </h5>
        <h4 className="text-primary font-mono text-3xl sm:text-5xl font-bold text-center">
          Our District Activity
        </h4>
      </div>
      <div className="flex flex-row gap-12 items-center justify-center">
        <div className="max-w-80 font-sans rounded-xl h-fit bg-white p-6 flex flex-col justify-between items-start gap-4 ">
          <div className="rounded-xl p-2 bg-slate-300 ">
            <FaPeopleRoof className="w-9 h-9 fill-primary" />
          </div>
          <h6 className="font-semibold text-xl text-left text-gray-900 ">
            Monthly Meeting
          </h6>
          <p className="text-base font-medium text-gray-600 text-balance ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum{" "}
            dolor sit amet, consectetur adipiscing elit
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dact;
