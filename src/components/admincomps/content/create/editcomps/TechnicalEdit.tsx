import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import { useToast } from "@/hooks/use-toast";

import PreviewTechnical from "../previewcomps/PreviewTechnical";

import { uploadGalleryImage, validateGalleryImage } from "@/lib/galleryUpload";

import { uploadPDF, validatePDF } from "@/lib/pdfUpload";

type TechnicalSession = {
  name: string;
  document: string;
  coverImg: string;
};

function TechnicalEdit({ mode, id }: CreateContentProps) {
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);
  const [techSesh, setTechSesh] = useState<TechnicalSession>({
    name: "",
    document: "",
    coverImg: "",
  });

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [uploadProgressImage, setUploadProgressImage] = useState<number>(0);

  const [isUploadingPDF, setIsUploadingPDF] = useState<boolean>(false);
  const [uploadProgressPDF, setUploadProgressPDF] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(
          `${BASE_API_URL}/technical-sessions/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log("Technical Sessions details fetched:", response.data);
        setTechSesh({
          name: response.name,
          document: response.document || "",
          coverImg: response.coverImg || "",
        });
        setEditDataFetched(true);
      } catch (error) {
        setEditDataFetched(true);

        toast({
          title: "Technical Sessions not found",
          description: "Technical Sessions not found",
          variant: "destructive",
        });
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Technical Sessions details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, toast, mode]);

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
      setIsUploadingImage(true);
      setUploadProgressImage(0);

      // Create a unique folder path for advert images
      // Use the S3 upload function from galleryUpload.js but with an advert-specific path
      const uploadedUrl = await uploadGalleryImage(file, (progress) => {
        setUploadProgressImage(progress);
      });

      console.log("Uploaded advert image URL:", uploadedUrl);

      // Update state with the new URL
      setTechSesh((prev) => ({
        ...prev,
        coverImg: uploadedUrl,
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
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setTechSesh((prev) => ({
      ...prev,
      coverImg: "",
    }));
    toast({
      title: "Image removed",
      description: "The image has been removed from the technical session.",
      variant: "default",
    });
  };

  const handlePDFUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate the file before uploading
    const validation = validatePDF(file);
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
      setIsUploadingPDF(true);
      setUploadProgressPDF(0);

      // Create a unique folder path for advert images
      // Use the S3 upload function from galleryUpload.js but with an advert-specific path
      const uploadedUrl = await uploadPDF(file, (progress) => {
        setUploadProgressPDF(progress);
      });

      console.log("Uploaded PDF URL:", uploadedUrl);

      // Update state with the new URL
      setTechSesh((prev) => ({
        ...prev,
        document: uploadedUrl,
      }));

      toast({
        title: "Success",
        description: "PDF uploaded successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPDF(false);
    }
  };

  const handleDeletePDF = (e: React.MouseEvent) => {
    e.preventDefault();
    setTechSesh((prev) => ({
      ...prev,
      document: "",
    }));
    toast({
      title: "PDF removed",
      description: "The PDF has been removed from the technical session.",
      variant: "default",
    });
  };

  const handleSubmit = async (status: "published" | "draft") => {
    const data = JSON.stringify({
      name: techSesh.name,
      document: techSesh.document,
      coverImg: techSesh.coverImg,
      status: status.toUpperCase(),
    });

    const config = {
      method: mode === "edit" ? "PATCH" : "POST",
      maxBodyLength: Infinity,
      url:
        mode === "edit"
          ? `${BASE_API_URL}/technical-sessions/${id}`
          : `${BASE_API_URL}/technical-sessions`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: data,
    };

    try {
      const response = await apiClient.request(config);
      console.log("Technical Sessions submitted successfully:", response);
      setIsSubmitting(false);
      toast({
        title: "Success",
        description: "Technical Sessions submitted successfully",
        variant: "default",
      });
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description:
          "An unknown error occurred while submitting the Technical Session",
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      <div>
        <InputEle
          label="Tecnical Session Title"
          type="text"
          id="name"
          value={techSesh.name}
          onChange={(e) => setTechSesh({ ...techSesh, name: e.target.value })}
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
                disabled={isUploadingImage}
              />
            </label>
            {techSesh.coverImg && (
              <button
                onClick={handleDeleteImage}
                className="bg-[#E7EAFF] text-[#27378C] px-6 py-2 rounded-full hover:bg-gray-200 text-sm whitespace-nowrap"
                disabled={isUploadingImage}
              >
                Remove Image
              </button>
            )}
          </div>

          {/* Upload Progress */}
          {isUploadingImage && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">
                Uploading... {uploadProgressImage}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgressImage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {techSesh.coverImg && !isUploadingImage && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">Image Preview</p>
              <div className="relative group w-full max-w-md">
                <img
                  src={techSesh.coverImg}
                  alt="Technical Session preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        {/* PDF Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Upload PDF</label>

          {/* Image Upload Controls */}
          <div className="flex flex-wrap gap-4">
            <label className="bg-[#27378C] text-white px-6 py-2 rounded-full cursor-pointer hover:bg-blue-700 text-sm whitespace-nowrap">
              Upload PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePDFUpload}
                className="hidden"
                disabled={isUploadingPDF}
              />
            </label>
            {techSesh.document && (
              <button
                onClick={handleDeletePDF}
                className="bg-[#E7EAFF] text-[#27378C] px-6 py-2 rounded-full hover:bg-gray-200 text-sm whitespace-nowrap"
                disabled={isUploadingPDF}
              >
                Remove PDF
              </button>
            )}
          </div>

          {/* Upload Progress */}
          {isUploadingPDF && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">
                Uploading... {uploadProgressPDF}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgressPDF}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {techSesh.document && !isUploadingPDF && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">PDF Preview</p>
              <div className="relative group w-full max-w-md">
                <embed
                  src={techSesh.document}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            </div>
          )}
        </div>
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
          {mode === "edit" ? "Publish Edit" : "Publish Technical Session"}
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
        <button
          disabled={isSubmitting}
          onClick={() => setShowPreview(true)}
          className=" py-1 text-primary text-base rounded-full w-full"
        >
          Preview
        </button>
      </div>
      {showPreview && (
        <PreviewTechnical
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          name={techSesh.name}
          document={techSesh.document}
          coverImg={techSesh.coverImg}
        />
      )}
    </div>
  );
}

export default TechnicalEdit;
