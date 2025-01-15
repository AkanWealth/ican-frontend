"use client";

import React from "react";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleReadMore } from "@/lib/utils";
import { blogPosts } from "@/lib/data";

function Stories() {
  const router = useRouter();
  var raw = blogPosts.slice(0, 4);

  return (
    <div className="p-4 sm:p-20 lg:p-40 bg-white flex flex-col  gap-6 justify-between items-center w-full h-fit">
      <div className=" flex flex-col sm:flex-row justify-between items-start sm:items-center w-full  ">
        <h1 className="sm:text-3xl text-2xl font-bold text-blue-900">
          Latest Blog Posts
        </h1>
        <Link
          className=" border-b border-solid text-base whitespace-nowrap w-fit border-black "
          href={"/blog"}
        >
          View all stories
        </Link>
      </div>
      <section
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        aria-label="Blog posts"
      >
        {raw.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            onReadMore={() => handleReadMore(router, post.id)}
          />
        ))}
      </section>
    </div>
  );
}

export default Stories;
