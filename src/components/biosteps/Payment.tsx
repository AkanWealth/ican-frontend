"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { BiodataFormData } from "../homecomps/Biodata";
import InputEle from "../genui/InputEle";
import { useToast } from "@/hooks/use-toast";
import { FilePlus, FileText, X } from "lucide-react"; // Import FileText and X icons
import FlutterModal from "@/components/genui/FlutterModal";

interface PaymentProps {
  isShown: boolean;

  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Payment({ formData, updateFormData }: PaymentProps) {
  const { toast } = useToast();

  // Payment option states
  const [paymentOption, setPaymentOption] = useState<string>("card");

  // File upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "complete"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    if (formData.image) {
      setUploadedFile(formData.image);
      setFileName(formData.image.name);
      setUploadState("complete");
    }
  }, [formData.image]);

  const handleFileChange = (file: File) => {
    // Check if the file is an acceptable type (image, PDF, or document)
    const acceptedFileTypes = [
      "image/",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const isAcceptedType = acceptedFileTypes.some(
      (type) =>
        file.type.startsWith(type) ||
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    if (!isAcceptedType) {
      toast({
        title: "",
        description:
          "Please upload an image, PDF or document file for your receipt",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "",
        description: "Receipt file must be less than 5MB",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    // Set uploading state
    setUploadState("uploading");
    setUploadedFile(file);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadState("complete");
        setFileName(file.name);
        updateFormData({ image: file });
      }
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileName("");
    setUploadState("idle");
    setUploadProgress(0);
    updateFormData({ image: null });
  };

  // Function to get appropriate icon based on file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (
      ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension || "")
    ) {
      return <FileText size={20} className="text-blue-500" />;
    } else if (extension === "pdf") {
      return <FileText size={20} className="text-red-500" />;
    } else if (["doc", "docx"].includes(extension || "")) {
      return <FileText size={20} className="text-blue-700" />;
    } else if (["xls", "xlsx"].includes(extension || "")) {
      return <FileText size={20} className="text-green-600" />;
    } else {
      return <FileText size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
      <h3 className="font-bold font-mono text-xl text-black">
        PAYMENT <hr />
      </h3>

      <p>To complete your registration, you need to make payments</p>

      {/* Payment options */}
      <FlutterModal
        title="Member registration"
        amount={25000}
        email={formData.contactDetails.email}
        phone_number={formData.contactDetails.mobileNumber}
        name={
          formData.personalData.firstName + " " + formData.personalData.surname
        }
      />
      {/* Weiver */}

      {paymentOption == "waiver" && (
        <InputEle
          id="waivercode"
          placeholder="Enter waiver code"
          type="text"
          label="Enter waiver code"
          onChange={() => {}}
        />
      )}
    </div>
  );
}

export default Payment;
