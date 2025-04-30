"use client";

import * as React from "react";
import BlogCard from "@/components/homecontent/BlogCard";
import { Pagination } from "@/components/homecomps/Pagination";
import { handleReadMore } from "@/lib/utils";
import { useRouter } from "next/navigation";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { BlogPost } from "@/types";

import { useToast } from "@/hooks/use-toast";

const BlogList: React.FC = () => {
  const { toast } = useToast();

  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>([]);
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredPosts = React.useMemo(() => {
    return activeTab
      ? blogPosts.filter((post) => post.contentType === activeTab)
      : blogPosts;
  }, [activeTab, blogPosts]);

  const postsPerPage = 10;

  const totalFilteredPosts = filteredPosts.length;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  React.useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/blogs`);
        setBlogPosts(response.data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        toast({
          title: "Error",
          description: "Failed to load blog posts. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchBlogPosts();
  }, [toast]);



  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <main className="flex flex-col gap-12 w-full  p-4 lg:p-40  sm:p-20 bg-white">
      {/* Page title */}
      <h1 className="text-3xl font-bold text-blue-900">Latest Blog Posts</h1>

      {/* Blog tabs for category filtering */}

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
