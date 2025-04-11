import * as React from "react";
import { PaginationProps } from "@/types";

/**
 * Pagination Component
 * @description Handles paginated navigation for lists such as blog posts.
 *
 * Props:
 * - `currentPage` (number): The current active page.
 * - `onPageChange` (function): Callback to handle page changes.
 * - `totalFilteredPosts` (number): The total number of posts available after filtering.
 *
 * Features:
 * - Displays a maximum of 5 visible page numbers with ellipses for large datasets.
 * - Includes "Previous" and "Next" buttons for navigation.
 * - Responsive and accessible with proper `aria` attributes.
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  totalFilteredPosts,
}) => {
  const postsPerPage = 6; // Number of posts displayed per page
  const totalPages = Math.max(1, Math.ceil(totalFilteredPosts / postsPerPage)); // Calculate total pages

  /**
   * renderPageNumbers
   * @description Dynamically generates page number buttons with ellipses for large datasets.
   */
  const renderPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 5; // Determine if ellipses are needed

    if (showEllipsis) {
      // Always show the first page
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`w-8 h-8 flex items-center justify-center rounded-sm
            ${
              currentPage === 1
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          aria-current={currentPage === 1 ? "page" : undefined}
        >
          1
        </button>
      );

      // Show starting ellipsis
      if (currentPage > 3) {
        pages.push(
          <span key="ellipsis-start" className="px-2 text-gray-400">
            ...
          </span>
        );
      }

      // Show current page and nearby pages
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-sm
              ${
                currentPage === i
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </button>
        );
      }

      // Show ending ellipsis
      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="ellipsis-end" className="px-2 text-gray-400">
            ...
          </span>
        );
      }

      // Always show the last page
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-8 h-8 flex items-center justify-center rounded-sm
            ${
              currentPage === totalPages
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          aria-current={currentPage === totalPages ? "page" : undefined}
        >
          {totalPages}
        </button>
      );
    } else {
      // For smaller datasets, display all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-sm
              ${
                currentPage === i
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </button>
        );
      }
    }

    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center border border-purple-200 rounded-md p-2"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Previous
      </button>

      {/* Page Number Buttons */}
      <div className="flex items-center gap-1 mx-4">{renderPageNumbers()}</div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </nav>
  );
};
