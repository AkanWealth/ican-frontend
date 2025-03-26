"use client";

import React, { useEffect, useState } from "react";
// import { Pagination } from "@/components/ui/pagination";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { technicalcolumns } from "@/components/admincomps/content/datatable/columns";
import {
  Content,
  contents,
} from "@/components/admincomps/content/datatable/colsdata";

async function getData(): Promise<Content[]> {
  return contents;
}

function Technical() {
  const [data, setData] = useState<Content[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      const filteredData = result.filter(
        (content) => content.category === "technical"
      );

      setData(filteredData);
    }
    fetchData();
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
