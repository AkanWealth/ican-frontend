"use client";

import React, { useEffect, useState } from "react";
// import { Pagination } from "@/components/ui/pagination";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { publicationscolumns } from "@/components/admincomps/content/datatable/columns";

import apiClient from "@/services-admin/apiClient";
import { useToast } from "@/hooks/use-toast";

import { BASE_API_URL } from "@/utils/setter";

function Publicatioms() {
  const [data, setData] = useState([]);
  const { toast } = useToast();
  useEffect(() => {
    async function fetchAllContentData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/content`,
        headers: {},
      };
      try {
        const response = await apiClient.get("/publications", config);
        setData(response);
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
    fetchAllContentData();
  }, [toast]);

  return (
    <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
      <h2 className="text-xl font-semibold text-left">All Publications</h2>
      <div>
        <ContentTable columns={publicationscolumns} data={data} />
      </div>
    </div>
  );
}

export default Publicatioms;
