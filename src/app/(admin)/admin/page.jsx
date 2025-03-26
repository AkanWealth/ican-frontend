"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Toast from "@/components/genui/Toast";

import UserActivities from "@/components/admincomps/dashboard/UserActivities";
import PaymentActivities from "@/components/admincomps/dashboard/PaymentActivities";
import EventActivities from "@/components/admincomps/dashboard/EventActivities";

function AdminDashboard() {
  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-2xl text-black">
            Report and Analytics
          </h2>
          <p>View and Manage all user reports here</p>
        </div>
        {/* <div className="flex flex-row items-center gap-4 justify-end">
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
        </div> */}
      </div>
      {/* Tab sections */}
      <Tabs defaultValue="user" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="user">User Activity</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="event">Event Attendance</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <UserActivities />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentActivities />
        </TabsContent>
        <TabsContent value="event">
          <EventActivities />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;
