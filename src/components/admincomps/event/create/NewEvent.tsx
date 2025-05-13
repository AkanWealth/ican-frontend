"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";
import { MdClose } from "react-icons/md";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";

import { uploadGalleryImage, validateGalleryImage } from "@/lib/galleryUpload";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

import { useRouter } from "next/navigation";

function NewEvent({
  id,
  mode,
  showNewEvent,
  setShowNewEvent,
}: {
  id?: string;
  mode?: "create" | "edit";
  showNewEvent: boolean;
  setShowNewEvent: (show: boolean) => void;
}) {
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [eventPhoto, setEventPhoto] = useState<File | string | null>(null);
  const [formData, setFormData] = useState({
    event_id: "",
    eventName: "",
    venue: "",
    eventDescription: "",
    eventDate: "",
    eventTime: "",
    eventFee: "",
    mcpdCredit: "",
    eventPhoto: "",
  });
  // State to handle form validation errors
  const [formErrors, setFormErrors] = useState({
    eventName: "",
    venue: "",
    eventDescription: "",
    eventDate: "",
    eventTime: "",
    eventFee: "",
    mcpdCredit: "",
    eventPhoto: "",
  });

  // Function to validate form fields
  const validateForm = () => {
    let isValid = true;
    const errors = {
      eventName: "",
      venue: "",
      eventDescription: "",
      eventDate: "",
      eventTime: "",
      eventFee: "",
      mcpdCredit: "",
      eventPhoto: "",
    };

    // Validate event name
    if (!formData.eventName.trim()) {
      errors.eventName = "Event name is required";
      isValid = false;
    }

    // Validate venue
    if (!formData.venue.trim()) {
      errors.venue = "Venue is required";
      isValid = false;
    }

    // Validate description
    if (!formData.eventDescription.trim()) {
      errors.eventDescription = "Event description is required";
      isValid = false;
    }

    // Validate date
    if (!formData.eventDate) {
      errors.eventDate = "Event date is required";
      isValid = false;
    }

    // Validate time
    if (!formData.eventTime) {
      errors.eventTime = "Event time is required";
      isValid = false;
    }

    // Validate fee (must be zero or positive number)
    if (isNaN(Number(formData.eventFee)) || Number(formData.eventFee) < 0) {
      errors.eventFee = "Please enter a valid event fee (0 or greater)";
      isValid = false;
    }
    // Validate event date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (!formData.eventDate) {
      errors.eventDate = "Event date is required";
      isValid = false;
    } else if (new Date(formData.eventDate) < tomorrow) {
      errors.eventDate = "Event date must be at least tomorrow";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/events/${id}`,
          headers: {},
        };

        const response = await apiClient.request(config);
        console.log(JSON.stringify(response));

        // Populate formData with fetched data
        setFormData({
          event_id: response.id || "",
          eventName: response.name || "",
          venue: response.venue || "",
          eventDescription: response.description || "",
          eventDate: response.date
            ? new Date(response.date).toISOString().split("T")[0]
            : "",
          eventTime: response.time || "",
          eventFee: response.fee ? response.fee.toString() : "",
          mcpdCredit: response.mcpd_credit
            ? response.mcpd_credit.toString()
            : "",
          eventPhoto: response.flyer || null,
        });

        setEditDataFetched(true);
        toast({
          title: "Event details fetched successfully",
          description: "Event details fetched successfully",
          variant: "default",
        });
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast({
          title: "Error fetching event details",
          description: "Error fetching event details",
          variant: "destructive",
        });
      }
    };

    if (mode === "edit" && id && !editDataFetched) {
      fetchDetails();
    }
  }, [editDataFetched, id, mode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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

      console.log("Uploaded Event image URL:", uploadedUrl);

      // Update state with the new URL
      setEventPhoto(uploadedUrl);
      setFormData((prev) => ({
        ...prev,
        eventPhoto: uploadedUrl,
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error uploading event image:", error);
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
    setEventPhoto(null);
    setFormData((prev) => ({
      ...prev,
      eventPhoto: "",
    }));
    toast({
      title: "Image removed",
      description: "The image has been removed from the event.",
      variant: "default",
    });
  };

  const handleCancel = () => {
    // Reset form data to initial state
    setFormData({
      event_id: "",
      eventName: "",
      venue: "",
      eventDescription: "",
      eventDate: "",
      eventTime: "",
      eventFee: "",
      mcpdCredit: "",
      eventPhoto: "",
    });
    // Reset form errors to initial state
    setFormErrors({
      eventName: "",
      venue: "",
      eventDescription: "",
      eventDate: "",
      eventTime: "",
      eventFee: "",
      mcpdCredit: "",
      eventPhoto: "",
    });
    // Close the modal
    setShowNewEvent(false);
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);

    if (!validateForm()) {
      setIsSavingDraft(false);
      return;
    }
    const draftEvent = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Retrieve token from local storage
        const formDataToSend = {
          eventName: formData.eventName,
          venue: formData.venue,
          eventDescription: formData.eventDescription,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          eventFee: formData.eventFee ? parseFloat(formData.eventFee) : 0,
          eventPhoto: formData.eventPhoto, // Assuming this is a URL or file path
          mcpdCredit: formData.mcpdCredit ? parseInt(formData.mcpdCredit) : 0,
          status: "DRAFT",
        };
        const config = {
          method: mode === "edit" ? "patch" : "post",
          url:
            mode === "edit"
              ? `${BASE_API_URL}/events/${id}`
              : `${BASE_API_URL}/events`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: JSON.stringify(formDataToSend),
        };

        const response = await apiClient.request(config);
        console.log("Event added to drafts successfully:", response);
        handleCancel(); // Close the modal after successful draft

        toast({
          title: "Event added to drafts successfully!",
          description: "Event added to drafts successfully!",
          variant: "default",
        });
        setIsPublishing(false);
        setIsSavingDraft(false);
        router.refresh();
      } catch (error) {
        console.error("Error adding the event to draft:", error);
        toast({
          title: "Error adding the event to draft!",
          description: "Error adding the event to draft!",
          variant: "destructive",
        });
        handleCancel(); // Close the modal after 3 seconds
        setIsPublishing(false);
        setIsSavingDraft(false);
        router.refresh();
      }
    };
    draftEvent();
  };

  const handlePublish = () => {
    setIsPublishing(true);
    // Validate form before publishing
    if (!validateForm()) {
      setIsPublishing(false);
      return;
    }
    const publishEvent = async () => {
      // Validate that eventPhoto is not empty before publishing
      if (!formData.eventPhoto) {
        toast({
          title: "Event Photo Required",
          description: "Please upload an event photo before publishing",
          variant: "destructive",
        });
        setIsPublishing(false);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken"); // Retrieve token from local storage
        const formDataToSend = {
          eventName: formData.eventName,
          venue: formData.venue,
          eventDescription: formData.eventDescription,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          eventFee: formData.eventFee ? parseFloat(formData.eventFee) : 0,
          eventPhoto: formData.eventPhoto, // Assuming this is a URL or file path
          mcpdCredit: formData.mcpdCredit ? parseInt(formData.mcpdCredit) : 0,
          status: "UPCOMING",
        };

        const config = {
          method: mode === "edit" ? "patch" : "post",
          url:
            mode === "edit"
              ? `${BASE_API_URL}/events/${id}`
              : `${BASE_API_URL}/events`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: JSON.stringify(formDataToSend),
        };

        const response = await apiClient.request(config);
        console.log("Event published successfully:", response);

        handleCancel();
        toast({
          title: "Event published successfully!",
          description: "Event published successfully!",
          variant: "default",
        });
        setIsPublishing(false);
        setIsSavingDraft(false);
        router.refresh();
      } catch (error) {
        console.error("Error publishing event:", error);
        toast({
          title: "Error publishing event!",
          description: "Error publishing event!",
          variant: "destructive",
        });
        setIsPublishing(false);
        setIsSavingDraft(false);
        router.refresh();
      }
    };

    publishEvent();
  };

  return (
    <div className="fixed inset-0 z-20 bg-gray-800 bg-opacity-80 flex items-center justify-center overflow-y-auto py-8">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[900px] max-w-[95%] max-h-[90vh] overflow-y-auto">
        <div className="flex flex-row justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-primary">
            {mode === "edit" ? "Edit Event" : "Create New Event"}
          </h2>

          <button
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={handleCancel}
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InputEle
            type="text"
            id="eventName"
            label="Event Name"
            required
            value={formData.eventName}
            onChange={handleChange}
            errorMsg={formErrors.eventName}
          />
          <InputEle
            type="text"
            id="venue"
            label="Venue"
            required
            value={formData.venue}
            onChange={handleChange}
            errorMsg={formErrors.venue}
          />
        </div>

        <div className="mb-6">
          <InputEle
            type="text"
            id="eventDescription"
            label="Event Description"
            value={formData.eventDescription}
            onChange={handleChange}
            errorMsg={formErrors.eventDescription}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`w-full h-fit flex flex-col gap-3`}>
            <label
              className="text-base font-sans font-semibold"
              htmlFor={"eventDate"}
            >
              Event Date
              <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              className="p-3 rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
              name={"eventDate"}
              id={"eventDate"}
              value={formData.eventDate}
              required={true}
              type={"date"}
              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              onChange={handleChange}
            />

            <p className="text-red-600 text-sm font-light">
              {formErrors.eventDate}
            </p>
          </div>
          <InputEle
            type="time"
            id="eventTime"
            label="Event Time"
            required
            value={formData.eventTime}
            onChange={handleChange}
            errorMsg={formErrors.eventTime}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InputEle
            type="text"
            id="eventFee"
            label="Event Fee in Naira (Optional)"
            required={false}
            value={formData.eventFee}
            onChange={handleChange}
            errorMsg={formErrors.eventFee}
          />
          <InputEle
            type="text"
            id="mcpdCredit"
            label="MCPD Credit (Optional)"
            required={false}
            value={formData.mcpdCredit}
            onChange={handleChange}
            errorMsg={formErrors.mcpdCredit}
          />
        </div>

        {/* Event Image */}
        <div className="space-y-4 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-base font-medium text-gray-700">
            Event Image
          </label>

          {/* Image Upload Controls */}
          <div className="flex flex-wrap gap-4">
            <label className="bg-primary text-white px-6 py-2.5 rounded-full cursor-pointer hover:bg-blue-700 text-sm font-medium transition-colors duration-200 flex items-center justify-center">
              <span className="mr-2">Upload Image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            {(eventPhoto || formData.eventPhoto) && (
              <button
                onClick={handleDeleteImage}
                className="bg-[#FEE2E2] text-red-600 px-6 py-2.5 rounded-full hover:bg-red-100 text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                disabled={isUploading}
              >
                <span>Remove Image</span>
              </button>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium text-gray-600">
                Uploading... {uploadProgress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {(eventPhoto || formData.eventPhoto) && !isUploading && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 text-gray-700">
                Image Preview
              </p>
              <div className="relative group w-full max-w-lg mx-auto">
                <img
                  src={(eventPhoto as string) || formData.eventPhoto}
                  alt="Event Image"
                  className="w-full h-64 object-contain bg-white border rounded-lg shadow-sm"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 border-t pt-6">
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className={`border border-primary text-primary hover:bg-blue-50 font-medium px-6 py-3 rounded-lg transition-colors duration-200 ${
                isSavingDraft || isPublishing
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isPublishing}
            >
              {isSavingDraft ? "Saving Draft..." : "Save as Draft"}
            </button>
            <button
              className={`bg-primary hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 ${
                isPublishing || isSavingDraft
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handlePublish}
              disabled={isPublishing || isSavingDraft}
            >
              {isPublishing ? "Publishing..." : "Publish Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewEvent;
