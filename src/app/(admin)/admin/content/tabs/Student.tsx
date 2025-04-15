"use client";

import React, { useEffect, useState } from "react";
// import { Pagination } from "@/components/ui/pagination";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { studentcolumns } from "@/components/admincomps/content/datatable/columns";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

function Student() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchStudyData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/studypacks`,
        headers: {},
      };
      try {
        const response = await axios.request(config);
        setData(response.data.studyPacks);
      } catch (error) {
        console.error(error);
      }
    }
    fetchStudyData();
  }, []);

  return (
    <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
      <h2 className="text-xl font-semibold text-left">All Content</h2>
      <div>
        <ContentTable columns={studentcolumns} data={data} />
      </div>
    </div>
  );
}

export default Student;
