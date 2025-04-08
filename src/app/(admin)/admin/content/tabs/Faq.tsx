"use client";

import React, { useEffect, useState } from "react";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { faqcolumns } from "@/components/admincomps/content/datatable/columns";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

function Faq() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchFAQData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/faqs`,
        headers: {},
      };
      try {
        const response = await axios.request(config);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchFAQData();
  }, []);

  return (
    <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
      <h2 className="text-xl font-semibold text-left">FAQ</h2>
      <div>
        <ContentTable columns={faqcolumns} data={data} />
      </div>
    </div>
  );
}

export default Faq;
