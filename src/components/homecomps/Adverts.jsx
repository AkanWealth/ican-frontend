import React from "react";
import Image from "next/image";

function Adverts() {
  return (
    <div className="bg-white p-4 sm:p-20 lg:p-40  flex gap-6 justify-between items-center w-full h-fit">
      <div className="bg-primary rounded-2xl flex flex-col w-full gap-10 p-6 sm:p-10  lg:px-28">
        <h2 className=" text-center text-white text-3xl font-bold">
          Place Your Advert Here
        </h2>
        <p className="text-neutral-50 text-center hidden sm:block text-base font-normal font-sans">
          Connect with a thriving community of professional and increase your
          visibility by advertising with us today!
        </p>
      </div>
    </div>
  );
}

export default Adverts;
