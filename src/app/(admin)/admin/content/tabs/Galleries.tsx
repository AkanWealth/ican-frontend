"use client";

import React, { useEffect, useState } from "react";

import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { galleriescolumns } from "@/components/admincomps/content/datatable/columns";

import apiClient from "@/services-admin/apiClient";
import { useToast } from "@/hooks/use-toast";



import { BASE_API_URL } from "@/utils/setter";

function Galleries() {
  const [data, setData] = useState([]);
  const { toast } = useToast();


  useEffect(() => {
    async function fetchGalleryData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/gallery`,
        headers: {},
      };
        try {
        const response = await apiClient.get("/gallery", config);
        setData(response.data);
        console.log(response.data);
        toast({
          title: "Gallery",
          description: "Gallery fetched successfully",
          variant: "default",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Error fetching gallery",
          variant: "destructive",
        }); 
      }
    }
    fetchGalleryData();
  }, [toast]);

  return (
    <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
      <h2 className="text-xl font-semibold text-left">All Galleries</h2>
      <div>
        <ContentTable columns={galleriescolumns} data={data} />
      </div>
    </div>
  );
}

export default Galleries;
