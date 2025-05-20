"use client";

import React, { useEffect, useState } from "react";
import TechnicalTile from "@/components/pubntech/TechnicalTile";

import { useRouter } from "next/navigation";
import { handleReadMore } from "@/lib/utils";
import { technicalPosts } from "@/lib/technicaldata";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { TechnicalPost } from "@/libs/types";
import { useToast } from "@/hooks/use-toast";




function Stories() {
  
   const { toast } = useToast();
  const [technicalPosts, setTechnicalPosts] = useState<TechnicalPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const postsPerPage = 4;

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BASE_API_URL}/technical-sessions`)
      .then((res) => {
        setTechnicalPosts(
          res.data.sessions.filter(
            (session: TechnicalPost) => session.status === "PUBLISHED"
          )
        );
        setIsLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error fetching technical posts",
          description: "Please try again later",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [toast]);
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
