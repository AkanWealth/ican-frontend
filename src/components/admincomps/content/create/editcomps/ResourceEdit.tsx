"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import { useToast } from "@/hooks/use-toast";

import { uploadPDF, validatePDF } from "@/lib/pdfUpload";

interface Resource {
  title: string;
  description: string;
  type: string;
  access: string;
  fileurl: string;
}

function ResourceEdit({ mode, id }: CreateContentProps) {
  const { toast } = useToast();
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [resource, setResource] = useState<Resource>({
    title: "",
    description: "",
    type: "",
    access: "",
    fileurl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setResource((prevResource) => ({
      ...prevResource,
      [id]: value,
    }));
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(
          `${BASE_API_URL}/resources/content/${id}`
        );
        console.log("Resource details fetched:", response);
        setResource({
          title: response.title,
          description: response.description,
          type: response.type,
          access: response.access,
          fileurl: response.fileurl,
        });
        setEditDataFetched(true);
        setIsSubmitting(false);
        toast({
          title: "Resource details fetched successfully",
          description: "Resource details fetched successfully",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Resource not found.",
        });
        setIsSubmitting(false);
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Resource details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, mode, toast]);

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
      setIsUploading(true);
      setUploadProgress(0);

      // Create a unique folder path for advert images
      // Use the S3 upload function from galleryUpload.js but with an advert-specific path
      const uploadedUrl = await uploadPDF(file, (progress) => {
        setUploadProgress(progress);
      });

      console.log("Uploaded PDF URL:", uploadedUrl);

      // Update state with the new URL
      setResource((prev) => ({
        ...prev,
        fileurl: uploadedUrl,
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
      setIsUploading(false);
    }
  };

  const handleDeletePDF = (e: React.MouseEvent) => {
    e.preventDefault();
    setResource((prev) => ({
      ...prev,
      fileurl: "",
    }));
    toast({
      title: "PDF removed",
      description: "The PDF has been removed from the resource.",
      variant: "default",
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!resource.title || !resource.description || !resource.type || !resource.access || !resource.fileurl) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }

    try {
      const response = await apiClient.post(
        `${BASE_API_URL}/resources/content`,
        resource
      );
      console.log("Resource created:", response.data);
      toast({
        title: "Resource created successfully",
        description: "Resource created successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating resource:", error);
      toast({
        title: "Error",
        description: "Error creating resource",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-col mb-6 w-full items-start justify-between">
        <InputEle
          label="Resource Title"
          type="text"
          id="title"
          onChange={handleChange}
          value={resource.title}
        />
        <InputEle
          label="Resource Description"
          type="text"
          id="description"
          onChange={handleChange}
          value={resource.description}
        />
        <InputEle
          label="Resource Type"
          type="text"
          id="type"
          onChange={handleChange}
          value={resource.type}
        />
        <InputEle
          label="Resource Access"
          type="select"
          id="access"
          onChange={handleChange}
          options={[
            { value: "PUBLIC", label: "Public" },
            { value: "MEMBERS", label: "Members" },
          ]}
          value={resource.access}
        />
        <InputEle
          label="Upload File (PDF)"
          type="file"
          id="resource_file"
          onChange={() => {}}
          value={resource.fileurl}
        />
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
                disabled={isUploading}
              />
            </label>
            {resource.fileurl && (
              <button
                onClick={handleDeletePDF}
                className="bg-[#E7EAFF] text-[#27378C] px-6 py-2 rounded-full hover:bg-gray-200 text-sm whitespace-nowrap"
                disabled={isUploading}
              >
                Remove PDF
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
          {resource.fileurl && !isUploading && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">PDF Preview</p>
              <div className="relative group w-full max-w-md">
                <embed
                  src={resource.fileurl}
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
          onClick={handleSubmit}
          className="rounded-full py-2 bg-primary text-white text-base w-full"
        >
          {isSubmitting ? "Uploading..." : "Upload Resource"}
        </button>

        <button className=" py-1 text-primary text-base rounded-full w-full">
          Preview
        </button>
      </div>
    </div>
  );
}

export default ResourceEdit;
