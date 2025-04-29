"use client";


import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setters";

import { Resource } from "@/libs/types";

function Publications() {
  const [publications, setPublications] = useState<Resource[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const config = {
      method: "get",
      url: `${BASE_API_URL}/resources/contents`,
    };

    axios
      .request(config)
      .then((res) => {
        setPublications(
          res.data.filter(
            (publication: Resource) => publication.access === "PUBLIC"
          )
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        toast({
          title: "Error fetching publications",
          description: "Please try again later",
          variant: "destructive",
        });
      });
  }, [toast]);

  return <div>Publications</div>;
}

export default Publications;
