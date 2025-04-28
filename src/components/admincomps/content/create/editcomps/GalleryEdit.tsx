"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import { useToast } from "@/hooks/use-toast";

import { Router } from "lucide-react";
import PreviewGallery from "../previewcomps/PreviewGallery";

interface GalleryProps {
  name: string;
  images: [string];
  videos: [string];
}

function GalleryEdit({ mode, id }: CreateContentProps) {
  const router = useRouter();
  const cookies = new Cookies();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState<boolean>(false);

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
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

          toast({
            title: "Error",
            variant: "destructive",
            description: "Gallery not found.",
          });
        } else {
          console.error("Error fetching Gallery:", error);
          toast({
            title: "Error",
            variant: "destructive",
            description:
              "An unexpected error occurred while fetching the gallery.",
          });
        }
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Gallery details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, mode, toast]);

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
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("Gallery submitted successfully:", response.data);
      router.refresh();
      setIsSubmitting(false);
      toast({
        title: "Success",
        description: `Gallery ${
          status === "published" ? "published" : "saved as draft"
        } successfully.`,
        variant: "default",
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error submitting gallery:", error);

      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while submitting the gallery.",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setGallery((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div>
      <div>
        <InputEle
          label="Gallery Title"
          type="text"
          id="title"
          onChange={handleChange}
        />
        <InputEle
          label="Upload Images"
          type="images"
          id="images"
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          disabled={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            setIsSubmitting(true);
            handleSubmit("published");
          }}
          className="rounded-full py-2 bg-primary text-white text-base w-full"
        >
          {mode === "edit" ? "Publish Edit" : "Publish Gallery"}
        </button>
        <button
          disabled={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            setIsSubmitting(true);

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
      {showPreview && (
        <PreviewGallery
          name={gallery.name}
          images={gallery.images}
          videos={gallery.videos}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      )}
    </div>
  );
}

export default GalleryEdit;
