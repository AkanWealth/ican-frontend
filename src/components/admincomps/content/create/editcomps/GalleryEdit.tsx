import React, { useState } from "react";
import InputEle from "@/components/genui/InputEle";

function GalleryEdit() {
  const [gallery, setGallery] = useState([]);
  return (
    <div>
      <div>
        <InputEle
          label="Gallery Title"
          type="text"
          id="title"
          onChange={() => {}}
        />
        <InputEle
          label="Upload Images"
          type="images"
          id="images"
          onChange={() => {}}
        />
      </div>
      <div className="flex flex-col gap-2">
        <button className="rounded-full py-2 bg-primary text-white text-base w-full">
          Publish Gallery
        </button>
        <button className=" py-2 text-primary border border-primary text-base rounded-full w-full">
          Save as Draft
        </button>
        <button className=" py-1 text-primary text-base rounded-full w-full">
          Preview
        </button>
      </div>
    </div>
  );
}

export default GalleryEdit;
