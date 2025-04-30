"use client";

import React, { useEffect, useState } from "react";
// import { Pagination } from "@/components/ui/pagination";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { resourcescolumns } from "@/components/admincomps/content/datatable/columns";

import apiClient from "@/services-admin/apiClient";
import { useToast } from "@/hooks/use-toast";

import { BASE_API_URL } from "@/utils/setter";

import { Resource } from "@/libs/types";

function Resources() {
  const [data, setData] = useState<Resource[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    async function fetchAllContentData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/resources/contents`,
        headers: {},
      };
      try {
        const response = await apiClient.get("/resources/contents", config);
        setData(response.data);
        toast({
          title: "Content fetched successfully",
          description: "Content fetched successfully",
          variant: "default",
        });
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
      <h2 className="text-xl font-semibold text-left">All Resources</h2>
      <div>
        <ContentTable columns={resourcescolumns} data={data} />
      </div>
    </div>
  );
}

export default Resources;
