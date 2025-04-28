"use client";

import React, { useState, useEffect } from "react";
import { EventTable } from "@/components/admincomps/event/datatable/EventTable";
import { allcolumns } from "@/components/admincomps/event/datatable/columns";
import { Event } from "@/components/admincomps/event/datatable/colsdata";
import NewEvent from "@/components/admincomps/event/create/NewEvent";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { useToast } from "@/hooks/use-toast";

function EventsPage() {
  const [data, setData] = useState<Event[]>([]);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    async function fetchData() {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/events`,
        };

        const response = await apiClient.request(config);
        setData(response);
        toast({
          title: "Events data fetched successfully!",
          description: "Events data fetched successfully!",
          variant: "default",
        });
      } catch (error) {
        console.error("Error fetching events data:", error);
        toast({
          title: "Error fetching events data!",
          description: "Error fetching events data!",
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, [toast]);

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-2xl text-black">
            Event Management
          </h2>
          <p>View and Manage all events here</p>
        </div>
        <div className="flex flex-row items-center gap-4 justify-end">
          <button
            className="py-2 px-3 text-white bg-primary text-base rounded-full w-fit"
            onClick={() => setShowNewEvent(true)}
          >
            Create New Event
          </button>
          {showNewEvent && (
            <NewEvent
              showNewEvent={showNewEvent}
              setShowNewEvent={setShowNewEvent}
            />
          )}
        </div>
      </div>
      {/* Tab sections */}
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">All Events</h2>
        <div>
          <EventTable columns={allcolumns} data={data} />
        </div>
      </div>
    </div>
  );
}

export default function PackedEventsPage() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <EventsPage />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
