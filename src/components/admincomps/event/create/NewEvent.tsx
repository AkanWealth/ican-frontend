"use client";

import React, { useState } from "react";
import InputEle from "@/components/genui/InputEle";
import { MdClose } from "react-icons/md";

function NewEvent({
  showNewEvent,
  setShowNewEvent,
}: {
  showNewEvent: boolean;
  setShowNewEvent: (show: boolean) => void;
}) {
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
    // Handle publish event action
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
            value={formData.eventFee}
            onChange={handleChange}
          />
          
        </div>
        <InputEle
          type="file"
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
