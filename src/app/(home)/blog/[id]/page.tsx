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
    <main className="flex flex-col items-center bg-white  mt-16 2xl:container mx-auto">
      {/** First Section: Main Blog Content */}
      <section className="p-4 sm:p-20 lg:px-40 border-b-2 border-gray-200">
        <article className="flex flex-col max-w-full">
          {/** Back Button */}
          <div
            className="flex justify-center items-center px-2 w-8 h-8 bg-blue-900 min-h-[32px] rounded-[999px] cursor-pointer"
            onClick={() => router.back()} // Go back to the previous page
          >
            <FaArrowLeft className="fill-white h-6 w-6" />
          </div>

          {/** Blog Title */}
          <h1 className="mt-4 text-3xl text-black flex flex-row justify-between  items-center sm:text-4xl font-bold leading-[50px]  max-md:max-w-full">
            {post.title}

            <span className="font-semibold  text-base">
              by {post.authorName}
            </span>
          </h1>

          {/** Date */}
          <time className="mt-4 text-base font-semibold text-stone-500 max-md:max-w-full">
            {post.date}
          </time>

          {/** Blog Image */}
          <Image
            loading="lazy"
            width={100}
            height={100}
            src={post.coverImage}
            className="object-cover mt-12 max-w-full rounded-2xl aspect-[2.27] w-full max-md:mt-10"
            alt={post.title} // Alt text for the image
          />

          {/** Blog Content */}
          <section className="flex flex-col items-start mt-12 max-w-full text-base leading-6 text-neutral-800 max-md:mt-10 mx-auto">
            <div
              className="text-base font-semibold mb-4 prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.contentBody }}
            />
          </section>
        </article>
      </section>

      {/** Second Section: Comment Section */}
      <section className=" hidden mr-auto p-4 sm:p-20 lg:px-40">
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
