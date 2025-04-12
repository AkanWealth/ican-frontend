import React from "react";
import {
  MdOutlineLocalPhone,
  MdMailOutline,
  MdLocationOn,
} from "react-icons/md";

function Cinfo() {
  return (
    <div className="flex flex-row flex-wrap gap-8 w-full justify-around items-start  p-4 md:p-20 lg:py-20 lg:px-40 bg-blue-100">
      <div className="flex gap-8 w-fit flex-col">
        <div className="flex flex-row  items-start gap-4">
          <MdOutlineLocalPhone className=" fill-primary h-8 w-8" />
          <div className="flex flex-col gap-4 text-left">
            <h4 className=" whitespace-nowrap text-2xl font-bold font-mono text-black ">
              Phone Number
            </h4>
            <p>+234 808 816 8895</p>
            <p>+234 803 256 4245</p>
          </div>
        </div>

        <div className="flex flex-row  items-start gap-4">
          <MdMailOutline className=" fill-primary h-8 w-8" />
          <div className="flex flex-col gap-4 text-left">
            <h4 className=" text-2xl font-bold font-mono text-black ">
              Mail Us
            </h4>
            <p>icansuruleredistrictsociety@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="flex flex-row max-w-80 items-start gap-4">
        <MdLocationOn className=" fill-primary h-8 w-8" />
        <div className="flex flex-col w-3/5 gap-4 text-left">
          <div>
            <h4 className=" text-2xl font-bold font-mono text-black ">
              Secretariat Address
            </h4>
            <p className=" whitespace-nowrap ">
              30B, Oke-Onijo Street, Off Ogunlana Street, <br />
              Ijeshatedo, Surulere, Lagos
            </p>
          </div>
          <div>
            <h4 className=" text-2xl font-bold font-mono text-black ">
              Physical Meeting Address
            </h4>
            <p className="   whitespace-nowrap ">
              Surulere Local Government Secretariat, <br /> Senator Oluremi
              Tinubu Hall,<br />
              24, Hakeem Olaogun Dickson Close <br /> Off Alhaji Masha,
              Onilegogoro Bus Stop <br/> Lagos State
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cinfo;
