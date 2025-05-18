"use client";

import React from "react";
import TechnicalTile from "@/components/pubntech/TechnicalTile";

import { useRouter } from "next/navigation";
import { handleReadMore } from "@/lib/utils";
import { technicalPosts } from "@/lib/technicaldata";

function Stories() {
  const router = useRouter();
  var raw = technicalPosts.slice(0, 4);

  return (
    <div className="p-4 sm:p-20 lg:p-40 bg-white flex flex-col  gap-6 justify-between items-center w-full h-fit">
      <div className=" flex flex-col sm:flex-row justify-between items-start sm:items-center w-full  ">
        <h1 className="sm:text-3xl text-2xl font-bold text-blue-900">
          Latest Post
        </h1>
        {/* <Link
          className=" border-b border-solid text-base whitespace-nowrap w-fit border-black "
          href={"/blog"}
        >
          View all stories
        </Link> */}
      </div>
      <section
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        aria-label="Posts"
      >
        {raw.map((post) => (
          <TechnicalTile
            key={post.id}
            post={post}
          />
        ))}
      </section>
    </div>
  );
}

export default Stories;
