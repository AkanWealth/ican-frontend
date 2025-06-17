import React from "react";
import {
  MdOutlineLocalPhone,
  MdMailOutline,
  MdLocationOn,
} from "react-icons/md";

function Cinfo() {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-6 md:gap-8 w-full justify-center md:justify-around items-center md:items-start p-4 md:p-12 lg:py-20 lg:px-40 bg-blue-100">
      <div className="flex gap-6 md:gap-8 w-full md:w-fit flex-col">
        <div className="flex flex-row items-start gap-3 md:gap-4">
          <MdOutlineLocalPhone className="fill-primary h-6 w-6 md:h-8 md:w-8 mt-1" />
          <div className="flex flex-col gap-2 md:gap-4 text-left">
            <h4 className="text-xl md:text-2xl font-bold font-mono text-black">
              Phone Number
            </h4>
            <p>+234 808 816 8895</p>
            <p>+234 803 256 4245</p>
          </div>
        </div>

        <div className="flex flex-row items-start gap-3 md:gap-4">
          <MdMailOutline className="fill-primary h-6 w-6 md:h-8 md:w-8 mt-1" />
          <div className="flex flex-col gap-2 md:gap-4 text-left">
            <h4 className="text-xl md:text-2xl font-bold font-mono text-black">
              Mail Us
            </h4>
            <p className="break-words">icansuruleredistrictsociety@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="flex flex-row w-full md:max-w-md items-start gap-3 md:gap-4">
        <MdLocationOn className="fill-primary h-6 w-6 md:h-8 md:w-8 mt-1" />
        <div className="flex flex-col gap-2 md:gap-4 text-left">
          <div>
            <h4 className="text-xl md:text-2xl font-bold font-mono text-black">
              Secretariat Address
            </h4>
            <p>
              30B, Oke-Onijo Street, Off Ogunlana Street, Ijeshatedo, Surulere,
              Lagos
            </p>
          </div>
          <div className="mt-2 md:mt-4">
            <h4 className="text-xl md:text-2xl font-bold font-mono text-black">
              Physical Meeting Address
            </h4>
            <p>
              Surulere Local Government Secretariat, Senator Oluremi Tinubu
              Hall, 24, Hakeem Olaogun Dickson Close Off Alhaji Masha,
              Onilegogoro Bus Stop, Lagos State
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cinfo;
