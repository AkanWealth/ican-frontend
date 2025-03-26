"use client";

import React, { useState, useEffect } from "react";
import { EventTable } from "@/components/admincomps/event/datatable/EventTable";
import { allcolumns } from "@/components/admincomps/event/datatable/columns";
import { Event } from "@/components/admincomps/event/datatable/colsdata";
import NewEvent from "@/components/admincomps/event/create/NewEvent";
import { getData } from "@/utils/dataFetcher";

function EventsPage() {
  const [data, setData] = useState<Event[]>([]);
  const [showNewEvent, setShowNewEvent] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      setData(result);
    }
    fetchData();
  }, []);

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

export default EventsPage;
