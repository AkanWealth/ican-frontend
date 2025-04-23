"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import Toast from "@/components/genui/Toast";
import { Router } from "lucide-react";

interface GalleryProps {
  name: string;
  images: [string];
  videos: [string];
}

function GalleryEdit({ mode, id }: CreateContentProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [gallery, setGallery] = useState<GalleryProps>({
    name: "",
    images: [""],
    videos: [""],
  });
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/gallery/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          withCredentials: true,
        });
        console.log("Gallery details fetched:", response.data);
        setGallery({
          name: response.data.name,
          images: response.data.images || [""],
          videos: response.data.videos || [""],
        });
        setEditDataFetched(true);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 404
        ) {
          setEditDataFetched(true);
          console.error(
            "Gallery not found (404). Stopping further fetch attempts."
          );
        } else {
          console.error("Error fetching Gallery:", error);
        }
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Gallery details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, mode]);

  const handleSubmit = async (status: "published" | "draft") => {
    const data = JSON.stringify({
      name: gallery.name,
      images: gallery.images,
      videos: gallery.videos,
      status: status,
    });

    const config = {
      method: mode === "edit" ? "PATCH" : "POST",
      maxBodyLength: Infinity,
      url:
        mode === "edit"
          ? `${BASE_API_URL}/gallery/${id}`
          : `${BASE_API_URL}/gallery`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("Gallery submitted successfully:", response.data);
      router.refresh();
      setIsSubmitting(false);
      return <Toast type="success" message="Gallery submitted successfully!" />;
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error submitting gallery:", error);
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
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit("published");
          }}
          className="rounded-full py-2 bg-primary text-white text-base w-full"
        >
          {mode === "edit" ? "Publish Edit" : "Publish Gallery"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();

            handleSubmit("draft");
          }}
          className=" py-2 text-primary border border-primary text-base rounded-full w-full"
        >
          {mode === "edit" ? "Save Edit" : "Save as Draft"}
        </button>
        <button className=" py-1 text-primary text-base rounded-full w-full">
          Preview
        </button>
      </div>
    </div>
  );
}

export default GalleryEdit;
