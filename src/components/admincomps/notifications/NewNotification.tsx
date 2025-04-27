"use client";
import React, { useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { useToast } from "@/hooks/use-toast";

function NewNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState({
    topic: "",
    title: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_API_URL}/notifications/send`,
        notification,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          withCredentials: true,
        }
      );

      toast({
        title: "Success",
        description: "Notification sent successfully",
        variant: "default",
      });
      setIsOpen(false);
      setNotification({ topic: "EVENT", title: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white rounded-md px-4 py-2"
      >
        New Notification
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl w-[500px]">
            <h2 className="text-xl font-semibold mb-4">
              Send New Notification
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Topic</label>
                <select
                  value={notification.topic}
                  onChange={(e) =>
                    setNotification({ ...notification, topic: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="EVENT">Event</option>
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="UPDATE">Update</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={notification.title}
                  onChange={(e) =>
                    setNotification({ ...notification, title: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  value={notification.message}
                  onChange={(e) =>
                    setNotification({
                      ...notification,
                      message: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NewNotification;
