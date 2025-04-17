"use client";

import React, { useEffect, useState } from "react";
// import { Pagination } from "@/components/ui/pagination";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { blogscolumns } from "@/components/admincomps/content/datatable/columns";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

function Blogs() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchBlogsData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/blogs`,
        headers: {},
      };
      try {
        const response = await axios.request(config);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBlogsData();
  }, []);

  return (
    <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
      <h2 className="text-xl font-semibold text-left">All Blogs</h2>
      <div>
        <ContentTable columns={blogscolumns} data={data} />
      </div>
    </div>
  );
}

export default Blogs;
