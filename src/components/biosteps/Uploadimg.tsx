"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";

import { BiodataFormData } from "../homecomps/Biodata";
import Toast from "../genui/Toast";

interface UploadimgProps {
  isShown: boolean;
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Uploadimg({ isShown, formData, updateFormData }: UploadimgProps) {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  var bucket = "";
  if (isShown) {
    bucket = "flex";
  } else {
    bucket = "hidden";
  }

  useEffect(() => {
    if (formData.image) {
      const previewUrl = URL.createObjectURL(formData.image);
      setImagePreview(previewUrl);

      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }
  }, [formData.image]);

  const handleImageChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return <Toast type="error" message="Please upload an image file" />;
    }

    if (file.size > 5 * 1024 * 1024) {
      return <Toast type="error" message="Image must be less than 5MB" />;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    updateFormData({ image: file });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageChange(file);
  };

  const validateForm = () => {
    if (!formData.image) {
      <Toast type="error" message="Please upload an image" />;
      return false;
    }
  };
  //   const handleImageChange = (e) => {
  //     if (e.target.files && e.target.files[0]) {
  //       //   setSelectedImage(URL.createObjectURL(e.target.files[0]));
  //     }
  //  };
  return (
    <div className={`${bucket} pt-4 flex flex-col justify-between gap-4 `}>
      <h3 className="font-bold font-mono text-2xl text-black ">
        UPLOAD IMAGE
        <hr />
      </h3>
      <div>
        <div
          className={` relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600"
            }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageChange(file);
            }}
          />

          {imagePreview ? (
            <div className="relative h-48 w-full">
              <Image
                src={imagePreview}
                alt="Image preview"
                fill
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                  }
                  setImagePreview(null);
                  updateFormData({ image: null });
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full
                         hover:bg-red-600 transition-colors duration-200"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center h-full cursor-pointer"
            >
              <Image
                width={100}
                height={100}
                src="/avatar.png"
                alt="Upload your Image"
              />{" "}
              <div className="text-gray-600 dark:text-gray-300">
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Drag and drop your profile image here
                </p>
                <p className="text-sm">or click to browse</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Uploadimg;
