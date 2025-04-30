import React from "react";
import Image from "next/image";

import { BASE_API_URL } from "@/utils/setter";
import { StudyPack } from "@/libs/types";

function Studenttile({ studypack }: { studypack: StudyPack }) {
  return (
    <div className="min-w-[350px]  gap-8 sm:gap-6 h-auto min-h-56 p-0 sm:pr-4 rounded-3xl border border-gray-300 justify-start items-center flex flex-col sm:flex-row">
      <div className="flex-col flex-1 justify-start items-start gap-4 inline-flex sm:p-6 py-8 px-4 ">
        {/* Download post category */}
        <span
          className={`inline-block py-1 text-sm leading-tight  rounded text-neutral-900 p-2`}
        >
          PDF
        </span>

        {/* Download post title */}
        <h2 className="sm:mt-4 m-0 text-xl font-semibold leading-6 text-neutral-800">
          {studypack.name}
        </h2>

        {/* Download button */}
        <a href={studypack.document} download={studypack.name}>
          <button className=" px-4 py-1 rounded-full text-sm text-white  font-semibold bg-blue-900 hover:bg-white hover:border hover:border-primary hover:text-primary  ">
            Download
          </button>
        </a>
      </div>
    </div>
  );
}

export default Studenttile;
