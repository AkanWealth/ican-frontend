"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/services-admin/apiClient";
import PreviewGallery from "../previewcomps/PreviewGallery";
import { uploadGalleryImage, validateGalleryImage } from "@/lib/galleryUpload";

// Default video URL to use when no videos are provided
const DEFAULT_VIDEO_URL = "https://example.com/default-video.mp4";

interface GalleryProps {
  name: string;
  images: string[];
  videos: string[];
}

function GalleryEdit({ mode, id }: CreateContentProps) {
  const router = useRouter();
  const cookies = new Cookies();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [gallery, setGallery] = useState<GalleryProps>({
    name: "",
    images: [],
    videos: [DEFAULT_VIDEO_URL], // Initialize with default video URL
  });
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(`gallery/${id}`);
        console.log("Gallery details fetched:", response);
        setGallery({
          name: response.name,
          images: response.images || [],
          videos: response.videos?.length
            ? response.videos
            : [DEFAULT_VIDEO_URL],
        });
        setEditDataFetched(true);
      } catch (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Gallery not found.",
        });
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Gallery details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, mode, toast]);

  const handleSubmit = async (status: "published" | "draft") => {
    const data = {
      name: gallery.name,
      images: gallery.images,
      videos: gallery.videos,
      // status: status,
    };

    try {
      setIsSubmitting(true);
      let response;

      if (mode === "edit") {
        response = await apiClient.patch(`gallery/${id}`, data);
      } else {
        response = await apiClient.post("gallery", data);
      }

      console.log("Gallery submitted successfully:", response);
      router.refresh();
      toast({
        title: "Success",
        description: `Gallery ${
          status === "published" ? "published" : "saved as draft"
        } successfully.`,
        variant: "default",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error submitting gallery:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while submitting the gallery.",
      });
      window.location.reload();
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
    setGallery((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newProgressArray = Array(files.length).fill(0);
    setUploadProgress(newProgressArray);

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate the file before uploading
        const validation = validateGalleryImage(file);
        if (!validation.valid) {
          toast({
            title: "Invalid file",
            description: validation.message,
            variant: "destructive",
          });
          continue;
        }

        // Upload the file and track progress
        const uploadedUrl = await uploadGalleryImage(file, (progress) => {
          const updatedProgress = [...newProgressArray];
          updatedProgress[i] = progress;
          setUploadProgress(updatedProgress);
        });

        uploadedUrls.push(uploadedUrl);
      }

      // Add new image URLs to gallery
      setGallery((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      toast({
        title: "Upload successful",
        description: `${uploadedUrls.length} image(s) uploaded successfully.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error in image upload:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload one or more images.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setGallery((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <InputEle
          label="Gallery Title"
          type="text"
          id="name"
          value={gallery.name}
          onChange={handleChange}
        />

        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Gallery Images</label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/90"
            disabled={isUploading}
          />

          {/* Upload Progress */}
          {isUploading && (
            <div className="my-2 space-y-2">
              <p className="text-sm font-medium">Uploading...</p>
              {uploadProgress.map((progress, index) => (
                <div
                  key={index}
                  className="w-full bg-gray-200 rounded-full h-2.5"
                >
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              ))}
            </div>
          )}

          {/* Image Preview Grid */}
          {gallery.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    className="h-32 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1
                      opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
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
          {mode === "edit" ? "Publish Edit" : "Publish Gallery"}
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
          className="py-1 text-primary text-base rounded-full w-full"
          onClick={() => setShowPreview(true)}
          disabled={isUploading}
        >
          Preview
        </button>
      </div>

      {/* Preview Modal */}
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
