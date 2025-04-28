"use state";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";
import Cookies from "universal-cookie";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";

import { CreateContentProps } from "@/libs/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { uploadImageToCloud } from "@/lib/uploadImage";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [advertImage, setAdvertImage] = useState<string | null | File>(null);
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
          name: response.name || advert.name,
          advertiser: response.advertiser || advert.advertiser,
          image: response.image || advert.image,
          textBody: response.textBody || advert.textBody,
          startDate: response.startDate
            ? new Date(response.startDate)
            : advert.startDate,
          endDate: response.endDate
            ? new Date(response.endDate)
            : advert.endDate,
        });
        setEditDataFetched(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching transaction details for edit mode");
      fetchDetails();
    }
  }, [
    advert.advertiser,
    advert.endDate,
    advert.image,
    advert.name,
    advert.startDate,
    advert.textBody,
    editDataFetched,
    id,
    mode,
    toast,
  ]);

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size <= 5 * 1024 * 1024) {
      try {
        // Show loading state
        // You might want to add a loading state to your component
        setIsLoading(true);

        // Upload the file to cloud storage
        const imageUrl = await uploadImageToCloud(file);

        console.log("Uploaded image URL:", imageUrl);
        // Update state with the new URL
        setAdvertImage(imageUrl);
        setAdvert((prev) => ({
          ...prev,
          image: imageUrl,
        }));

        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading photo:", error);
        // alert("Failed to upload photo. Please try again.");
        toast({
          title: "Failed to upload photo",
          description: "Please try again. ",
          variant: "destructive",
          duration: 2000,
        });
        setIsLoading(false);
      }
    } else {
      // alert("Please select an image under 5MB");
      toast({
        title: "Failed to upload photo",
        description: "Please select an image under 5MB",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleDeletePhoto = () => {
    setAdvertImage(null);
    setAdvert((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleSubmit = async (status: "published" | "draft") => {
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
      const response = await apiClient.request(config);
      setIsSubmitting(false);
      setIsLoading(false);
      toast({
        title: "Advert created successfully!",
        description: "Refreach the page to see changes.",
        variant: "default",
        duration: 2000,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Failed to create Advert",
        description: "Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <form>
      <div>
        <InputEle
          label="Advert Title"
          type="text"
          id="name"
          value={advert.name}
          onChange={(e) => setAdvert({ ...advert, name: e.target.value })}
        />
        <InputEle
          label="Advertizer"
          type="text"
          id="advertiser"
          value={advert.advertiser}
          onChange={(e) => setAdvert({ ...advert, advertiser: e.target.value })}
        />

        <div className="flex flex-col gap-4">
          <span className="text-sm text-gray-500">(Upload Advert Image)</span>
          <div className="flex flex-wrap gap-4">
            <label className="bg-[#27378C] text-white px-6 py-2 rounded-full cursor-pointer hover:bg-blue-700 text-sm whitespace-nowrap">
              Upload Image
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleDeletePhoto}
              className="bg-[#E7EAFF] text-[#27378C] px-6 py-2 rounded-full hover:bg-gray-200 text-sm whitespace-nowrap"
            >
              Delete photo
            </button>
          </div>
        </div>
        <InputEle
          label="Text Body"
          type="text"
          id="text_body"
          value={advert.textBody}
          onChange={(e) => setAdvert({ ...advert, textBody: e.target.value })}
        />
        <InputEle
          label="Start Date"
          type="date"
          id="start_date"
          value={advert.startDate.toISOString().split("T")[0]}
          onChange={(e) =>
            setAdvert({ ...advert, startDate: new Date(e.target.value) })
          }
        />
        <InputEle
          label="End Date"
          type="date"
          id="end_date"
          value={advert.endDate.toISOString().split("T")[0]}
          onChange={(e) =>
            setAdvert({ ...advert, endDate: new Date(e.target.value) })
          }
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
          {mode === "edit" ? "Publish Edit" : "Publish Advert"}
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
          onClick={() => setShowPreview(true)}
          className=" py-1 text-primary text-base rounded-full w-full"
        >
          Preview
        </button>
      </div>
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
