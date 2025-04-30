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
          url: mode === "edit" ? `${BASE_API_URL}/events/${id}` : `${BASE_API_URL}/events`,
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
          variant: "destructive"
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
          url: mode === "edit" ? `${BASE_API_URL}/events/${id}` : `${BASE_API_URL}/events`,
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
    <div className="fixed inset-0 z-10 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-fit ">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create New Event</h2>

          <button
            className=" text-black hover:text-gray-700"
            onClick={handleCancel}
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-row items-center gap-4 justify-between">
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
        <InputEle
          type="text"
          id="eventDescription"
          label="Event Description"
          value={formData.eventDescription}
          onChange={handleChange}
          errorMsg={formErrors.eventDescription}
        />
        <div className="flex flex-row items-center gap-4 justify-between">
          <div className={` w-full h-fit flex flex-col gap-3 `}>
            <label
              className=" text-base font-sans font-semibold  "
              htmlFor={"eventDate"}
            >
              Event Date
              <span className="text-red-600">*</span>
            </label>
            <input
              className=" p-3 rounded border border-gray-400  "
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
        <div className="flex flex-row items-center gap-4 justify-between">
          <InputEle
            type="text"
            id="eventFee"
            label="Event Fee in Naira (Optional)"
            required={false}
            value={formData.eventFee}
            onChange={handleChange}
            errorMsg={formErrors.eventFee}
          />
        </div>

        {/* Event Image */}
        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Event Image</label>

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
            {eventPhoto && (
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
          {eventPhoto && !isUploading && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">Image Preview</p>
              <div className="relative group w-full max-w-md">
                <img
                  src={eventPhoto as string}
                  alt="Event Image"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            </div>
          )}
          {mode === "edit" && formData.eventPhoto && !isUploading && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">Current Flyer</p>
              <div className="relative group w-full max-w-md">
                <img
                  src={formData.eventPhoto}
                  alt="Event Flyer"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-500 w-full  text-white px-4 py-2 rounded mr-2"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className={`bg-white text-primary w-full px-4 py-2 rounded mr-2 ${
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
            className={`bg-primary text-white w-full px-4 py-2 rounded ${
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
  );
}

export default NewEvent;
