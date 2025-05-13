"use client";

import React, { useEffect, useState } from "react";
// import { Pagination } from "@/components/ui/pagination";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { studentcolumns } from "@/components/admincomps/content/datatable/columns";

import apiClient from "@/services-admin/apiClient";
import { useToast } from "@/hooks/use-toast";

import { BASE_API_URL } from "@/utils/setter";

function Student() {
  const [data, setData] = useState([]);
  const { toast } = useToast();
  useEffect(() => {
    async function fetchStudyData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/studypacks`,
        headers: {},
      };
      try {
        const response = await apiClient.get("/studypacks", config);
        setData(response.studyPacks);
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
    fetchStudyData();
  }, [toast]);

  return (
    <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
      <h2 className="text-xl font-semibold text-left">All Study Packs</h2>
      <div>
        <ContentTable columns={studentcolumns} data={data} />
      </div>
    </div>
  );
}

export default Student;
