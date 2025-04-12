import React from "react";
// import axios from "axios";

import PropTypes from "prop-types";

function Publicationtile({
  imgurl = "/image.png",
  title = "2024 Annual Report & Minutes of AGM",
  date = "22, October 2024",
  previewurl,
  downloadurl,
}) {
  console.log(previewurl, downloadurl);

  // async function downloadPublication({downloadurl}) {
  //     const filename = "a.json";
  //     const res = await axios.get(
  //       `${downloadurl}` +
  //         new URLSearchParams({ filename: filename }),
  //       {
  //         responseType: "blob",
  //         onDownloadProgress: (progressEvent) => {
  //           console.log(
  //             "Download progress: " +
  //               Math.round(
  //                 (progressEvent.loaded / (progressEvent.total ?? 1)) * 100
  //               ) +
  //               "%"
  //           );
  //         },
  //       }
  //     );
  //     console.log(res);
  //     const data = res.data as Blob;
  //     download(data, filename);
  //     console.log("Downloaded");
  //   }

  // Publication Component card based on design
  // implement dynamic links for downloads and preview urls

  return (
    <div className="h-48 pr-4 rounded-lg border border-[#bbbbbb] justify-start items-center gap-8 inline-flex">
      <img className="w-36 h-48 relative" src={imgurl} />
      <div className="py-8 flex-col justify-start items-start gap-4 inline-flex">
        <h4 className="w-80 text-[#272727] text-xl font-semibold font-['Inter'] leading-normal">
          {title}
        </h4>
        <p className="text-[#515151] text-sm font-medium font-['Inter'] leading-tight">
          {date}
        </p>
        <div className="justify-start items-start gap-8 inline-flex">
          <button className="px-3 py-2 rounded-2xl border bg-white border-[#1a379a] text-[#1a379a] text-sm font-semibold ">
            Preview
          </button>
          <button
            onClick={downloadPublication}
            className="px-3 py-2 bg-[#1a379a] rounded-2xl text-white text-sm font-semibold font-['Inter'] leading-none"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
Publicationtile.propTypes = {
  imgurl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default Publicationtile;
