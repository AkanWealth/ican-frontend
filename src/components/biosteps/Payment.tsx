"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { BiodataFormData } from "../Biodata";
import InputEle from "../genui/InputEle";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { FilePlus, FileText, X } from "lucide-react"; // Import FileText and X icons

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

      <div className="w-full h-fit flex flex-col gap-3">
        <label className="font-semibold text-sm">
          Select Payment Option<span className="text-red-500">*</span>
        </label>
        <div className="w-full h-fit flex flex-row gap-3">
          <input
            className="p-3 rounded accent-primary cursor-pointer"
            name="PaymentOption"
            id="cardOption"
            required
            type="radio"
            value="card"
            checked={paymentOption === "card"}
            onChange={() => setPaymentOption("card")}
          />
          <label
            className="text-base font-sans font-semibold"
            htmlFor="cardOption"
          >
            Card<span className="text-red-600">*</span>
          </label>

          <input
            className="p-3 rounded accent-primary cursor-pointer"
            name="PaymentOption"
            id="bankOption"
            required
            type="radio"
            value="bank"
            checked={paymentOption === "bank"}
            onChange={() => setPaymentOption("bank")}
          />
          <label
            className="text-base font-sans font-semibold"
            htmlFor="bankOption"
          >
            Bank Deposit/Transfer<span className="text-red-600">*</span>
          </label>

          <input
            className="p-3 rounded accent-primary cursor-pointer"
            name="PaymentOption"
            id="waiverOption"
            required
            type="radio"
            value="waiver"
            checked={paymentOption === "waiver"}
            onChange={() => setPaymentOption("waiver")}
          />
          <label
            className="text-base font-sans font-semibold"
            htmlFor="waiverOption"
          >
            Waiver<span className="text-red-600">*</span>
          </label>
        </div>
      </div>

      {/* card */}
      {paymentOption == "card" && (
        <div>
          <InputEle
            id="Amount"
            placeholder="#25000"
            type="amount"
            label="Total amount due"
          />
        </div>
      )}

      {/* BANK TRANFER */}
      {paymentOption == "bank" && (
        <div>
          <InputEle
            id="Amount"
            placeholder="#25000"
            type="amount"
            label="Total amount due"
          />

          <div className="w-full flex flex-col gap-3">
            <div className="font-semibold text-base border-b-2 border-gray-300 py-2">
              <p>ICAN Surulere district account details</p>
            </div>

            <p className="text-sm">
              Send your payment to the bank listed below and upload your receipt
            </p>
            <div className="flex flex-row justify-between border border-gray-400 text-black p-4 rounded">
              <p className="font-semibold text-sm">Account Name</p>
              <p className="text-sm">ICAN Surulere and District Society</p>
            </div>
            <div className="flex flex-row justify-between border border-gray-400 text-black p-4 rounded">
              <p className="font-semibold text-sm">Bank Name</p>
              <p className="text-sm">First Bank</p>
            </div>
            <div className="flex flex-row justify-between border border-gray-400 text-black p-4 rounded">
              <p className="font-semibold text-sm">Account Number</p>
              <p className="text-sm">0099685574</p>
            </div>

            <div className="mt-4">
              <label className="font-semibold text-sm">
                Upload your receipt <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border border-gray-300 rounded-lg p-4 text-center cursor-pointer mt-2 h-32 flex items-center justify-center`}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={handleDrop}
                onClick={() => {
                  if (uploadState === "idle") {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(file);
                  }}
                />

                {/* Idle state - no file selected */}
                {uploadState === "idle" && (
                  <div className="flex flex-col items-center justify-center cursor-pointer">
                    <FilePlus size={40} className="text-gray-700 mb-2" />
                    <p className="text-sm text-gray-700">
                      Click to add file or drag any attachment here
                    </p>
                  </div>
                )}

                {/* Uploading state - progress bar */}
                {uploadState === "uploading" && (
                  <div className="w-full max-w-md">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-sm text-center">Uploading</p>
                  </div>
                )}

                {/* Complete state - file uploaded */}
                {uploadState === "complete" && (
                  <div className="flex flex-cols items-center justify-center w-full">
                    <div className="bg-white shadow-sm border rounded-lg px-3 py-2 flex items-center justify-between w-auto min-w-[200px]">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(fileName)}
                        <span className="text-sm truncate max-w-[180px]">
                          {fileName}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="ml-4 text-sm text-gray-700">
                      File upload complete
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weiver */}

      {paymentOption == "waiver" && (
        <div>
          <InputEle
            id="Amount"
            placeholder="#25000"
            type="amount"
            label="Total amount due"
          />

          <InputEle
            id="Waivercode"
            placeholder="Enter waiver code"
            type="text"
            label="Enter waiver code"
          />
        </div>
      )}
    </div>
  );
}

export default Payment;
