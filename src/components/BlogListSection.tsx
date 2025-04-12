"use client";

import * as React from "react";
import BlogCard from "@/components/BlogCard";
import { BlogTabs } from "@/components/BlogTabs";
import { Pagination } from "@/components/Pagination";
import { blogPosts } from "@/lib/data";
import { handleReadMore } from "@/lib/utils";
import { useRouter } from "next/navigation";

/**
 * BlogList Component
 * @description Displays a list of blog posts with tab filtering and pagination.
 * Allows users to filter posts by category and navigate between pages.
 *
 * Features:
 * - Displays blog posts in a grid layout.
 * - Filters posts by category using tabs.
 * - Supports pagination for large sets of posts.
 * - Handles navigation to the detailed blog post view.
 *
 * @returns {JSX.Element} The rendered BlogList component.
 */
const BlogList: React.FC = () => {
  const router = useRouter();

  // State for active category tab and current pagination page
  const [activeTab, setActiveTab] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  /**
   * Filters blog posts based on the active category tab.
   * If no tab is active, all posts are shown.
   *
   * @returns {BlogPost[]} The filtered list of blog posts.
   */
  const filteredPosts = React.useMemo(() => {
    return activeTab
      ? blogPosts.filter((post) => post.category === activeTab)
      : blogPosts;
  }, [activeTab]);

  // Number of posts to display per page
  const postsPerPage = 6;

  // Total number of posts after filtering
  const totalFilteredPosts = filteredPosts.length;

  // Reset pagination to the first page when the active tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  /**
   * Handles changes to the active tab.
   * Updates the active category and resets pagination.
   *
   * @param {string} tab - The selected category tab.
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Compute the posts to display on the current page
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <main className="flex flex-col gap-12 w-full  p-4 lg:p-40  sm:p-20 bg-white">
      {/* Page title */}
      <h1 className="text-3xl font-bold text-blue-900">Latest Blog Posts</h1>

      {/* Blog tabs for category filtering */}
      <BlogTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Blog posts section */}
      <section
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        aria-label="Blog posts"
      >
        {paginatedPosts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            onReadMore={() => handleReadMore(router, post.id)}
          />
        ))}
      </section>

      {/* Pagination controls */}
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalFilteredPosts={totalFilteredPosts}
      />
    </main>
  );
};

export default BlogList;
