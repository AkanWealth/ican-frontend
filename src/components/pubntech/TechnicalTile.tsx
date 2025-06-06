import React from "react";
import Image from "next/image";
import { TechnicalPost } from "@/libs/types";

interface TechnicalTileProps {
  post: TechnicalPost;
}

export default function TechnicalTile({ post }: TechnicalTileProps) {
  return (
    <div className="min-w-[350px] relative gap-8 sm:gap-6 p-0 sm:pr-4 rounded-3xl border border-gray-300 justify-start items-center flex flex-col sm:flex-row">
      {/* technical sessions image */}
      <div className="sm:w-[253px] w-full h-[200px] sm:h-full sm:rounded-l-xl relative overflow-hidden sm:flex-shrink-0">
        <Image
          src={post.coverImg}
          alt={`Image for ${post.name}`}
          className="object-cover rounded-t-3xl sm:rounded-t-none sm:rounded-l-3xl"
          fill
          sizes="(max-width: 640px) 100vw, 253px"
          priority
        />
      </div>

      <div className="flex-col flex-1 justify-start items-start gap-4 inline-flex sm:p-6 py-8 px-4 z-10 bg-white">
        <span
          className={`inline-block py-1 text-sm leading-tight bg-[#2C9D27] text-white rounded p-2`}
        >
          Technical Session
        </span>

        <h2 className="sm:mt-4 m-0 text-xl font-semibold leading-6 text-neutral-800">
          {post.name}
        </h2>

        <time className="sm:mt-4 m-0 text-sm leading-snug text-neutral-600">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        <a href={post.document} download={post.name}>
          <button className="px-4 py-1 rounded-full text-sm text-white font-semibold bg-blue-900 hover:bg-white hover:border hover:border-primary hover:text-primary">
            Download
          </button>
        </a>
      </div>
    </div>
  );
}
