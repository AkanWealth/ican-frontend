import React from "react";
import Image from "next/image";

function Studenttile({
  imageUrl = "/image.png",
  title = "5 Critical Foundations for Mastering Financial Reporting",
  fileType = "PDF",
  downloadLink = "/student/A3_ICAN_MI.pdf",
}) {
  return (
    <div className="min-w-[350px]  gap-8 sm:gap-6 h-auto min-h-56 p-0 sm:pr-4 rounded-3xl border border-gray-300 justify-start items-center flex flex-col sm:flex-row">
      {imageUrl ? (
        <div className="sm:w-[253px] h-full w-full">
          <Image
            loading="lazy"
            src={imageUrl}
            width={100}
            height={100}
            alt={`Image for ${title}`}
            className="h-full w-full sm:w-fit object-cover sm:rounded-l-lg rounded-3xl"
          />
        </div>
      ) : (
        ""
      )}
      <div className="flex-col flex-1 justify-start items-start gap-4 inline-flex sm:p-6 py-8 px-4 ">
        {/* Download post category */}
        <span
          className={`inline-block py-1 text-sm leading-tight  rounded text-neutral-900 p-2`}
        >
          {fileType}
        </span>

        {/* Download post title */}
        <h2 className="sm:mt-4 m-0 text-xl font-semibold leading-6 text-neutral-800">
          {title}
        </h2>

        {/* Download button */}
        <a href={downloadLink} download={title}>
          <button className=" px-4 py-1 rounded-full text-sm text-white  font-semibold bg-blue-900 hover:bg-white hover:border hover:border-primary hover:text-primary  ">
            Download
          </button>
        </a>
      </div>
    </div>
  );
}

export default Studenttile;
