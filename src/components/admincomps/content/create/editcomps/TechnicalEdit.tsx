import React, { useState } from "react";
import InputEle from "@/components/genui/InputEle";

function TechnicalEdit() {
  return (
    <div>
      <div>
        <InputEle
          label="Publication Title"
          type="text"
          id="title"
          onChange={() => {}}
        />
        <InputEle
          label="Upload Cover Image"
          type="images"
          id="advert_image"
          onChange={() => {}}
        />

        <InputEle
          label="Upload File (PDF)"
          type="file"
          id="publication_file"
          onChange={() => {}}
        />
      </div>
      <div className="flex flex-col gap-2">
        <button className="rounded-full py-2 bg-primary text-white text-base w-full">
          Publish Technical Session
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

export default TechnicalEdit;
