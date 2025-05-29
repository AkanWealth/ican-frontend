"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { MdDownload, MdOutlineModeEditOutline } from "react-icons/md";
import FeedbackModal from "@/components/admincomps/event/FeedbackModal";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";

import Cookies from "universal-cookie";

import { EventDetails, RegisteredUsers } from "@/libs/types";
import { useToast } from "@/hooks/use-toast";
import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import { UserAttendanceTable } from "@/components/admincomps/event/attendance/UserAttendanceTable";
import { registereduserscolumns } from "@/components/admincomps/event/attendance/columns";

function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast();
  const cookies = new Cookies();

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUsers[]>([]);

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
  const [feedbacks, setFeedbacks] = useState([]);

  // useEffect(() => {
  //   let isMounted = true;
  //   let retryCount = 0;
  //   const maxRetries = 3;
  //   const retryDelay = 1000;

  //   async function fetchAllFeedbackData() {
  //     try {
  //       const eventId = (await params).id;
  //       const accessToken = localStorage.getItem("accessToken");

  //       if (!accessToken) {
  //         toast({
  //           title: "Authentication Error",
  //           description: "No access token found",
  //           variant: "destructive",
  //         });
  //         return;
  //       }

  //       const { data } = await apiClient.get(`/events/${eventId}/feedback`, {
  //         headers: { Authorization: `Bearer ${accessToken}` }
  //       });

  //       if (isMounted) {
  //         setFeedbacks(data);
  //         if (data.length > 0) {
  //           toast({
  //             title: "Feedback",
  //             description: "Feedback fetched successfully",
  //             variant: "default",
  //           });
  //         }
  //       }
  //     } catch (error: any) {
  //       if (!isMounted) return;

  //       if (error.response?.status === 429 && retryCount < maxRetries) {
  //         retryCount++;
  //         toast({
  //           title: "Rate Limited",
  //           description: `Retrying in ${retryDelay/1000}s (${retryCount}/${maxRetries})`,
  //           variant: "default",
  //         });
  //         setTimeout(() => {
  //           if (isMounted) fetchAllFeedbackData();
  //         }, retryDelay);
  //       } else {
  //         toast({
  //           title: "Error",
  //           description: error.response?.data?.message ||
  //             "Failed to fetch feedback data",
  //           variant: "destructive",
  //         });
  //       }
  //     }
  //   }

  //   fetchAllFeedbackData();
  //   return () => { isMounted = false; };
  // }, [params, toast]);

  useEffect(() => {
    async function fetchData() {
      const eventId = (await params).id;
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/events/${eventId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      try {
        const result = await apiClient.request(config);
        setEventDetails(result);
        toast({
          title: "Event Details",
          description: "Event details fetched successfully.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch event data.",
          variant: "destructive",
        });
      }
    }

    fetchData();
  }, [params, router, toast]);

  useEffect(() => {
    async function fetchRegisteredUsers() {
      const eventId = (await params).id;
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/events/registrations/${eventId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      try {
        const result = await apiClient.request(config);
        setRegisteredUsers(result.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch registered users.",
          variant: "destructive",
        });
      }
    }

    fetchRegisteredUsers();
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
            className="bg-primary whitespace-nowrap text-white px-4 py-2 rounded-xl"
          >
            View Feedback
          </button>
          <FeedbackModal
            eventId={eventDetails.id}
            isOpen={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
            feedbacks={Array.isArray(feedbacks) ? feedbacks : []}
          />
          <button className="w-fit whitespace-nowrap rounded px-3 text-black fill-black border-gray-400 border py-2 flex flex-row items-center gap-2 bg-white">
            <MdDownload className="w-5 h-5" /> Export Event
          </button>
        </div>
      </div>
      <div className="rounded-xl border bg-white w-full border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-medium">{eventDetails.name}</h1>
          <MdOutlineModeEditOutline className="w-5 h-5" />
        </div>
        <hr className="mb-4" />
        <div className="flex justify-between gap-4">
          <div className="grid grid-cols-2 gap-1 w-full">
            {[
              { label: "Event Description", value: eventDetails.description },
              {
                label: "Event Date",
                value: new Date(eventDetails.date).toLocaleDateString(),
              },
              { label: "Event Time", value: eventDetails.time },
              { label: "Event Fee", value: `₦${eventDetails.fee}` },
              { label: "Event Venue", value: eventDetails.venue },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm text-gray-600 font-medium block mb-1">
                  {label}
                </span>
                <span className="text-base font-medium text-gray-800 block">
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full">
            <Image
              src={eventDetails.flyer || "/404.png"}
              width={400}
              height={400}
              alt="Event image"
              className="rounded-xl mx-auto py-3"
            />
          </div>
        </div>
        <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-xl font-semibold text-left">
              Event Registrations
            </h2>
            <Link href={`/admin/events/${eventDetails.id}/attendance`}>
              <Button className="bg-primary text-white text-lg">
                Mark Attendance
              </Button>
            </Link>
          </div>
          <div>
            <UserAttendanceTable
              type="registered"
              columns={registereduserscolumns}
              data={registeredUsers}
              setter={undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PackedEventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <EventDetailsPage params={params} />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
