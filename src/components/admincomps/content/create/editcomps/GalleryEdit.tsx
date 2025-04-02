"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import Toast from "@/components/genui/Toast";

interface GalleryProps {
  name: string;
  images: [string];
  videos: [string];
}

function GalleryEdit({ mode, id }: CreateContentProps) {
  const [gallery, setGallery] = useState<GalleryProps>({
    name: "",
    images: [""],
    videos: [""],
  });

 const handleSubmit = async (status: "published" | "draft") => {
   const data = JSON.stringify({
    name: gallery.name,
     images: gallery.images,
     videos: gallery.es,
     contentBody: post,
     contentType: "article",
     coverImage: "",
     status: status,
   });

   const config = {
     method: mode === "edit" ? "PATCH" : "POST",
     maxBodyLength: Infinity,
     url:
       mode === "edit"
         ? `${BASE_API_URL}/blogs/${id}`
         : `${BASE_API_URL}/blogs`,
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${localStorage.getItem("access_token")}`,
     },
     data: data,
   };

   try {
     const response = await axios.request(config);
     console.log("Blog submitted successfully:", response.data);
     return <Toast type="success" message="Blog submitted successfully!" />;
   } catch (error) {
     console.error("Error submitting blog:", error);
   }
 };

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
