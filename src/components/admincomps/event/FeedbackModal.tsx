"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  feedbacks,
}: {
  isOpen: boolean;
  onClose: () => void;
  feedbacks: Feedback[];
}) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

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
          {sortedFeedbacks.map((feedback) => (
            <div key={feedback.id} className="border rounded p-4">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= feedback.rating ? (
                    <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
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
          ))}
        </div>
      </div>
    </div>
  );
}
