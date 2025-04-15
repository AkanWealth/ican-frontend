"use client";

import React, { useEffect, useState } from "react";
// import { Pagination } from "@/components/ui/pagination";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { technicalcolumns } from "@/components/admincomps/content/datatable/columns";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

function Technical() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchTSData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/technical-sessions`,
        headers: {},
      };
      try {
        const response = await axios.request(config);
        setData(response.data.sessions);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTSData();
  }, []);

  return (
    <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
      <h2 className="text-xl font-semibold text-left">All Content</h2>
      <div>
        <ContentTable columns={technicalcolumns} data={data} />
      </div>
    </div>
  );
}

export default Technical;
