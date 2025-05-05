"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";

import axios from "axios";

import { toast, useToast } from "@/hooks/use-toast";

import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import BlogCard from "@/components/homecontent/BlogCard";
import { shuffleArray, handleReadMore } from "@/lib/utils";
import Getin from "@/components/homecomps/Getin";
import { BASE_API_URL } from "@/utils/setter";
import type { BlogPost } from "@/types";

export default function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>; // The `params` prop represents the dynamic URL parameter, specifically the `id` of the blog post.
}) {
  const router = useRouter(); // Hook to navigate programmatically

  // Destructure and resolve the promise to extract `id`
  const { id } = use(params);

  const [post, setPost] = useState<BlogPost>({
    id: "",
    authorName: "",
    contentBody: "",
    createdAt: "",
    updatedAt: "",
    contentType: "articles",
    coverImage: "",
    title: "",
    date: "",
  });
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/blogs/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        toast({
          title: "Error",
          description: "Failed to load blog post. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/blog`);
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
  }, []);

  // Find related blogs based on the same category, excluding the current post
  // Shuffle the related blogs and slice the first 2 for display
  const relatedBlogs = post
    ? shuffleArray(
        blogPosts.filter(
          (p) => p.contentType === post.contentType && p.id !== id
        )
      ).slice(0, 2)
    : [];

  return (
    <main className="flex flex-col items-center bg-white mt-20 w-full mx-auto">
      {/** First Section: Main Blog Content */}
      <section className="w-full max-w-[1400px] px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-12 border-b-2 border-gray-200">
        <article className="flex flex-col w-full">
          {/** Blog Title with Integrated Back Button */}
          <div className="flex items-start gap-3 mt-2">
            <button
              className="flex justify-center items-center px-2 w-8 h-8 bg-blue-900 min-h-[32px] rounded-full cursor-pointer transition-transform hover:scale-105 mt-1"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <FaArrowLeft className="fill-white h-4 w-4" />
            </button>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                <span className="font-semibold text-sm sm:text-base text-gray-700">
                  by {post.authorName}
                </span>
                <time className="text-sm md:text-base font-semibold text-stone-500">
                  {post.date}
                </time>
              </div>
            </div>
          </div>

          {/** Blog Image - Constrained Size */}
          <div className="mt-8 w-full flex justify-center">
            <div className="w-full max-w-4xl">
              <Image
                loading="lazy"
                width={500}
                height={500}
                src={post.coverImage}
                className="object-cover w-full h-auto max-h-[500px] rounded-lg md:rounded-xl shadow-sm"
                alt={post.title}
              />
            </div>
          </div>

          {/** Blog Content */}
          <section className="mt-8 md:mt-10 w-full">
            <div
              className="prose prose-sm sm:prose md:prose-lg lg:prose-xl max-w-none prose-headings:text-blue-900 prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: post.contentBody }}
            />
          </section>
        </article>
      </section>

      {/** Second Section: Comment Section */}
      <section className="hidden mr-auto p-4 sm:p-20 lg:px-40">
        <Getin
          heading={"LEAVE A COMMENT"} // Heading for the comment section
          phoneNumber={false} // A boolean flag to toggle phone number visibility
          className={"max-w-[633px]"} // Custom class for the section's width
        />
      </section>

      {/** Third Section: Related Blogs */}
      <section className="hidden flex-col w-full gap-12 p-4 sm:p-20 lg:px-40 sm:bg-[#E0F5E6]">
        <h2 className="text-3xl font-bold text-blue-900">Related Blogs</h2>

        {/** Display Related Blog Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {relatedBlogs.map((post) => (
            <BlogCard
              key={post.id} // Unique key for each related blog card
              post={post} // Pass post data as a prop to the BlogCard component
              onReadMore={() => handleReadMore(router, post.id)} // Navigate to the related post
            />
          ))}
        </div>
      </section>
    </main>
  );
}
