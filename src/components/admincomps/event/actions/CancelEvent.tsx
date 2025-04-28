import React, { useState } from "react";
import { MdSubtitles, MdDeleteOutline } from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { useToast } from "@/hooks/use-toast";

interface CancelEventProps {
  id: string;
  eventName: string;
  date: string;
  onClose: () => void;
}

function CancelEvent({ id, eventName, date, onClose }: CancelEventProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const handleCancel = () => {
    let data = JSON.stringify({
      status: "CANCELLED",
    });

    setIsLoading(true);
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/events/${id}/status`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        toast({
          title: "Event Cancelled",
          description: response.data.message,
          variant: "default",
        });

        onClose(); // Close the modal after successful update
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
        setIsLoading(false);
      });
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-4 rounded-xl gap-4 bg-white">
        <div className="flex flex-row justify-start gap-4">
          <div className="rounded-full  h-fit w-fit p-4 bg-red-200">
            <MdDeleteOutline className="w-6 h-6 fill-red-600" />
          </div>
          <div>
            <div className="flex flex-col w-fit gap-2">
              <h5 className="font-semibold text-xl text-black">Cancel Event</h5>
              <p className="text-sm text-neutral-600 text-wrap">
                If you cancel this event, the event will no longer take place
                and members will be notified via email. Are you sure you want to
                proceed?{" "}
              </p>
            </div>
            <div className="flex flex-col w-fit gap-2 mt-4">
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base flex-row  items-center gap-2">
                  <MdSubtitles className="w-4 h-4" /> Name:
                </p>
                <p className="text-black font-medium text-base ">{eventName}</p>
              </div>
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base   items-center flex-row gap-2">
                  <HiOutlineTag className="w-4 h-4" /> Date:
                </p>
                <p className="text-black font-medium text-base ">
                  {new Date(date).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-fit justify-between">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex items-center w-fit  text-nowrap text-center justify-center bg-red-600 font-semibold text-base text-white rounded-full py-3 px-4 h-10"
          >
            Cancel Event
          </button>
          <button
            onClick={onClose}
            className="flex items-center w-fit  text-nowrap text-center justify-center bg-transparent font-semibold text-base text-neutral-700 border border-primary rounded-full py-3 px-4 h-10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelEvent;
