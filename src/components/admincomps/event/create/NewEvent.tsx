"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import Toast from "@/components/genui/Toast";

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
  const [formData, setFormData] = useState({
    event_id: "",
    eventName: "",
    venue: "",
    eventDescription: "",
    eventDate: "",
    eventTime: "",
    eventFee: "",
    mcpdCredit: "",
    eventPhoto: null,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/events/${id}`,
          headers: {},
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));

        // Populate formData with fetched data
        setFormData({
          event_id: response.data.id || "",
          eventName: response.data.name || "",
          venue: response.data.venue || "",
          eventDescription: response.data.description || "",
          eventDate: response.data.date || "",
          eventTime: response.data.time || "",
          eventFee: response.data.fee ? response.data.fee.toString() : "",
          mcpdCredit: response.data.mcpd_credit
            ? response.data.mcpd_credit.toString()
            : "",
          eventPhoto: response.data.eventPhoto || null,
        });

        setEditDataFetched(true);
      } catch (error) {
        console.error("Error fetching event details:", error);
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
      eventPhoto: null,
    });
    // Close the modal
    setShowNewEvent(false);
  };

  const handleSaveDraft = () => {
    // Handle save as draft action
  };

  const handlePublish = () => {
    const publishEvent = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Retrieve token from local storage
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
          method: "post",
          url: `${BASE_API_URL}/events`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: JSON.stringify(formDataToSend),
        };

        const response = await axios.request(config);
        console.log("Event published successfully:", response.data);
        handleCancel(); // Close the modal after successful publish
        return <Toast type="success" message="Event published successfully!" />;
      } catch (error) {
        console.error("Error publishing event:", error);
        return <Toast type="error" message="Error publishing event!" />;
      }
    };

    publishEvent();
  };

  return (
    <div className="fixed z-10 inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-1/2">
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
          />
          <InputEle
            type="text"
            id="venue"
            label="Venue"
            required
            value={formData.venue}
            onChange={handleChange}
          />
        </div>
        <InputEle
          type="text"
          id="eventDescription"
          label="Event Description"
          value={formData.eventDescription}
          onChange={handleChange}
        />
        <div className="flex flex-row items-center gap-4 justify-between">
          <InputEle
            type="date"
            id="eventDate"
            label="Event Date"
            required
            value={formData.eventDate}
            onChange={handleChange}
          />
          <InputEle
            type="time"
            id="eventTime"
            label="Event Time"
            required
            value={formData.eventTime}
            onChange={handleChange}
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
          />
        </div>
        <InputEle
          type="images"
          id="eventPhoto"
          label="Upload Event Photo/Flyer"
          onChange={handleChange}
        />
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-500 w-full  text-white px-4 py-2 rounded mr-2"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-white text-primary w-full px-4 py-2 rounded mr-2"
            onClick={handleSaveDraft}
          >
            Save as Draft
          </button>
          <button
            className="bg-primary text-white w-full px-4 py-2 rounded"
            onClick={handlePublish}
          >
            Publish Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewEvent;
