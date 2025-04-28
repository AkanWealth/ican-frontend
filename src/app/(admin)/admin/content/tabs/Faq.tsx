"use client";

import React, { useEffect, useState } from "react";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { faqcolumns } from "@/components/admincomps/content/datatable/columns";

import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";
import { useToast } from "@/hooks/use-toast";

function Faq() {
  const [data, setData] = useState([]);
  const { toast } = useToast();
  useEffect(() => {
    async function fetchFAQData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/faqs`,
        headers: {},
      };
      try {
        const response = await apiClient.get("/faqs", config);
        setData(response.faqs);
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
    fetchFAQData();
  }, [toast]);

  return (
    <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
      <h2 className="text-xl font-semibold text-left">All FAQ</h2>
      <div>
        <ContentTable columns={faqcolumns} data={data} />
      </div>
    </div>
  );
}

export default Faq;
