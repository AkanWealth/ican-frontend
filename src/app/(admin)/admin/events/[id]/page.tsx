"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { MdDownload, MdOutlineModeEditOutline } from "react-icons/md";
import FeedbackModal from "@/components/admincomps/event/FeedbackModal";

import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/utils/setter";

import axios from "axios";
import Cookies from "universal-cookie";

import { EventDetails } from "@/libs/types";

import { handleUnauthorizedRequest } from "@/utils/refresh_token";
import { useToast } from "@/hooks/use-toast";

function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast();
  const cookies = new Cookies();

  const router = useRouter();
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    id: "",
    name: "",
    description: "",
    date: "",
    time: "",
    fee: 0,
    venue: "",
    flyer: "",
    mcpd_credit: 0,
    meeting_link: "",
    status: "DRAFT",
    createdAt: new Date().toISOString(),
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const feedbacks = [
    {
      id: "1",
      rating: 5,
      comment: "Great event! Really enjoyed it.",
      createdAt: new Date("2024-03-10"),
    },
    {
      id: "2",
      rating: 3,
      comment: "It was okay, could be better organized.",
      createdAt: new Date("2024-03-09"),
    },
    // ... more feedback items
  ];
  useEffect(() => {
    async function fetchData() {
      const eventId = (await params).id;
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/events/${eventId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      try {
        const result = await axios.request(config);
        if (result.status === 200) {
          setEventDetails(result.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            await handleUnauthorizedRequest(config, router, setEventDetails);
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch event data.",
              variant: "destructive",
            });
          }
        } else {
          // Handle unexpected errors
          toast({
            title: "Error",
            description: "An unexpected error occurred.",
            variant: "destructive",
          });
        }
      }
    }

    fetchData();
  }, [params, router, toast]);

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-row w-full mb-2  justify-between items-center">
        <div className="flex flex-col gap-2  w-full  h-fit">
          <h1 className=" text-2xl font-medium text-black ">Event Details</h1>
          <p className=" text-sm font-medium text-gray-500 ">
            Showing Event details
          </p>
        </div>
        <div className="flex flex-row w-fit items-center gap-3">
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            View Feedback
          </button>

          <FeedbackModal
            eventId={eventDetails.id}
            isOpen={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
            feedbacks={feedbacks}
          />
          <button className="w-fit whitespace-nowrap rounded px-3 text-black fill-black border-gray-400 border py-2 flex flex-row items-center gap-2 bg-white">
            <MdDownload className="w-5 h-5" /> Export Event
          </button>
        </div>
      </div>
      <div className="rounded-xl border bg-white w-full border-gray-200 flex p-4 flex-col">
        <div className="flex flex-row items-center justify-between w-full">
          <h1 className=" text-2xl font-medium text-black ">
            {eventDetails.name}
          </h1>
          <MdOutlineModeEditOutline className="w-5 h-5" />
        </div>
        <hr />
        <div className="w-full flex flex-row justify-between gap-4 items-center ">
          <div className="flex py-3 flex-col justify-between gap-4">
            <p className="flex flex-col gap-1 text-left text-base font-medium text-gray-800  ">
              <span className="text-sm text-gray-600 font-medium ">
                Event Description{" "}
              </span>
              {eventDetails.description}
            </p>
            <p className="flex flex-col gap-1 text-left text-base font-medium text-gray-800  ">
              <span className="text-sm text-gray-600 font-medium ">
                Event Date{" "}
              </span>
              {eventDetails.date}
            </p>
            <p className="flex flex-col gap-1 text-left text-base font-medium text-gray-800  ">
              <span className="text-sm text-gray-600 font-medium ">
                Event Time{" "}
              </span>
              {eventDetails.time}
            </p>
            <p className="flex flex-col gap-1 text-left text-base font-medium text-gray-800  ">
              <span className="text-sm text-gray-600 font-medium ">
                Event Fee{" "}
              </span>
              {eventDetails.fee}
            </p>
            <p className="flex flex-col gap-1 text-left text-base font-medium text-gray-800  ">
              <span className="text-sm text-gray-600 font-medium ">
                Event Venue
              </span>
              {eventDetails.venue}
            </p>
          </div>
          <div className="w-full">
            <Image
              src={eventDetails.flyer || ""}
              width={400}
              height={400}
              alt="Event image"
              className="rounded-xl mx-auto py-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsPage;
