"use client";

import React, { useEffect, useState } from "react";

import { UserAttendanceTable } from "@/components/admincomps/event/attendance/UserAttendanceTable";
import { userattendancecolumns } from "@/components/admincomps/event/attendance/columns";
import {
  UserAttendance,
  userattendances,
} from "@/components/admincomps/event/attendance/colsdata";

function EventAttendancePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [data, setData] = useState<UserAttendance[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result = userattendances;
      setData(result);
    }
    fetchData();
  }, []);
  useEffect(() => {
    console.log("Selected recipients:", selected);
  }, [selected]);
  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-2xl text-black">
            Event Attendance
          </h2>
          <p>View and Manage all events attendees here</p>
        </div>
      </div>
      {/* Tab sections */}
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Event Registration</h2>
        <div>
          <UserAttendanceTable
            setter={setSelected}
            columns={userattendancecolumns}
            data={data}
          />
        </div>
      </div>
    </div>
  );
}

export default EventAttendancePage;
