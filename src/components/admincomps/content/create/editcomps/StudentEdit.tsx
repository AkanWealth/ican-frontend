"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import apiClient from "@/services-admin/apiClient";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import PreviewStudent from "../previewcomps/PreviewStudent";
import { useToast } from "@/hooks/use-toast";

import { uploadPDF, validatePDF } from "@/lib/pdfUpload";

type StudyPack = {
  name: string;
  document: string;
};

function StudentEdit({ mode, id }: CreateContentProps) {
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);
  const [student, setStudent] = useState<StudyPack>({ name: "", document: "" });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { toast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(
          `${BASE_API_URL}/studypacks/${id}`
        );
        console.log("Study Packs details fetched:", response);
        setStudent({
          name: response.name,
          document: response.document || "",
        });
        setEditDataFetched(true);
        toast({
          title: "Success",
          description: "Study Pack details fetched successfully",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error fetching Study Pack",
          description: "Study Pack not found.",
          variant: "destructive",
        });
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Study Pack details for edit mode");
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
      setStudent((prev) => ({
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
      setIsUploading(false);
    }
  };

  const handleDeletePDF = (e: React.MouseEvent) => {
    e.preventDefault();
    setStudent((prev) => ({
      ...prev,
      document: "",
    }));
    toast({
      title: "PDF removed",
      description: "The PDF has been removed from the study pack.",
      variant: "default",
    });
  };

  const handleSubmit = async (status: "published" | "draft") => {
    const data = JSON.stringify({
      name: student.name,
      document: student.document,
    });

    const config = {
      method: mode === "edit" ? "PATCH" : "POST",
      maxBodyLength: Infinity,
      url:
        mode === "edit"
          ? `${BASE_API_URL}/studypacks/${id}`
          : `${BASE_API_URL}/studypacks`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: data,
    };

    try {
      const response = await apiClient.request(config);
      console.log("Study Pack submitted successfully:", response);
      setIsSubmitting(false);
      setIsLoading(false);
      toast({
        title: "Study Pack submitted successfully",
        description: "Study Pack submitted successfully",
        variant: "default",
      });
      window.location.reload();
    } catch (error) {
      setIsSubmitting(false);
      setIsLoading(false);
      toast({
        title: "Error submitting Study Pack",
        description: "An unknown error occurred",
        variant: "destructive",
      });
      console.error("Error submitting Study Pack:", error);
    }
  };

  return (
    <div>
      <div>
        <InputEle
          label="Title"
          type="text"
          id="name"
          value={student.name}
          onChange={(e) => setStudent({ ...student, name: e.target.value })}
        />
        {/* PDF Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Upload PDF ( 10Mb max)
          </label>

          {/* Image Upload Controls */}
          <div className="flex flex-wrap gap-4">
            <label className="bg-[#27378C] text-white px-6 py-2 rounded-full cursor-pointer hover:bg-blue-700 text-sm whitespace-nowrap">
              Upload PDF ( 10Mb max)
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePDFUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            {student.document && (
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
            <div className="my-2 space-y-2">
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
          {student.document && !isUploading && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">PDF Preview</p>
              <div className="relative group w-full max-w-md">
                <embed
                  src={student.document}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col mt-4 gap-2">
        <button
          disabled={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setIsLoading(true);
            handleSubmit("published");
          }}
          className="rounded-full py-2 bg-primary text-white text-base w-full"
        >
          {mode === "edit" ? "Upload Edit" : "Upload Study Packs"}
        </button>

        <button
          onClick={() => setShowPreview(true)}
          className=" py-1 text-primary text-base rounded-full w-full"
        >
          Preview
        </button>
      </div>
      {showPreview && (
        <PreviewStudent
          name={student.name}
          document={student.document}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      )}
    </div>
  );
}

export default StudentEdit;
