"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";
import Cookies from "universal-cookie";
import apiClient from "@/services-admin/apiClient";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { uploadGalleryImage, validateGalleryImage } from "@/lib/galleryUpload";
import PreviewAdvert from "../previewcomps/PreviewAdvert";

type Advert = {
  name: string;
  advertiser: string;
  image: string;
  textBody: string;
  startDate: Date;
  endDate: Date;
};

function AdvertEdit({ mode, id }: CreateContentProps) {
  const cookies = new Cookies();
  const router = useRouter();
  const { toast } = useToast();

  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [advert, setAdvert] = useState<Advert>({
    name: "",
    image: "",
    advertiser: "",
    textBody: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(`${BASE_API_URL}/adverts/${id}/`);
        console.log("Advert details fetched:", response.data);
        setAdvert({
          name: response.data.name || advert.name,
          advertiser: response.data.advertiser || advert.advertiser,
          image: response.data.image || advert.image,
          textBody: response.data.textBody || advert.textBody,
          startDate: response.data.startDate
            ? new Date(response.data.startDate)
            : advert.startDate,
          endDate: response.data.endDate
            ? new Date(response.data.endDate)
            : advert.endDate,
        });
        setEditDataFetched(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch advert details.",
          variant: "destructive",
        });
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching advert details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, mode, toast, advert]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate the file before uploading
    const validation = validateGalleryImage(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    try {
      // Show loading state
      setIsUploading(true);
      setUploadProgress(0);

      // Create a unique folder path for advert images
      // Use the S3 upload function from galleryUpload.js but with an advert-specific path
      const uploadedUrl = await uploadGalleryImage(file, (progress) => {
        setUploadProgress(progress);
      });

      console.log("Uploaded advert image URL:", uploadedUrl);

      // Update state with the new URL
      setAdvert((prev) => ({
        ...prev,
        image: uploadedUrl,
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error uploading advert image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdvert((prev) => ({
      ...prev,
      image: "",
    }));
    toast({
      title: "Image removed",
      description: "The image has been removed from the advert.",
      variant: "default",
    });
  };

  const handleSubmit = async (status: "published" | "draft") => {
    // Validate required fields
    if (!advert.name || !advert.advertiser) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const data = JSON.stringify({
      name: advert.name,
      advertiser: advert.advertiser,
      content: advert.textBody,
      startDate: advert.startDate.toISOString(),
      endDate: advert.endDate.toISOString(),
      coverImg: advert.image,
      status: status,
    });

    const config = {
      method: mode === "edit" ? "PATCH" : "POST",
      maxBodyLength: Infinity,
      url:
        mode === "edit"
          ? `${BASE_API_URL}/adverts/${id}`
          : `${BASE_API_URL}/adverts`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: data,
    };

    try {
      setIsSubmitting(true);
      const response = await apiClient.request(config);
      console.log("Advert submitted:", response);

      toast({
        title: "Success",
        description: `Advert ${
          status === "published" ? "published" : "saved as draft"
        } successfully.`,
        variant: "default",
      });

      router.refresh();
    } catch (error) {
      console.error("Error submitting advert:", error);
      toast({
        title: "Submission failed",
        description: "Failed to save the advert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;

    // Handle date fields separately
    if (id === "start_date" || id === "end_date") {
      setAdvert((prev) => ({
        ...prev,
        [id === "start_date" ? "startDate" : "endDate"]: new Date(value),
      }));
    } else {
      // Map form field IDs to state property names
      const stateKey = id === "text_body" ? "textBody" : id;
      setAdvert((prev) => ({
        ...prev,
        [stateKey]: value,
      }));
    }
  };

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <InputEle
          label="Advert Title"
          type="text"
          id="name"
          value={advert.name}
          onChange={handleChange}
        />
        <InputEle
          label="Advertiser"
          type="text"
          id="advertiser"
          value={advert.advertiser}
          onChange={handleChange}
        />

        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Advert Image</label>

          {/* Image Upload Controls */}
          <div className="flex flex-wrap gap-4">
            <label className="bg-[#27378C] text-white px-6 py-2 rounded-full cursor-pointer hover:bg-blue-700 text-sm whitespace-nowrap">
              Upload Image
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            {advert.image && (
              <button
                onClick={handleDeleteImage}
                className="bg-[#E7EAFF] text-[#27378C] px-6 py-2 rounded-full hover:bg-gray-200 text-sm whitespace-nowrap"
                disabled={isUploading}
              >
                Remove Image
              </button>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">
                Uploading... {uploadProgress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {advert.image && !isUploading && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">Image Preview</p>
              <div className="relative group w-full max-w-md">
                <img
                  src={advert.image}
                  alt="Advert preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        <InputEle
          label="Text Body"
          type="textarea"
          id="text_body"
          value={advert.textBody}
          onChange={handleChange}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputEle
            label="Start Date"
            type="date"
            id="start_date"
            value={advert.startDate.toISOString().split("T")[0]}
            onChange={handleChange}
          />
          <InputEle
            label="End Date"
            type="date"
            id="end_date"
            value={advert.endDate.toISOString().split("T")[0]}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          disabled={isSubmitting || isUploading}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit("published");
          }}
          className="rounded-full py-2 bg-primary text-white text-base w-full
            disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {mode === "edit" ? "Publish Edit" : "Publish Advert"}
        </button>
        <button
          disabled={isSubmitting || isUploading}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit("draft");
          }}
          className="py-2 text-primary border border-primary text-base rounded-full w-full
            disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
        >
          {mode === "edit" ? "Save Edit" : "Save as Draft"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowPreview(true);
          }}
          className="py-1 text-primary text-base rounded-full w-full"
          disabled={isUploading}
        >
          Preview
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewAdvert
          name={advert.name}
          advertiser={advert.advertiser}
          image={advert.image}
          textBody={advert.textBody}
          startDate={advert.startDate.toISOString().split("T")[0]}
          endDate={advert.endDate.toISOString().split("T")[0]}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      )}
    </form>
  );
}

export default AdvertEdit;
