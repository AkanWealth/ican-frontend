"use client";

import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "@/utils/setter";
import apiClient from "@/services-admin/apiClient";
import Cookies from "universal-cookie";
import { useToast } from "@/hooks/use-toast";

import { useRouter } from "next/navigation";
import { RegisteredUsers } from "@/libs/types";

import { UserAttendanceTable } from "@/components/admincomps/event/attendance/UserAttendanceTable";
import { registereduserscolumns } from "@/components/admincomps/event/attendance/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function EventAttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const [selected, setSelected] = useState<string[]>([]);

  const router = useRouter();
  const { toast } = useToast();
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUsers[]>([]);

  const [isLoading, setIsLoading] = useState(false);

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

  const handleMarkAttendance = async (status: string) => {
    if (selected.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one attendee",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const eventId = (await params).id;
    const config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/events/registrations/${eventId}/attendance/bulk`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: {
        regIds: selected,
        status: status,
      },
    };

    try {
      const result = await apiClient.request(config);

      router.refresh();
      toast({
        title: "Success",
        description: "Attendance marked successfully",
        variant: "default",
      });
      setSelected([]);
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Button onClick={() => router.back()} variant="outline" size="sm">
            ← Back
          </Button>
          <div className="flex flex-col gap-3">
            <h2 className="font-semibold text-2xl text-black">
              Event Attendance
            </h2>
            <p>View and Manage all events attendees here</p>
          </div>
        </div>
      </div>
      {/* Tab sections */}
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Event Name</h2>
        <div className="flex flex-row justify-between w-full items-center py-4">
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span>Mark Attendance</span>
                  {selected.length > 0 && (
                    <Badge variant="secondary">
                      {selected.length} selected
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mark Attendance</DialogTitle>
                  <DialogDescription>
                    {selected.length} attendee{selected.length !== 1 ? "s" : ""}{" "}
                    selected
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleMarkAttendance("PRESENT")}
                      disabled={isLoading}
                    >
                      {isLoading ? "Marking..." : "Mark as Present"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleMarkAttendance("ABSENT")}
                      disabled={isLoading}
                    >
                      {isLoading ? "Marking..." : "Mark as Absent"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div>
          <UserAttendanceTable
            type="attendance"
            setter={setSelected}
            columns={registereduserscolumns}
            data={registeredUsers}
          />
        </div>
      </div>
    </div>
  );
}

export default EventAttendancePage;
