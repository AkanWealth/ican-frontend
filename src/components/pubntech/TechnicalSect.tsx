"use client";

import React, { useEffect, useState } from "react";
import TechnicalTile from "./TechnicalTile";
import { technicalPosts } from "@/lib/technicaldata";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { TechnicalPost } from "@/libs/types";
import { useToast } from "@/hooks/use-toast";

function TechnicalSect() {
  const { toast } = useToast();
  const [technicalPosts, setTechnicalPosts] = useState<TechnicalPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  useEffect(() => {
    axios
      .get(`${BASE_API_URL}/technical-sessions`)
      .then((res) => {
        setTechnicalPosts(
          res.data.sessions.filter(
            (session: TechnicalPost) => session.status === "PUBLISHED"
          )
        );
      })
      .catch((err) => {
        toast({
          title: "Error fetching technical posts",
          description: "Please try again later",
          variant: "destructive",
        });
      });
  }, [toast]);

  return (
    <div className=" p-4  sm:p-20 lg:px-40 w-full flex flex-col gap-12 justify-start items-start ">
      <h3 className="text-primary text-3xl sm:text-4xl font-bold font-mono ">
        Technical Sessions{" "}
      </h3>
      <section
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        aria-label="Downloadable Contents"
      >
        {technicalPosts.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <p className="text-gray-500 text-lg">
              No published technical sessions available at the moment.
            </p>
          </div>
        ) : (
          technicalPosts
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
            .map((post) => <TechnicalTile key={post.id} post={post} />)
        )}
      </section>
    </div>
  );
}

export default TechnicalSect;
