"use client";

import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

import { useToast } from "@/components/ui/use-toast";
import apiClient from "@/services-admin/apiClient";


interface Feedback {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export default function FeedbackModal({
  eventId,
  isOpen,
  onClose,
  feedbacks,
}: {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  feedbacks: Feedback[];
}) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    let retryTimeout: NodeJS.Timeout;

    const fetchFeedbacks = async (retryCount = 0) => {
      try {
        const response = await apiClient.get(`/events/${eventId}/feedback`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          signal: abortController.signal
        });

        if (isMounted) {
          console.log(response.data);
          toast({
            title: "Success", 
            description: "Feedbacks fetched successfully",
            variant: "default",
          });
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error("Error fetching feedbacks:", error);
        
        if (retryCount < 2) {
          retryTimeout = setTimeout(() => fetchFeedbacks(retryCount + 1), 1000 * (retryCount + 1));
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch feedbacks after multiple attempts",
            variant: "destructive",
          });
        }
      }
    };

    fetchFeedbacks();
    return () => {
      isMounted = false;
      abortController.abort();
      clearTimeout(retryTimeout);
    };
  }, [eventId]); // Removed toast from dependencies as it's stable

  // Sort and filter feedbacks
  const sortedFeedbacks = [...feedbacks]
    .filter((feedback) =>
      selectedRating ? feedback.rating === selectedRating : true
    )
    .sort((a, b) => {
      return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Event Feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Sorting and filtering controls */}
        <div className="flex gap-4 mb-6">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border rounded p-2"
          >
            <option value="desc">Highest to Lowest</option>
            <option value="asc">Lowest to Highest</option>
          </select>

          <select
            value={selectedRating || ""}
            onChange={(e) =>
              setSelectedRating(e.target.value ? Number(e.target.value) : null)
            }
            className="border rounded p-2"
          >
            <option value="">All Ratings</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Stars
              </option>
            ))}
          </select>
        </div>

        {/* Feedback list */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {sortedFeedbacks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No feedback available</p>
              {selectedRating && (
                <p className="text-gray-400 mt-2">
                  Try selecting a different rating filter
                </p>
              )}
            </div>
          ) : (
            sortedFeedbacks.map((feedback) => (
              <div key={feedback.id} className="border rounded p-4">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= feedback.rating ? (
                      <StarIcon
                        key={star}
                        className="h-5 w-5 text-yellow-400"
                      />
                    ) : (
                      <StarOutline
                        key={star}
                        className="h-5 w-5 text-yellow-400"
                      />
                    )
                  )}
                </div>
                <p className="text-gray-700">{feedback.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
