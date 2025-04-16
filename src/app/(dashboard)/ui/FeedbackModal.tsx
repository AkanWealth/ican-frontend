"use client";
import { X, Star } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

// Define the type for the modal props
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string | null; // Allow both undefined and null
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  eventId,
}) => {
  const [feedbackData, setFeedbackData] = useState({
    comment: "",
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Submit feedback to API
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate input
    if (!eventId) {
      setError("No event selected for feedback");
      return;
    }

    // Validate feedback
    if (feedbackData.comment.trim() === "") {
      setError("Please provide a feedback comment");
      return;
    }

    if (feedbackData.rating === 0) {
      setError("Please provide a rating");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare feedback payload
      const payload = {
        comment: feedbackData.comment,
        rating: feedbackData.rating,
      };

      // Submit feedback to API
      const response = await axios.post(
        `https://ican-api-6000e8d06d3a.herokuapp.com/api/events/${eventId}/feedback`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response", response);
      // setTimeout(() => {
      if (response.status === 201) {
        toast({
          title: "Feedback submitted successfully!",
          description: " ",
          variant: "default",
          duration: 2000,
        });
      }
      // }, 3000);

      setFeedbackData({ comment: "", rating: 0 });
      onClose();
    } catch (err) {
      // Handle API submission error
      console.error("Feedback submission error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to submit feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  // Prevent modal from closing when clicking inside it
  const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-30 z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <h3 className="text-2xl font-semibold mb-4">Event Feedback</h3>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Feedback Input */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Feedback<span className="text-red-600 text-lg">*</span>
            </label>
            <textarea
              value={feedbackData.comment}
              onChange={(e) =>
                setFeedbackData((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder:text-sm"
              placeholder="Enter feedback on the event"
              required
            />
          </div>

          {/* Rating Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Rate your experience
              <span className="text-red-600 text-lg">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setFeedbackData((prev) => ({
                      ...prev,
                      rating: star,
                    }))
                  }
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= feedbackData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-sm bg-blue-800 text-white rounded-full hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
