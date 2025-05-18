"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import Heroimg from "@/components/homecomps/Heroimg";
import { Publication, Resource } from "@/libs/types";
import PublicationsSect from "@/components/pubntech/PublicationsSect";

function Publications() {
  const [publications, setPublications] = useState<Resource[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPublications = async () => {
      const config = {
        method: "get",
        url: `${BASE_API_URL}/resources/contents`,
      };

      try {
        const response = await axios.request(config);
        setPublications(response.data.data.filter((pub: Publication) => pub.access === "PUBLIC"));
        setLoading(false);

      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        toast({
          title: "Error fetching publications",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };
    fetchPublications();
  }, [toast]);

  return (
    <div className="flex flex-col items-center w-full">
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="Publications & Resources"
        imageUrl="/publicationshero.png"
      />
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto">
        <PublicationsSect
          publications={publications}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default Publications;
