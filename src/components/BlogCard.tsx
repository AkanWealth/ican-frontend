import * as React from "react";
import { BlogCardProps } from "@/types";

export const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore }) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      onReadMore(post.id);
    }
  };

  const categoryColors: Record<"Articles" | "News" | "Videos", { bg: string; text: string }> = {
    Articles: {
        bg: "bg-lime-300",
        text: "text-black",
    },
    News: {
        bg:"bg-[#1A379A]",
        text: "text-white",

    },
    Videos:{
        bg:  "bg-[#2E8E4A]",
        text: "text-white",
    },
  };

  const categoryColor = categoryColors[post.category] ||  {
    bg: "bg-gray-300",
    text: "text-black",
  }; 


  return (
    <div className="min-w-[500px] gap-6 h-auto pr-4 rounded-lg border border-gray-300 justify-start items-center  flex flex-row">
      <div className="w-[253px] h-full ">
        <img
          loading="lazy"
          src={post.imageUrl}
          alt=""
          className=" h-full   object-cover  rounded-tl-lg rounded-bl-lg"
        />
      </div>
      <div className=" flex-col flex-1   justify-start items-start gap-4 inline-flex pt-6 pb-6">
        <span
          className={`inline-block  py-1 text-sm leading-tight ${categoryColor.bg} ${categoryColor.text} rounded text-neutral-900 p-2`}
        >
          {post.category}
        </span>
        <h2 className="mt-4 text-xl font-semibold leading-6 text-neutral-800">
          {post.title}
        </h2>
        <time className="mt-4 text-sm leading-snug text-neutral-600">
          {post.date}
        </time>
        <button
          onClick={() => onReadMore(post.id)}
          onKeyPress={handleKeyPress}
          className="mt-4 text-base font-semibold text-blue-900 text-left hover:underline focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
          aria-label={`Read more about ${post.title} in ${post.category}`}
        >
          Read more&gt;&gt;
        </button>
      </div>
    </div>
  );
};